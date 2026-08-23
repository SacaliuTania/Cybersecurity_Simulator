import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

import json
import uuid
import random
from dotenv import load_dotenv
from fastapi import FastAPI
from google import genai

from pydantic import BaseModel
from attacks import ATTACKS
from prompts import build_prompt
import request_type

class SubmissionRequest(BaseModel):
    session_id: str
    user_guess: str | None = None
    user_answer: str | None = None


load_dotenv()

client = genai.Client(api_key = os.environ["GEMINI_API_KEY"])

app = FastAPI()

@app.get("/")
def root():
    return {
        "message": "Cybersecurity Simulator API is running",
        "endpoints": [
            "/challenge/random",
            "/challenge/guess",
            "/challenge/submission"
        ]
    }

sessions ={}

def create_challenge(key: str, reveal: bool):
    attack = ATTACKS[key]
    prompt = build_prompt(attack)

    response = client.models.generate_content(model = "gemini-3.6-flash", contents = prompt)
    cleaned = response.text.replace("```json", "").replace("```", "").strip()
    parsed = json.loads(cleaned)

    session_id = str(uuid.uuid4())
    sessions[session_id] = {"attack_key": key}

    result = {"session_id": session_id,
              "challenge_description": parsed["description"]}

    if reveal:
        result["attack_key"] = key
        result["attack_label"] = attack["label"]
    return result


@app.get("/challenge/random")
def random_challenge(): 
    key = random.choice(list(ATTACKS.keys()))

    attack = ATTACKS[key]

    prompt = build_prompt(attack)

    response = client.models.generate_content(model = "gemini-3.6-flash", contents = prompt)
    cleaned = response.text.replace("```json", "").replace("```", "").strip()
    parsed = json.loads(cleaned)

    return {
        "challenge_description": parsed["description"]
    }

@app.get("/challenge/guess")
def guess_challenge():
     key = random.choice(list(ATTACKS.keys()))

     return create_challenge(key, reveal = False)

@app.post("/challenge/submission")
def submission(req: SubmissionRequest):
    session = sessions.get(req.session_id)
    if not session:
        return{
            "error": "Invalid session id"
        }

    attack = ATTACKS[session["attack_key"]]

    grading_prompt = f"""You are grading a cybersecurity training answer.
                         Ground truth attack type: {attack["label"]}
                        User's identification (if applicable): {req.user_guess or "N/A"}
                        User's answer/fix: {req.user_answer}

                        IMPORTANT: The user may phrase their answer in ANY wording, style, or level of
                        technical detail. Do NOT penalize different phrasing, synonyms, or informal language.
                        Judge ONLY whether the underlying security concept/fix is correct — not whether it
                        matches any specific wording. For example, "use prepared statements", "parameterize"
                        the query", and "don't concatenate user input into SQL" should all be scored as
                        equally correct if they address the same root cause.

                        Score 0-100 based on correctness of the underlying idea. Respond ONLY with valid JSON,
                        no markdown fences:
                        {{"correct_id": true/false, "score": 0, "feedback": ""}}"""


    response = client.models.generate_content(model = "gemini-3.6-flash",
                                              contents = grading_prompt)

    cleaned_response = response.text.replace("```json", "").replace("```", "").strip()
    grade = json.loads(cleaned_response)

    grade["correct_answer"] = attack["label"] 
    del sessions[req.session_id]
    return grade