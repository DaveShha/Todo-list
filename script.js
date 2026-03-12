// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearBtn = document.getElementById('clearBtn');

// Load tasks from localStorage when page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task on button click
addBtn.addEventListener('click', addTask);

// Add task on Enter key press
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Clear all tasks
clearBtn.addEventListener('click', clearAllTasks);

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    createTaskElement(taskText, false);
    saveTasks();
    taskInput.value = '';
    taskInput.focus();
    updateStats();
}

// Function to create task HTML element
function createTaskElement(text, isCompleted) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (isCompleted) {
        li.classList.add('completed');
    }
    
    li.innerHTML = `
        <input type="checkbox" class="checkbox" ${isCompleted ? 'checked' : ''}>
        <span class="task-text">${escapeHtml(text)}</span>
        <button class="delete-btn">Delete</button>
    `;
    
    // Checkbox toggle
    const checkbox = li.querySelector('.checkbox');
    checkbox.addEventListener('change', () => {
        li.classList.toggle('completed');
        saveTasks();
        updateStats();
    });
    
    // Delete button
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        li.remove();
        saveTasks();
        updateStats();
    });
    
    taskList.appendChild(li);
}

// Function to save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
        tasks.push({
            text: item.querySelector('.task-text').textContent,
            completed: item.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            createTaskElement(task.text, task.completed);
        });
    }
    updateStats();
}

// Function to clear all tasks
function clearAllTasks() {
    if (taskList.children.length === 0) return;
    
    if (confirm('Are you sure you want to clear all tasks?')) {
        taskList.innerHTML = '';
        localStorage.removeItem('tasks');
        updateStats();
    }
}

// Function to update task statistics
function updateStats() {
    const totalTasks = document.querySelectorAll('.task-item').length;
    const completedTasks = document.querySelectorAll('.task-item.completed').length;
    const pendingTasks = totalTasks - completedTasks;
    
    if (totalTasks === 0) {
        taskCount.textContent = 'No tasks';
        taskList.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
    } else {
        taskCount.textContent = `${pendingTasks} pending, ${completedTasks} completed`;
    }
}

// Helper function to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}