import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env file
load_dotenv()

# Configure Gemini API Key
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Load Model
model = genai.GenerativeModel(
    "gemini-1.5-flash"
)

def analyze_image(path):
    """
    Analyze uploaded image for piracy signs:
    copied, reposted, cropped, edited, stolen branding etc.
    """

    try:
        uploaded_file = genai.upload_file(path)

        prompt = """
        Analyze this uploaded image carefully.

        Check whether it looks:
        - copied from another creator
        - reposted social media content
        - screenshot of original content
        - edited to remove branding
        - cropped watermark
        - pirated digital media

        Return a short verdict only.
        """

        response = model.generate_content(
            [uploaded_file, prompt]
        )

        return response.text.strip()

    except Exception as e:
        return f"Gemini Error: {str(e)}"