"use client";

import { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
  createdAt: string;
}

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");

  // Constants that could be extracted
  const LOCALSTORAGE_KEY = "todos";
  const DEFAULT_PRIORITY = "Medium";
  const EXPORT_FILE_PREFIX = "todos_";

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(LOCALSTORAGE_KEY);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  },[]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAction = () => {
    if (newTask.trim() === "") return;

    if (editIndex !== null) {
      // Edit existing task
      const taskToEdit = tasks[editIndex];
      const updatedTask = {
        ...taskToEdit,
        title: newTask,
        priority: priority,
      };
      
      const updatedTasks = tasks.map((task, index) =>
        index === editIndex ? updatedTask : task
      );
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      // Add new task
      const newTaskItem: Task = {
        id: Date.now(), // Use timestamp as unique ID
        title: newTask,
        completed: false,
        priority: priority,
        createdAt: new Date().toISOString(),
      };
      const updatedTasks = [...tasks, newTaskItem];
      setTasks(updatedTasks);
    }

    setNewTask("");
    setPriority(DEFAULT_PRIORITY);
  };

  const deleteTask = (id: number) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  };

  const startEdit = (index: number) => {
    setNewTask(tasks[index].title);
    setPriority(tasks[index].priority);
    setEditIndex(index);
  };

  const toggleTask = (id: number, completed: boolean) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !completed } : task
    );
    setTasks(updatedTasks);
  };

  const clearAllTasks = () => {
    if (confirm("Are you sure you want to clear all tasks?")) {
      setTasks([]);
      localStorage.removeItem(LOCALSTORAGE_KEY);
    }
  };

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${EXPORT_FILE_PREFIX}${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importTasks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTasks = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedTasks)) {
            setTasks(importedTasks);
          } else {
            alert("Invalid file format");
          }
        } catch (error) {
          console.log("Error importing tasks:", error);
          alert("Error reading file");
        }
      };
      reader.readAsText(file);
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const incompleteTasks = totalTasks - completedTasks; // This variable is not used
  const tasksPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0; // Also unused

  // TODO: Add drag and drop functionality for reordering tasks
  // TODO: Add task categories/tags feature
  // Sort tasks by priority (High -> Medium -> Low) and then by completion status
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    
    // First sort by completion status (incomplete tasks first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then sort by priority (High first, then Medium, then Low)
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  // Function to get priority color - this could be optimized
  const getPriorityColor = (priority: string) => {
    if (priority === "High") return "#ff4444";
    if (priority === "Medium") return "#ff9800";
    if (priority === "Low") return "#4caf50";
    return "#000";
  };

  const getPriorityBgColor = (priority: string) => {
    if (priority === "High") return "#ffebee";
    if (priority === "Medium") return "#fff3e0";
    if (priority === "Low") return "#e8f5e8";
    return "#f5f5f5";
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
          marginBottom: "10px",
          color: "green",
        }}
      >
        To-Do App (localStorage)
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: "1rem",
          marginBottom: "20px",
          color: "#666",
        }}
      >
        {totalTasks > 0 ? `${completedTasks}/${totalTasks} tasks completed` : "No tasks yet"}
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
          onKeyPress={(e) => e.key === "Enter" && handleAction()}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "High" | "Medium" | "Low")}
          style={{
            fontSize: "1.2rem",
            padding: "10px",
            marginRight: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
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
        {tasks.length > 0 && (
          <button
            style={{
              fontSize: "1.2rem",
              padding: "10px 20px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
            onClick={clearAllTasks}
          >
            Clear All
          </button>
        )}
      </div>
      <div
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        {tasks.length > 0 ? (
          sortedTasks.map((task) => {
            const originalIndex = tasks.findIndex(t => t.id === task.id);
            return (
            <div
              key={task.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: task.completed ? "#f0f0f0" : "white",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
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
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: getPriorityColor(task.priority),
                    marginLeft: "10px",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    backgroundColor: getPriorityBgColor(task.priority),
                    fontWeight: "500",
                  }}
                >
                  {task.priority}
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
                  onClick={() => startEdit(originalIndex)}
                >
                  Edit
                </button>
              </div>
            </div>
            );
          })
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
      {tasks.length > 0 && (
        <div style={{ 
          textAlign: "center", 
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px"
        }}>
          <h3 style={{ marginBottom: "10px", color: "#333" }}>Data Management</h3>
          <button
            style={{
              fontSize: "1rem",
              padding: "8px 16px",
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginRight: "10px",
            }}
            onClick={exportTasks}
          >
            Export Tasks
          </button>
          <input
            type="file"
            accept=".json"
            onChange={importTasks}
            style={{ display: "none" }}
            id="file-import"
          />
          <button
            style={{
              fontSize: "1rem",
              padding: "8px 16px",
              backgroundColor: "#ff9800",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => document.getElementById('file-import')?.click()}
          >
            Import Tasks
          </button>
        </div>
      )}
    </div>
  );
}
