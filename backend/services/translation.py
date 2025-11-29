import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def translate_to_english(text):
    """
    Detects language and translates to English if necessary.
    Returns (english_text, source_language)
    """
    prompt = f"""
    You are a translation engine. 
    Task:
    1. Detect the language of the following text.
    2. If it is English, return it as is.
    3. If it is NOT English, translate it to English.
    
    Output Format:
    Return ONLY a JSON object with keys: "source_language" and "translated_text".
    Example: {{"source_language": "Spanish", "translated_text": "Hello world"}}
    
    Text to process:
    "{text}"
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
            response_format={"type": "json_object"}
        )
        response_content = chat_completion.choices[0].message.content
        import json
        data = json.loads(response_content)
        return data.get("translated_text", text), data.get("source_language", "English")
    except Exception as e:
        print(f"Error in translation to English: {e}")
        return text, "English"

def translate_to_target(text, target_language):
    """
    Translates English text to the target language.
    """
    if target_language.lower() == "english":
        return text
        
    prompt = f"""
    You are a professional translator.
    Translate the following English text to {target_language}.
    Maintain the original formatting (Markdown, bullet points, etc.).
    Do not add any explanations or preamble. Just the translation.
    
    Text:
    {text}
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
        print(f"Error in translation to target: {e}")
        return text
