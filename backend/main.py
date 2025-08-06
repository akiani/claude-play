from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI(title="Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TodoCreate(BaseModel):
    text: str

class TodoUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None

class Todo(BaseModel):
    id: str
    text: str
    completed: bool
    created_at: datetime

todos_db = {}

@app.get("/")
async def root():
    return {"message": "Todo API is running"}

@app.get("/api/todos", response_model=List[Todo])
async def get_todos():
    return list(todos_db.values())

@app.post("/api/todos", response_model=Todo)
async def create_todo(todo: TodoCreate):
    todo_id = str(uuid.uuid4())
    new_todo = Todo(
        id=todo_id,
        text=todo.text,
        completed=False,
        created_at=datetime.now()
    )
    todos_db[todo_id] = new_todo
    return new_todo

@app.patch("/api/todos/{todo_id}", response_model=Todo)
async def update_todo(todo_id: str, todo_update: TodoUpdate):
    if todo_id not in todos_db:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo = todos_db[todo_id]
    if todo_update.text is not None:
        todo.text = todo_update.text
    if todo_update.completed is not None:
        todo.completed = todo_update.completed
    
    return todo

@app.delete("/api/todos/{todo_id}")
async def delete_todo(todo_id: str):
    if todo_id not in todos_db:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    del todos_db[todo_id]
    return {"message": "Todo deleted"}

@app.delete("/api/todos/completed/clear")
async def clear_completed():
    completed_ids = [tid for tid, todo in todos_db.items() if todo.completed]
    for tid in completed_ids:
        del todos_db[tid]
    return {"message": f"Cleared {len(completed_ids)} completed todos"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)