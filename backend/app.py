# import os, sys
# from flask import Flask ,request, render_template
# from pypdf import PdfReader
# import json
# from resumeparser import ats_extractor
# from dotenv import load_dotenv

# sys.path.insert(0, os.path.abspath(os.getcwd()))


# UPLOAD_PATH = r"__DATA__"
# app = Flask(__name__)

# @app.route('/')
# def index():
#     return render_template('index.html')
# @app.route("/process", methods=["POST"])
# def ats():
#     doc = request.files['pdf_doc']
#     doc.save(os.path.join(UPLOAD_PATH, "file.pdf"))
#     doc_path = os.path.join(UPLOAD_PATH, "file.pdf")
#     data = _read_file_from_path(doc_path)
#     data = ats_extractor(data)

#     return render_template('index.html', data=data)
 
# def _read_file_from_path(path):
#     reader = PdfReader(path) 
#     data = ""

#     for page_no in range(len(reader.pages)):
#         page = reader.pages[page_no] 
#         data += page.extract_text()

#     return data 


# if __name__ == "__main__":
#     app.run(port=8000, debug=True)




import os, sys
from flask import Flask, request, jsonify
from pypdf import PdfReader
from resumeparser import ats_extractor
from dotenv import load_dotenv
from flask_cors import CORS


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



CORS(app)  # Enable CORS for all routes
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
