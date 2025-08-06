import React, { useState, useEffect } from 'react';
import { Todo } from './types';
import { api } from './api';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await api.getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!inputValue.trim()) return;
    
    try {
      const newTodo = await api.createTodo({ text: inputValue });
      setTodos([...todos, newTodo]);
      setInputValue('');
      setError(null);
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      const updatedTodo = await api.updateTodo(id, { completed: !completed });
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      setError(null);
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await api.clearCompleted();
      setTodos(todos.filter(todo => !todo.completed));
      setError(null);
    } catch (err) {
      setError('Failed to clear completed todos');
      console.error(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const incompleteTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <div className="App">
      <div className="container">
        <h1>Todo List</h1>
        
        {error && <div className="error">{error}</div>}
        
        <div className="add-todo">
          <input
            type="text"
            id="todoInput"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a new task..."
            autoFocus
          />
          <button id="addBtn" onClick={handleAddTodo}>Add</button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <ul id="todoList">
            {todos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id, todo.completed)}
                />
                <span className="todo-text">{todo.text}</span>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="stats">
          <span id="todoCount">
            {incompleteTodos} {incompleteTodos === 1 ? 'task' : 'tasks'} remaining
          </span>
          {completedTodos > 0 && (
            <button 
              id="clearCompleted"
              onClick={handleClearCompleted}
            >
              Clear Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
