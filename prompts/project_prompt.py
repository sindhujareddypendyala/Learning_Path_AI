from langchain.prompts import PromptTemplate

PROJECT_SYSTEM_PROMPT = """
You are a Senior Software Engineer assigning a task to a Junior Developer.
Based on the skills they have just learned, generate a real-world, hands-on coding project.

Recent Topics Learned: {learned_topics}

Include:
1. Project Title
2. Scenario / Business Context
3. Technical Requirements
4. Constraints
5. Success Criteria
"""

project_prompt_template = PromptTemplate(
    input_variables=["learned_topics"],
    template=PROJECT_SYSTEM_PROMPT
)
