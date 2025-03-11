"use strict";
// Variables
const inputBox = document.querySelector('.input-form input');
const addBtn = document.querySelector('.input-form button');
const todoItems = document.querySelector('.todo-items');
const numOfTasks = document.querySelector(".num-of-tasks span");
// Default values
let keyword = "";
let allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");
// Function to save tasks to localStorage
const saveTasks = () => {
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
};
// Function to add task
const addTask = () => {
    keyword = inputBox.value.trim();
    // Validation
    if (keyword === "") {
        alert("Please enter a new todo...");
        return;
    }
    // Create task object
    const newTask = {
        id: Date.now(),
        text: keyword,
        isCompleted: false,
    };
    allTasks.push(newTask); // Add newTask to the allTasks
    saveTasks(); // Save tasks to local storage
    createNewTask(newTask); // Render newTask
    numOfItemsLeft(); // Update remaining task count
    inputBox.value = ""; // Clear inputBox
};
// Function to create and display task
const createNewTask = (task) => {
    // Destructuring
    const { id, text, isCompleted } = task;
    // Create li element (one-item)
    const elementLi = document.createElement('li');
    elementLi.dataset.id = id.toString();
    elementLi.classList.add("one-item");
    if (isCompleted)
        elementLi.classList.add("completed");
    // Click event on one-item::before
    elementLi.addEventListener('click', (event) => {
        // Click position
        const clickX = event.clientX - elementLi.getBoundingClientRect().left;
        // Validation
        if (clickX)
            toggleTaskCompletion(id);
    });
    // Create p element (text)
    const elementP = document.createElement('p');
    elementP.textContent = text;
    elementP.classList.add("text");
    if (isCompleted)
        elementP.classList.add("completed");
    elementLi.appendChild(elementP);
    // Create span element (cross) - delete button
    const elementSpan = document.createElement('span');
    elementSpan.innerHTML = '\u00d7';
    elementSpan.classList.add("cross");
    elementSpan.addEventListener('click', () => deleteTask(id));
    elementLi.appendChild(elementSpan);
    // Append task to list
    todoItems.appendChild(elementLi);
};
// Function to toggle task completion
const toggleTaskCompletion = (taskId) => {
    var _a;
    const task = allTasks.find((oneTask) => oneTask.id === taskId);
    if (!task)
        return;
    task.isCompleted = !task.isCompleted;
    saveTasks();
    numOfItemsLeft();
    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`);
    if (!taskElementLi)
        return;
    taskElementLi === null || taskElementLi === void 0 ? void 0 : taskElementLi.classList.toggle("completed");
    (_a = taskElementLi.querySelector("p.text")) === null || _a === void 0 ? void 0 : _a.classList.toggle("completed");
};
// Function to delete a task
const deleteTask = (taskId) => {
    allTasks = allTasks.filter((oneTask) => oneTask.id !== taskId);
    saveTasks();
    numOfItemsLeft();
    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`);
    if (!taskElementLi)
        return;
    taskElementLi.remove();
};
// Function to update the number of remaining tasks
const numOfItemsLeft = () => {
    const itemsLeft = allTasks.filter((task) => !task.isCompleted).length.toString();
    numOfTasks.textContent = itemsLeft;
};
// Function to load tasks from localStorage
const loadTasks = () => {
    numOfItemsLeft();
    allTasks.forEach((task) => createNewTask(task));
};
// Event listener for addBtn
addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addTask();
});
if (!addBtn)
    console.error("Add button not found!");
// Load tasks on page load
loadTasks();
