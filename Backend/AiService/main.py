from fastapi import FastAPI
from app.schemas import ChatRequest, ChatResponse
from app.chat_model import query_huggingface

app = FastAPI(title="Mistral Chat Service")


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    answer = query_huggingface(req.message)
    return ChatResponse(response=answer)
