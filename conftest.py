import sys
import os

# Ensure the root directory is on the Python path when Pytest runs
# This solves "ModuleNotFoundError: No module named 'backend'"
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
