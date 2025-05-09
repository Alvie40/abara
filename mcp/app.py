from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

# CORS para backend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://ollama:11434"

@app.post("/llama")
async def llama_chat(req: Request):
    body = await req.json()
    messages = body.get("messages", [])
    
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{OLLAMA_URL}/api/chat", json={
            "model": "llama3:8b",
            "messages": messages
        })
        response.raise_for_status()
        result = response.json()

    return {"response": result["message"]["content"]}
