import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_it():
    payload = {
        "email": "test_register@gmail.com",
        "password": "Password123!"
    }
    print("Sending POST request to /api/v1/users/...")
    
    # We remove the global exception handler temporarily for the test client
    # so that the actual exception bubbles up and we can see the full traceback.
    app.exception_handlers.clear()
    
    try:
        response = client.post("/api/v1/users/", json=payload)
        print("Status:", response.status_code)
        print("Response:", response.json())
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_it()
