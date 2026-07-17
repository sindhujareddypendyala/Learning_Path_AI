import os
import subprocess
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Automates local development environment setup."""
    logger.info("Setting up LearnPath-AI...")
    
    # Create required directories
    os.makedirs("backend/database/chroma_db", exist_ok=True)
    
    # Install dependencies
    logger.info("Installing dependencies...")
    subprocess.run(["pip", "install", "-r", "backend/requirements.txt"], check=True)
    
    logger.info("Setup complete. Please configure your .env file.")

if __name__ == "__main__":
    main()
