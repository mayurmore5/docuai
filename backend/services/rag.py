import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def generate_answer(query, context_chunks):
    """
    Generate answer using Groq API.
    """
    context = "\n\n".join(context_chunks)
    
    prompt = f"""
    You are a helpful assistant. Use the following context to answer the user's question.
    
    Guidelines:
    1. Structure your answer clearly using Markdown headers (###), bullet points, and numbered lists.
    2. Do NOT use excessive bolding (stars). Use bolding only for key terms.
    3. Keep the answer clean and easy to read.
    4. If the answer is not in the context, say you don't know.
    
    Context:
    {context}
    
    Question: {query}
    
    Answer:
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error generating answer: {e}")
        return "Sorry, I encountered an error while generating the answer."
