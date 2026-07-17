import os

base_dir = "C:/Users/sushm/OneDrive/Attachments/Desktop/Multi_Agent LP/ai_agents"
structure = {
    "curriculum_agent": ["agent.py", "tools.py", "chain.py", "__init__.py"],
    "shared_context": ["memory.py", "state.py", "registry.py", "__init__.py"]
}

# The other agent folders already exist from earlier, we just need to ensure the new files exist
for parent, items in structure.items():
    parent_path = os.path.join(base_dir, parent)
    os.makedirs(parent_path, exist_ok=True)
    for item in items:
        item_path = os.path.join(parent_path, item)
        if not os.path.exists(item_path):
            with open(item_path, "w") as f:
                # Leave them empty for now
                f.write("")
