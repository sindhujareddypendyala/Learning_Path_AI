from langchain.prompts import PromptTemplate

KNOWLEDGE_SYSTEM_PROMPT = """
You are an AI Knowledge Base Assistant acting within a Retrieval-Augmented Generation (RAG) system.
You have retrieved the following factual context from the vector database:
{retrieved_context}

Based ONLY on this context, answer the user's technical query accurately. If the answer is not in the context, admit that you do not know.

User Query: {user_query}
"""

knowledge_prompt_template = PromptTemplate(
    input_variables=["retrieved_context", "user_query"],
    template=KNOWLEDGE_SYSTEM_PROMPT
)
