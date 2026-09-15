import os
from unittest import result
from urllib import response
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

import json
import uuid
import random
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai

from pydantic import BaseModel
from attacks import ATTACKS
from prompts import build_prompt
import request_type
from google.genai.types import GenerateContentConfig

class SubmissionRequest(BaseModel):
    #session_id: str #utilizatorul trebuie sa introduca session_id-ul la partea de submission. Comentam linia si eliminam aceasta parte
    user_guess: str | None = None
    user_answer: str | None = None


load_dotenv()

client = genai.Client(api_key = os.environ["GEMINI_API_KEY"])

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    response = client.models.generate_content(
        #model="gemini-3.6-flash",
        model = "gemini-3.1-flash-lite",
        contents=prompt,
    )

    print("Gemini response:", repr(response.text))

    cleaned = response.text.replace("```json", "").replace("```", "").strip()
    print("Cleaned response:", repr(cleaned))

    parsed = json.loads(cleaned)
    print("Parsed response:", parsed)

    session_id = str(uuid.uuid4())
    sessions[session_id] = {"attack_key": key}

    result = {
        "session_id": session_id,
        "challenge_description": parsed["description"],
    }

    if reveal:
        result["attack_key"] = key
        result["attack_label"] = attack["label"]

    return result

@app.get("/challenge/random")
def random_challenge(): 
    key = random.choice(list(ATTACKS.keys()))

    attack = ATTACKS[key]

    prompt = build_prompt(attack)

    response = client.models.generate_content(model = "gemini-3.1-flash-lite", contents = prompt)
    cleaned = response.text.replace("```json", "").replace("```", "").strip()
    parsed = json.loads(cleaned)

    return {
        "challenge_description": parsed["description"]
    }

from google.genai.errors import ClientError

@app.get("/challenge/guess")
def guess_challenge(response: Response):
    key = random.choice(list(ATTACKS.keys()))

    try:
        result = create_challenge(key, reveal=False)
    except ClientError as e:
        if e.code == 429:
            raise HTTPException(status_code=429, detail="Exceeded request limit")
        raise HTTPException(status_code=502, detail=f"API Error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {e}")

    response.set_cookie(key="session_id",
                         value=result["session_id"],
                         httponly=True,
                         samesite="lax",
                         secure=False, path="/")
    del result["session_id"]
    return result


@app.get("/challenge/known/{attack_key}")
def known_challenge(attack_key: str, response: Response):
    if attack_key not in ATTACKS:
        raise HTTPException(
            status_code=404,
            detail="Unknown attack type"
        )

    try:
        result = create_challenge(attack_key, reveal=False)
    except ClientError as error:
        if error.code == 429:
            raise HTTPException(
                status_code=429,
                detail="Gemini quota exceeded"
            )
        raise HTTPException(status_code=502, detail=str(error))

    response.set_cookie(
        key="session_id",
        value=result["session_id"],
        httponly=True,
        samesite="lax",
        secure=False,
        path="/",
    )

    del result["session_id"]
    return result

@app.post("/challenge/submission")
def submission(req: SubmissionRequest, request: Request):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="Invalid session id")
    
    session = sessions.get(session_id)

    if not session:
        raise HTTPException(status_code=400, detail="Invalid session id")

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


    response = client.models.generate_content(model = "gemini-3.1-flash-lite",
                                              contents = grading_prompt)

    cleaned_response = response.text.replace("```json", "").replace("```", "").strip()
    grade = json.loads(cleaned_response)

    grade["correct_answer"] = attack["label"] 
    del sessions[session_id]
    return grade

class KnowledgeSubmission(BaseModel):
    answers: dict[str, str]


@app.get("/knowledge/questions/{difficulty}")
def generate_knowledge_questions(
    difficulty: str,
    response: Response,
):
    if difficulty not in ["easy", "medium", "hard"]:
        raise HTTPException(status_code=400, detail="Invalid difficulty")

    prompt = f"""
Generate exactly 10 multiple-choice cybersecurity questions.

Difficulty: {difficulty}
Topics: SQL Injection, Phishing, Ransomware.

Return ONLY valid JSON in this format:
{{
  "questions": [
    {{
      "id": "1",
      "question": "Question text",
      "options": {{
        "a": "Option A",
        "b": "Option B",
        "c": "Option C"
      }},
      "correct_answer": "a",
      "explanation": "Explain what determines the correct attack or answer."
    }}
  ]
}}

Use different questions. The correct_answer must be only "a", "b", or "c".
"""

    try:
        api_response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
            config=GenerateContentConfig(
            response_mime_type="application/json",
            ),
        )

        # cleaned = (
        #     api_response.text
        #     .replace("```json", "")
        #     .replace("```", "")
        #     .strip()
        # )
        cleaned = api_response.text.strip()
        data = json.loads(api_response.text)
        questions = data["questions"]

        if len(questions) != 10:
            raise ValueError("The API did not return exactly 10 questions")

        session_id = str(uuid.uuid4())
        sessions[session_id] = {
            "type": "knowledge",
            "questions": questions,
        }

        response.set_cookie(
            key="knowledge_session_id",
            value=session_id,
            httponly=True,
            samesite="lax",
            secure=False,
            path="/",
        )

        public_questions = []

        for question in questions:
            public_questions.append({
                "id": question["id"],
                "question": question["question"],
                "options": question["options"],
            })

        return {"questions": public_questions}

    except ClientError as error:
        print("Gemini error:", repr(error), flush=True)

        if error.code == 429:
            raise HTTPException(
                status_code=429,
                detail="Gemini quota exceeded. Try later or use another project."
            )

        raise HTTPException(status_code=502, detail=str(error))

    except Exception as error:
        print("Quiz generation error:", repr(error), flush=True)
        raise HTTPException(
            status_code=500,
            detail=f"{type(error).__name__}: {error}",
        )


@app.post("/knowledge/submit")
def submit_knowledge(
    submission: KnowledgeSubmission,
    request: Request,
):
    session_id = request.cookies.get("knowledge_session_id")
    session = sessions.get(session_id)

    if not session or session.get("type") != "knowledge":
        raise HTTPException(status_code=400, detail="Invalid quiz session")

    questions = session["questions"]
    score = 0
    corrections = []

    for question in questions:
        question_id = question["id"]
        user_answer = submission.answers.get(question_id)
        correct_answer = question["correct_answer"]

        if user_answer == correct_answer:
            score += 1
        else:
            corrections.append({
                "number": question_id,
                "question": question["question"],
                "correct_answer": correct_answer,
                "correct_text": question["options"][correct_answer],
                "explanation": question["explanation"],
            })

    del sessions[session_id]

    return {
        "score": score,
        "total": 10,
        "corrections": corrections,
    }
