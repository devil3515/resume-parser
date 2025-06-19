import os
import re
import json
from dotenv import load_dotenv
import requests

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def clean_json_string(s):
    # Remove trailing commas before } or ]
    s = re.sub(r",\s*([}\]])", r"\1", s)
    # Remove markdown formatting
    s = re.sub(r"^```(json)?", "", s, flags=re.IGNORECASE).strip()
    s = re.sub(r"```$", "", s).strip()
    return s

def ats_extractor(resume_data, model="llama3-70b-8192"):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = '''
    You are an AI bot designed to act as a professional for parsing resumes. You are given a resume and your job is to extract the following information:
    - name
    - email
    - phone
    - linkedin
    - address (if available)
    - portfolio (if available)
    - summary (2-3 sentence professional summary)
    - skills (as a list)
    - title (job title)
    - company
    - start_date (if available)
    - end_date (if available)
    - description (main bullet point or summary of experience)
    - degree
    - university
    - graduation_year (if available)
    - Projects (if available): list of projects with
        - name (project name)
        - description (project description)
        - technologies (if available)
    
    Only return valid JSON. Ensure all strings are properly closed and formatted. Do not include trailing commas, incomplete objects, or markdown formatting.
    
    Resume text:
    \"\"\"{resume_data}\"\"\"
    '''

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that parses resumes into structured JSON data."},
            {"role": "user", "content": prompt.format(resume_data=resume_data)}
        ],
        "temperature": 0.2
    }

    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)

        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content'].strip()

            # Try to isolate valid JSON block using regex
            match = re.search(r"\{[\s\S]*\}", content)
            if match:
                json_string = clean_json_string(match.group())

                try:
                    parsed_data = json.loads(json_string)
                    return parsed_data
                except json.JSONDecodeError as e:
                    return {"error": "Failed to parse JSON after cleaning", "raw": json_string, "message": str(e)}
            else:
                return {"error": "No valid JSON object found", "raw": content}

        else:
            return {"error": f"API request failed with status code {response.status_code}", "message": response.text}

    except requests.exceptions.RequestException as e:
        return {"error": "Request failed", "message": str(e)}

    except json.JSONDecodeError:
        return {"error": "Failed to parse JSON from response", "raw": response.text}
    


def job_description_sample(job_description, model="llama3-70b-8192"):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = '''
    You are an AI bot designed to act as a Job Poster.
    Your job is to generate a job description for a given job title and company.
    You will be given a job title and you need to generate a job description for that job title.
    '''
