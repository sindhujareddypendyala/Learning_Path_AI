"""
Configuration package for LearnPath-AI.
Exposes the centralized settings and logger for easy importing across the backend.
"""

from .settings import settings, get_settings
from .logging import logger

__all__ = ["settings", "get_settings", "logger"]
