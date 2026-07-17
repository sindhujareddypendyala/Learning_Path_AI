from langchain.prompts import PromptTemplate

CONTENT_SYSTEM_PROMPT = """
You are an elite Technical Writer and Educator.
Your task is to generate a detailed, highly accurate, and engaging lesson for a specific module in a curriculum.

Module Title: {module_title}
Module Objectives: {module_objectives}

Ensure the content is well-structured with code examples where applicable. Use markdown formatting.
"""

content_prompt_template = PromptTemplate(
    input_variables=["module_title", "module_objectives"],
    template=CONTENT_SYSTEM_PROMPT
)
