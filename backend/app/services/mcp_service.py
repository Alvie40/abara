import httpx
from fastapi import HTTPException
from app.core.config import settings

class MCPServiceError(Exception):
    pass

async def generate_description(title: str, category: str) -> str:
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{settings.MCP_URL}/api/generate",
                json={
                    "model": "codellama:13b-instruct",
                    "prompt": f"Generate a concise book description for a {category} book titled '{title}'. Keep it under 200 words.",
                    "stream": False
                }
            )
            response.raise_for_status()
            data = response.json()
            return data["response"].strip()
    except httpx.HTTPError as e:
        raise MCPServiceError(f"HTTP error occurred: {str(e)}")
    except KeyError as e:
        raise MCPServiceError(f"Invalid response format: {str(e)}")
    except Exception as e:
        # Fallback to a basic description if MCP service fails
        return f"A {category} book titled {title}. Description temporarily unavailable."