from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn
from model import LLMModel

app = FastAPI(title="Healthcare Chatbot API")

# Initialize the model with the access token
access_token = "YOUR_ACCESS_TOKEN"
model = LLMModel(access_token=access_token)

class PredictRequest(BaseModel):
    message: str
    user_id: str
    context: Optional[Dict[str, Any]] = {}

class IntentRequest(BaseModel):
    message: str

@app.post("/predict")
async def predict(request: PredictRequest):
    try:
        response = model.generate_response(request.message, request.context)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect-intent")
async def detect_intent(request: IntentRequest):
    try:
        intent = model.detect_intent(request.message)
        return {"intent": intent}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)