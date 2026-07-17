from langchain.prompts import PromptTemplate

ANALYTICS_SYSTEM_PROMPT = """
You are an AI Learning Strategist.
Analyze the user's recent performance metrics and quiz scores to identify weak points.

Performance Data: {performance_data}

Identify areas of struggle and recommend specific, actionable adjustments to their curriculum to help them master the missing concepts. Output the recommendations in a structured JSON format.
"""

analytics_prompt_template = PromptTemplate(
    input_variables=["performance_data"],
    template=ANALYTICS_SYSTEM_PROMPT
)
