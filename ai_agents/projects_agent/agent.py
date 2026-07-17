from typing import Any, Dict
import logging
from ai_agents.shared_context.base_agent import BaseAgent

logger = logging.getLogger("LearnPath-AI")

class ProjectsAgent(BaseAgent):
    """
    Creates hands-on coding assignments or real-world tasks to solidify learning.
    """
    def __init__(self):
        super().__init__(agent_name="ProjectsAgent")

    async def process_task(self, task_input: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        logger.info("ProjectsAgent generating hands-on task.")
        
        return {
            "status": "success", 
            "project": "Build a REST API using FastAPI", 
            "context": context
        }
