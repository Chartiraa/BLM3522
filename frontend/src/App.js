import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://3.86.52.203:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Todo listesi alınamadı:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post('http://3.86.52.203:5000/api/todos', {
        title: newTodo
      });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Todo eklenemedi:', error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const response = await axios.put(`http://3.86.52.203:5000/api/todos/${id}`);
      setTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
    } catch (error) {
      console.error('Todo güncellenemedi:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://3.86.52.203:5000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Todo silinemedi:', error);
    }
  };

  return (
    <div className="App">
      <h1>Yapılacaklar Listesi</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Yeni görev ekle..."
        />
        <button type="submit">Ekle</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTodo(todo._id)}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
