"""Abstract base class and factory for LLM providers."""

from abc import ABC, abstractmethod
import logging
from typing import Optional
from app.core.config import Settings, settings

logger = logging.getLogger(__name__)


class LLMProvider(ABC):
    """Abstract base class for all LLM providers."""

    @abstractmethod
    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Generate response text given a user prompt and optional system prompt."""
        pass


def get_provider(custom_settings: Optional[Settings] = None) -> LLMProvider:
    """Factory to instantiate the appropriate LLM provider based on settings.

    If GROQ_API_KEY is present and not empty/placeholder, GroqProvider is used.
    Otherwise, DemoProvider is returned as a fallback.
    """
    cfg = custom_settings or settings
    api_key = (cfg.GROQ_API_KEY or "").strip()

    if api_key and not api_key.startswith("your-groq"):
        from app.services.ai.groq_provider import GroqProvider
        logger.info("Using GroqProvider with model: %s", cfg.GROQ_MODEL)
        return GroqProvider(api_key=api_key, model=cfg.GROQ_MODEL)

    from app.services.ai.demo_provider import DemoProvider
    logger.info("Using fallback DemoProvider")
    return DemoProvider()
