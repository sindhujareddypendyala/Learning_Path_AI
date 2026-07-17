from typing import Any, Dict
import logging
from ai_agents.shared_context.base_agent import BaseAgent

logger = logging.getLogger("LearnPath-AI")

class InterviewAgent(BaseAgent):
    """
    Simulates technical interviews by acting as an interviewer and grading responses.
    """
    def __init__(self):
        super().__init__(agent_name="InterviewAgent")

    async def process_task(self, task_input: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        logger.info("InterviewAgent analyzing user response.")
        
        return {
            "status": "success", 
            "feedback": "Good answer, but try to optimize for O(n) time complexity.", 
            "context": context
        }
