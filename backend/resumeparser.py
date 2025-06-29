import os
import re
import json
from dotenv import load_dotenv
import requests

load_dotenv()

# API details
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def ats_extractor(resume_data, model="llama3-70b-8192"):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = '''
   You are an AI bot designed to parse resumes. Extract the following fields in **valid JSON format only**. Do not add explanations, code blocks, or any trailing notes. Return only a JSON object.
    - name
    - email
    - phone
    - linkedin
    - address (if available)
    - portfolio (if available)
    - summary (2-3 sentence professional summary)
    - skills (as a list)
    - experience_title
    - company
    - start_date (if available)
    - end_date (if available)
    - experience_detail (main bullet point or summary of experience)
    - degree
    - university
    - graduation_year (if available)
    - Projects (if available): list of projects with
        - project_title
        - project_detail
        - project_technologies (if available)
    
    Return only a valid JSON object. Do not include any commentary, notes, or markdown formatting.
    
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

            # Remove any markdown code block formatting
            content = re.sub(r"^```(json)?", "", content, flags=re.IGNORECASE).strip()
            content = re.sub(r"```$", "", content).strip()

            # Try to isolate valid JSON block using regex if needed
            match = re.search(r"\{[\s\S]*\}", content)
            if match:
                json_string = match.group()
                try:
                    parsed_data = json.loads(json_string)
                    return parsed_data
                except json.JSONDecodeError as e:
                    return {"error": "Failed to parse JSON", "raw": json_string, "message": str(e)}
            else:
                return {"error": "No valid JSON object found", "raw": content}

        else:
            return {"error": f"API request failed with status code {response.status_code}", "message": response.text}

    except requests.exceptions.RequestException as e:
        return {"error": "Request failed", "message": str(e)}

    except json.JSONDecodeError:
        return {"error": "Failed to parse JSON from response", "raw": response.text}