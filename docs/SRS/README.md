# Software Requirements Specification (SRS)

This document outlines the functional and non-functional requirements of the LearnPath-AI Multi-Agent System.

## Functional Requirements
1. The system must support user authentication.
2. The system must utilize 7 specialized AI agents to generate learning paths.
3. The system must persist generated paths in SQLite.

## Non-Functional Requirements
1. **Scalability**: The orchestrator must handle concurrent agent executions asynchronously.
2. **Security**: All API endpoints must be secured via JWT.
