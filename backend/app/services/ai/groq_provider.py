"""Groq LLM provider implementation using httpx."""

import logging
from typing import Optional
import httpx
from app.services.ai.provider import LLMProvider

logger = logging.getLogger(__name__)


class GroqProvider(LLMProvider):
    """Groq API provider for fast LLM inference."""

    BASE_URL = "https://api.groq.com/openai/v1/chat/completions"

    def __init__(self, api_key: str, model: str = "llama-3.3-70b-versatile"):
        self.api_key = api_key
        self.model = model

    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Call Groq chat completion API asynchronously."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.4,
            "response_format": {"type": "json_object"},
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(
                    self.BASE_URL,
                    headers=headers,
                    json=payload,
                )
                response.raise_for_status()
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                return content
            except httpx.HTTPStatusError as e:
                logger.error("Groq API returned HTTP error: %s: %s", e.response.status_code, e.response.text)
                raise RuntimeError(f"Groq API error ({e.response.status_code}): {e.response.text}") from e
            except httpx.TimeoutException as e:
                logger.error("Groq API request timed out: %s", e)
                raise RuntimeError("Groq API request timed out") from e
            except Exception as e:
                logger.error("Unexpected error contacting Groq API: %s", e)
                raise RuntimeError(f"Groq connection failure: {str(e)}") from e
