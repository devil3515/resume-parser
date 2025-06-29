import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def analyze_job_match(resume_data: dict, job_description: str, model="llama3-70b-8192") -> dict:
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"""
You are an AI job match analyzer. Compare the parsed resume with the job description and return the following:

- overallMatch (0-100): How well the resume matches overall
- skillsMatch (0-100): Match based on required vs. resume skills
- experienceMatch (0-100): Match based on relevant work history
- educationMatch (0-100): Match based on degree and school
- missingKeywords: Important keywords in the job description that are missing in the resume
- recommendedImprovements: Specific changes to improve the match

Return JSON only, without any markdown or commentary.

Resume Data:
{json.dumps(resume_data, indent=2)}

Job Description:
{job_description}
"""

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that evaluates job-resume matches."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
    }

    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        if response.status_code == 200:
            content = response.json()['choices'][0]['message']['content']

            # Trim markdown or commentary if included
            content = content.strip()
            content = content.replace("```json", "").replace("```", "").strip()
            last_brace = content.rfind("}")
            if last_brace != -1:
                content = content[:last_brace + 1]
            print(content)

            return json.loads(content)
        else:
            return {
                "error": f"API request failed with status code {response.status_code}",
                "overallMatch": 0,
                "skillsMatch": 0,
                "experienceMatch": 0,
                "educationMatch": 0,
                "missingKeywords": [],
                "recommendedImprovements": []
            }
    except Exception as e:
        return {
            "error": str(e),
            "overallMatch": 0,
            "skillsMatch": 0,
            "experienceMatch": 0,
            "educationMatch": 0,
            "missingKeywords": [],
            "recommendedImprovements": []
        }
