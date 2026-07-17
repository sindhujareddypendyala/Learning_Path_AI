import os
import shutil

base_dir = "C:/Users/sushm/OneDrive/Attachments/Desktop/Multi_Agent LP"
backend_dir = os.path.join(base_dir, "backend")

# Define the exact structure
structure = {
    "api": ["routes", "dependencies", "v1", "__init__.py"],
    "config": ["settings.py", "security.py", "logging.py", "__init__.py"],
    "middleware": ["auth.py", "cors.py", "logging.py", "rate_limit.py", "__init__.py"],
    "orchestrator": ["agent_manager.py", "workflow_engine.py", "router.py", "__init__.py"],
    "services": ["llm_service.py", "embedding_service.py", "rag_service.py", "vector_store.py", "pdf_service.py", "web_loader.py", "__init__.py"],
    "database": ["session.py", "base.py", "crud.py", "__init__.py"],
    "models": ["user.py", "learning_path.py", "history.py", "__init__.py"],
    "schemas": ["user_schema.py", "request_schema.py", "response_schema.py", "__init__.py"],
    "utils": ["helpers.py", "constants.py", "exceptions.py", "validators.py", "__init__.py"]
}

# 1. Map existing files to their new specific locations
moves = {
    "utils/security.py": "config/security.py",
    "config/logger.py": "config/logging.py",
    "middleware/error_handler.py": "utils/exceptions.py",
    "api/router_users.py": "api/v1/router_users.py",
    "api/dependencies.py": "api/dependencies/core.py"
}

for src, dst in moves.items():
    src_path = os.path.join(backend_dir, src)
    dst_path = os.path.join(backend_dir, dst)
    if os.path.exists(src_path):
        os.makedirs(os.path.dirname(dst_path), exist_ok=True)
        shutil.move(src_path, dst_path)

# 2. Scaffold exact structure
for parent, items in structure.items():
    parent_path = os.path.join(backend_dir, parent)
    os.makedirs(parent_path, exist_ok=True)
    for item in items:
        item_path = os.path.join(parent_path, item)
        if "." in item and not item.startswith("."):
            # Create file
            if not os.path.exists(item_path):
                with open(item_path, "w") as f:
                    f.write("")
        else:
            # Create directory
            os.makedirs(item_path, exist_ok=True)

# 3. Patch main.py to reflect moved files
main_path = os.path.join(backend_dir, "main.py")
if os.path.exists(main_path):
    with open(main_path, "r") as f:
        content = f.read()
    content = content.replace("from backend.api.router_users", "from backend.api.v1.router_users")
    content = content.replace("from backend.middleware.error_handler", "from backend.utils.exceptions")
    with open(main_path, "w") as f:
        f.write(content)

# Patch user_service.py to reflect moved security.py
user_svc = os.path.join(backend_dir, "services/user_service.py")
if os.path.exists(user_svc):
    with open(user_svc, "r") as f:
        content = f.read()
    content = content.replace("from backend.utils.security", "from backend.config.security")
    with open(user_svc, "w") as f:
        f.write(content)

print("Scaffolding of backend complete.")
