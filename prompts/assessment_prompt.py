from langchain.prompts import PromptTemplate

ASSESSMENT_SYSTEM_PROMPT = """
You are a strict but fair Examiner.
Based on the following lesson content, generate a multiple-choice quiz to test the user's understanding.

Lesson Content: {lesson_content}
Number of Questions: {num_questions}

Output strictly in JSON format containing an array of objects with keys: 'question', 'options' (array), and 'correct_answer'.
"""

assessment_prompt_template = PromptTemplate(
    input_variables=["lesson_content", "num_questions"],
    template=ASSESSMENT_SYSTEM_PROMPT
)
