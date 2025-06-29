import os, sys
from flask import Flask, request, jsonify
from pypdf import PdfReader
from resumeparser import ats_extractor
from dotenv import load_dotenv
from flask_cors import CORS
from jobmatcher import analyze_job_match
import requests
import json
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


sys.path.insert(0, os.path.abspath(os.getcwd()))

UPLOAD_PATH = "__DATA__"
os.makedirs(UPLOAD_PATH, exist_ok=True)

app = Flask(__name__)

@app.route("/")
def index():
    return "Resume Parser API is running."

@app.route("/process", methods=["POST"])
def ats():
    if 'pdf_doc' not in request.files:
        return jsonify({"error": "No file part"}), 400

    doc = request.files['pdf_doc']
    if doc.filename == '':
        return jsonify({"error": "No selected file"}), 400

    doc_path = os.path.join(UPLOAD_PATH, "file.pdf")
    doc.save(doc_path)

    data = _read_file_from_path(doc_path)
    parsed_data = ats_extractor(data)

    return jsonify(parsed_data)

def _read_file_from_path(path):
    reader = PdfReader(path)
    data = ""
    for page in reader.pages:
        data += page.extract_text()
    return data


@app.route("/analyze-match", methods=["POST"])
def analyze_match():
    if 'pdf_doc' not in request.files or 'job_description' not in request.form:
        return jsonify({"error": "Missing file or job description"}), 400

    doc = request.files['pdf_doc']
    job_description = request.form['job_description']
    doc_path = os.path.join(UPLOAD_PATH, "file.pdf")
    doc.save(doc_path)

    resume_text = _read_file_from_path(doc_path)
    parsed_data = ats_extractor(resume_text)
    match_data = analyze_job_match(parsed_data, job_description)

    return jsonify(match_data)

@app.route("/generate-sample-jd", methods=["POST"])
def generate_sample_jd():
    data = request.get_json()
    parsed_resume = data.get("resume")

    if not parsed_resume:
        return jsonify({"error": "No resume data provided"}), 400

    # Use the LLM to generate a job description based on resume
    prompt = f"""
You are a job description generator. Based on the candidate's resume details below, generate a realistic job description that this person would be suitable for. Format it professionally. Do not return markdown or commentary. Resume:

{json.dumps(parsed_resume, indent=2)}
    """

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-70b-8192",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that writes job descriptions."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.4
    }

    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        if response.status_code == 200:
            content = response.json()["choices"][0]["message"]["content"].strip()
            # Remove code block if present
            content = content.replace("```", "").strip()
            return jsonify({"job_description": content})
        else:
            return jsonify({"error": "Failed to generate job description", "message": response.text}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500



CORS(app)  # Enable CORS for all routes
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port,debug=True)