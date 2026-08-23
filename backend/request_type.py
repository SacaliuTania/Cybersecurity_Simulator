from pydantic import BaseModel 

class RequestMode(BaseModel):
    mode: str #random, named, description 
    attack_key: str | None = None #only for named


class SubmissionRequest(BaseModel):
    session_id: str
    user_guess: str | None = None
    user_answer: str
    