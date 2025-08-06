# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

Full-stack Todo application with React frontend and FastAPI backend:
- **Backend** (`backend/`): FastAPI REST API with in-memory storage, running on port 8000
- **Frontend** (`frontend/`): React TypeScript SPA, running on port 3000
- **Testing**: Playwright for E2E testing with visible browser automation

## Commands

### Development
```bash
# Backend (requires virtual environment)
cd backend && source .venv/bin/activate && python main.py
# Or: ./start-backend.sh

# Frontend
cd frontend && npm start
# Or: ./start-frontend.sh

# E2E Testing (requires both services running)
node test-fullstack.js  # Opens visible Chrome browser
```

### Testing
```bash
# Frontend tests
cd frontend && npm test

# Backend tests (pytest configured, no tests yet)
cd backend && source .venv/bin/activate && pytest
```

### Build
```bash
# Frontend production build
cd frontend && npm run build
```

## API Endpoints

Backend exposes RESTful API at `http://localhost:8000`:
- `GET /api/todos` - List all todos
- `POST /api/todos` - Create todo (body: `{text: string}`)
- `PATCH /api/todos/{id}` - Update todo (body: `{text?: string, completed?: boolean}`)
- `DELETE /api/todos/{id}` - Delete todo
- `DELETE /api/todos/completed/clear` - Clear completed todos

## Key Files

- `backend/main.py` - FastAPI application with all endpoints
- `frontend/src/App.tsx` - Main React component with todo logic
- `frontend/src/api.ts` - API client for backend communication
- `frontend/src/types.ts` - TypeScript interfaces for Todo data
- `test-fullstack.js` - Playwright E2E test suite

## Development Notes

- Backend uses Python virtual environment managed with `uv`
- Frontend created with Create React App, includes hot reload
- CORS configured for `http://localhost:3000`
- Data stored in memory (resets on backend restart)
- Playwright tests run with `headless: false` and `slowMo: 500` for visibility