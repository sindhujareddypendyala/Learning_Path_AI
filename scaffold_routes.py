import os

base_dir = "C:/Users/sushm/OneDrive/Attachments/Desktop/Multi_Agent LP/backend/api/routes"
os.makedirs(base_dir, exist_ok=True)

routes = {
    "chat.py": ('Chat', 'post', '/chat'),
    "learning_path.py": ('Learning Path', 'post', '/learning-path'),
    "content.py": ('Content', 'post', '/content'),
    "assessment.py": ('Assessment', 'post', '/assessment'),
    "project.py": ('Project', 'post', '/project'),
    "interview.py": ('Interview', 'post', '/interview'),
    "analytics.py": ('Analytics', 'get', '/analytics'),
    "history.py": ('History', 'get', '/history'),
    "agents.py": ('Agents', 'get', '/agents')
}

template = """from fastapi import APIRouter

router = APIRouter(tags=["{tag}"])

@router.{method}("{path}")
async def {func_name}():
    return {{"message": "{tag} endpoint placeholder"}}
"""

for filename, (tag, method, path) in routes.items():
    func_name = filename.split('.')[0] + "_endpoint"
    content = template.format(tag=tag, method=method, path=path, func_name=func_name)
    with open(os.path.join(base_dir, filename), "w") as f:
        f.write(content)

# Special case for upload which has two routes
upload_content = """from fastapi import APIRouter

router = APIRouter(tags=["Upload"])

@router.post("/upload/pdf")
async def upload_pdf():
    return {"message": "Upload PDF endpoint"}

@router.post("/upload/url")
async def upload_url():
    return {"message": "Upload URL endpoint"}
"""
with open(os.path.join(base_dir, "upload.py"), "w") as f:
    f.write(upload_content)

# Aggregate them in v1/__init__.py
v1_init_path = "C:/Users/sushm/OneDrive/Attachments/Desktop/Multi_Agent LP/backend/api/v1/__init__.py"
v1_init_content = """from fastapi import APIRouter

from backend.api.routes.chat import router as chat_router
from backend.api.routes.learning_path import router as learning_path_router
from backend.api.routes.content import router as content_router
from backend.api.routes.assessment import router as assessment_router
from backend.api.routes.project import router as project_router
from backend.api.routes.interview import router as interview_router
from backend.api.routes.analytics import router as analytics_router
from backend.api.routes.history import router as history_router
from backend.api.routes.upload import router as upload_router
from backend.api.routes.agents import router as agents_router

api_router = APIRouter()

api_router.include_router(chat_router)
api_router.include_router(learning_path_router)
api_router.include_router(content_router)
api_router.include_router(assessment_router)
api_router.include_router(project_router)
api_router.include_router(interview_router)
api_router.include_router(analytics_router)
api_router.include_router(history_router)
api_router.include_router(upload_router)
api_router.include_router(agents_router)
"""
os.makedirs(os.path.dirname(v1_init_path), exist_ok=True)
with open(v1_init_path, "w") as f:
    f.write(v1_init_content)

# Update main.py
main_path = "C:/Users/sushm/OneDrive/Attachments/Desktop/Multi_Agent LP/backend/main.py"
with open(main_path, "r") as f:
    main_content = f.read()

# Replace the old users import with the new api_router
main_content = main_content.replace(
    "from backend.api.v1.router_users import router as users_router",
    "from backend.api.v1 import api_router"
)

# Replace the application.include_router call
main_content = main_content.replace(
    "application.include_router(users_router, prefix=settings.API_V1_STR)",
    "application.include_router(api_router, prefix=settings.API_V1_STR)"
)

# Add the root GET / endpoint right before the health check
root_endpoint = '''
    @application.get("/", tags=["System"])
    async def root():
        return {"message": "LearnPath-AI API is running"}
'''
if "@application.get(\"/\", tags=[\"System\"])" not in main_content:
    main_content = main_content.replace(
        "    @application.get(\"/health\", tags=[\"System\"])",
        root_endpoint + "\\n    @application.get(\"/health\", tags=[\"System\"])"
    )

with open(main_path, "w") as f:
    f.write(main_content)

print("API Routing successfully scaffolded.")
