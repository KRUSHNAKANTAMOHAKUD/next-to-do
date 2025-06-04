"use client";

import { useState, useEffect } from "react";

export default function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  const handleAction = async () => {
    if (newTask.trim() === "") return;

    if (editIndex !== null) {
      const taskToEdit = tasks[editIndex];
      const res = await fetch(`/api/tasks/${taskToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask, completed: taskToEdit.completed }),
      });
      const updatedTask = await res.json();
      setTasks(
        tasks.map((task, index) =>
          index === editIndex ? updatedTask : task
        )
      );
      setEditIndex(null);
    } else {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
      });
      const newTaskItem = await res.json();
      setTasks([...tasks, newTaskItem]);
    }

    setNewTask("");
  };

  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEdit = (index) => {
    setNewTask(tasks[index].title);
    setEditIndex(index);
  };

  const toggleTask = async (id, completed) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !completed } : task
      )
    );
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "green",
        }}
      >
        To-Do App
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <input
          style={{
            fontSize: "1.2rem",
            padding: "10px",
            marginRight: "10px",
            flexGrow: "1",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          placeholder={editIndex !== null ? "Edit task..." : "Add task..."}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          style={{
            fontSize: "1.2rem",
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={handleAction}
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>
      <div
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div
              key={task.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", flexGrow: "1" }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id, task.completed)}
                  style={{
                    marginRight: "10px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                <span
                  style={{
                    fontSize: "1.2rem",
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </span>
              </div>
              <div>
                <button
                  style={{
                    padding: "10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
                <button
                  style={{
                    padding: "10px",
                    backgroundColor: "#2196f3",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => startEdit(index)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              color: "#777",
            }}
          >
            No tasks available
          </div>
        )}
      </div>
    </div>
  );
}
