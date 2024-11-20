import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState([]);
  const [todo, setTodo] = useState([]);
  const [input, setInput] = useState('');
  const [formData, setFormData] = useState({
    task: '',
    days: '',
    priority: '',
  });

  useEffect(() => {
    const fetchApi = async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts'
      );
      const data = await response.json();
      setCount(data);
    };
    fetchApi();
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodo(JSON.parse(savedTodos)); // Parse the string back to array
    }
  }, []);

  const addTodo = async () => {
    const updatedTodos = [...todo, input];
    setTodo(updatedTodos); // Update the state
    localStorage.setItem('todos', JSON.stringify(updatedTodos)); // Store the updated list in localStorage
    setInput('');
  };
  const deleteTodos = async () => {
    localStorage.clear();
    setTodo([]);
  };
  const handleForm = async (e) => {
    e.preventDefault();
    alert(JSON.stringify(formData));
    const updatedTodo = `${formData.task} is to be done in ${formData.days} and is a ${formData.priority} task`;
    setTodo((prev) => [...prev, updatedTodo]);
    setFormData({ task: '', days: '', priority: '' });
  };
  const handelChange = async (e) => {
    // e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <form onSubmit={handleForm}>
        {/* <input
          type="text"
          placeholder="enter todo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        /> */}
        <input
          type="text"
          name="task"
          value={formData.task}
          onChange={handelChange}
          placeholder="enter your task "
        />
        <input
          type="number"
          name="days"
          value={formData.days}
          onChange={handelChange}
          placeholder="enter no of days "
        />
        <input
          type="text"
          name="priority"
          value={formData.priority}
          onChange={handelChange}
          placeholder="enter importance "
        />
        <button type="submit">submit </button>
      </form>
      <input
        type="text"
        placeholder="enter todo"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addTodo}>add todo</button>
      <ul>
        {todo && todo.map((inputs, index) => <li key={index}>{inputs}</li>)}
      </ul>
      <button onClick={deleteTodos}> delete todos</button>
      <ul>
        {count.map((user, index) => (
          <li key={index}>{user.id}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
