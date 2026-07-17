from abc import ABC, abstractmethod
from typing import Any, Dict
import logging

logger = logging.getLogger("LearnPath-AI")

class BaseAgent(ABC):
    """
    Abstract Base Class for all AI Agents in the LearnPath-AI system.
    Enforces a strict, consistent interface for agent execution, initialization, 
    and context sharing (SOLID - Open/Closed Principle).
    """
    
    def __init__(self, agent_name: str):
        self.agent_name = agent_name
        self.llm = self._initialize_llm()
        logger.info(f"Initialized AI Agent: {self.agent_name}")

    def _initialize_llm(self):
        """
        Initializes the Language Model (Groq via LangChain).
        Provides an ultra-fast default model but allows subclasses to override if needed.
        """
        from langchain_groq import ChatGroq
        from backend.config.settings import settings

        if not settings.GROQ_API_KEY:
            logger.warning(f"{self.agent_name}: GROQ_API_KEY is missing. Agent will run in dry-mode.")
            return None
            
        # Defaulting to Llama 3 on Groq for blazing fast reasoning tasks
        return ChatGroq(
            model="llama3-70b-8192",
            temperature=0.4, # Lower temperature for more deterministic, educational outputs
            groq_api_key=settings.GROQ_API_KEY
        )

    @abstractmethod
    async def process_task(self, task_input: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Core execution method that every specific agent MUST implement.
        
        Args:
            task_input: The specific prompt/data for this agent's current task.
            context: Shared memory/context passed from the orchestrator or previous agents.
            
        Returns:
            A dictionary containing the generated output and updated context.
        """
        pass
