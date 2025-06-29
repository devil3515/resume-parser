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
    - Projects (if available)
    - project_title (if available)
    - project_detail (if available)
    - project technologies (if available)
    - graduation_year (if available)
    Give the extracted information in json format only.
    Resume text:
    \"\"\"{resume_data}\"\"\"
    '''

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that parses resumes into structured data."},
            {"role": "user", "content": prompt.format(resume_data=resume_data)}
        ],
        "temperature": 0.2
    }

    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        
        # Check if the request was successful
        if response.status_code == 200:
            result = response.json()  # Parse the response as JSON
            content = result['choices'][0]['message']['content']

            # Remove unwanted text using regex
            # Remove 'Here is the extracted information in JSON format:' and any leading/trailing spaces/newlines
            content = re.sub(r"Here is the extracted information in JSON format:\s*```", "", content)
            content = re.sub(r"```", "", content)

            # Clean up any leading or trailing whitespace or newlines
            content = content.strip()

            # Ensure we only return valid JSON
            if content.startswith("{") and content.endswith("}"):
                parsed_data = json.loads(content)
                return parsed_data
            else:
                # Return the raw response if it doesn't look like valid JSON
                return {"error": "Invalid JSON format", "raw": content}
        else:
            # Handle non-200 status codes
            return {"error": f"API request failed with status code {response.status_code}", "message": response.text}

    except requests.exceptions.RequestException as e:
        # Handle errors related to the request itself
        return {"error": "Request failed", "message": str(e)}

    except json.JSONDecodeError:
        # Handle errors related to parsing the JSON
        return {"error": "Failed to parse JSON from response", "raw": response.text}