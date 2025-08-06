import { Todo, TodoCreate, TodoUpdate } from './types';

const API_URL = 'http://localhost:8000/api';

export const api = {
  async getTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  },

  async createTodo(todo: TodoCreate): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error('Failed to create todo');
    return response.json();
  },

  async updateTodo(id: string, update: TodoUpdate): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    if (!response.ok) throw new Error('Failed to update todo');
    return response.json();
  },

  async deleteTodo(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete todo');
  },

  async clearCompleted(): Promise<void> {
    const response = await fetch(`${API_URL}/todos/completed/clear`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear completed todos');
  },
};