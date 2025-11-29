import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

def analyze_image(image_path, query):
    """
    Analyze image using Google Gemini 1.5 Flash model.
    """
    try:
        # Upload the file to Gemini
        sample_file = genai.upload_file(path=image_path, display_name="User Image")
        
        # Initialize model
        model = genai.GenerativeModel(model_name="gemini-flash-latest")
        
        # Generate content
        response = model.generate_content([sample_file, query])
        
        return response.text
    except Exception as e:
        print(f"Error analyzing image with Gemini: {e}")
        return f"Sorry, I encountered an error while analyzing the image: {str(e)}"
