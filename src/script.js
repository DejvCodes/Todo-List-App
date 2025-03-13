"use strict";
// Variables
const inputBox = document.querySelector(".input-form input");
const addBtn = document.querySelector(".input-form button");
const message = document.querySelector(".message");
const todoItems = document.querySelector(".todo-items");
const numOfTasks = document.querySelector(".num-of-tasks span");
const clearCompletedBtn = document.querySelector(".clear-completed");
// Default values
let allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");
// Function to add a new task
const addTask = () => {
    const keyword = inputBox.value.trim();
    // Validation
    if (!keyword) {
        alert("Please enter a new todo...");
        return;
    }
    // Create task object
    const newTask = {
        id: Date.now(), // Unique ID
        text: keyword,
        isCompleted: false,
    };
    allTasks.push(newTask); // Add newTask to allTasks array
    createNewTask(newTask); // Render new task
    saveTasks(); // Save updated task state
    inputBox.value = ""; // Clear inputBox
};
// Function to create and display new task
const createNewTask = (task) => {
    // Destructure task object
    const { id, text, isCompleted } = task;
    // Create <li> element (one-item)
    const elementLi = document.createElement("li");
    elementLi.dataset.id = id.toString();
    elementLi.classList.add("one-item");
    if (isCompleted)
        elementLi.classList.add("completed");
    // Click event on one-item::before
    elementLi.addEventListener("click", (event) => {
        event.stopPropagation();
        // Click position
        const clickX = event.clientX - elementLi.getBoundingClientRect().left;
        // Validation
        if (event.target.tagName !== "SPAN" && clickX) {
            toggleTaskCompletion(id);
        }
    });
    // Create <p> element (text)
    const elementP = document.createElement("p");
    elementP.textContent = text;
    elementP.classList.add("text");
    if (isCompleted)
        elementP.classList.add("completed");
    elementLi.appendChild(elementP);
    // Create <span> element (cross) - delete button
    const elementSpan = document.createElement("span");
    elementSpan.innerHTML = "\u00d7"; // Unicode for "x"
    elementSpan.classList.add("cross");
    // Click event on cross (deleteTask)
    elementSpan.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteTask(id);
    });
    elementLi.appendChild(elementSpan);
    // Append task to the task list (todoItems)
    todoItems.appendChild(elementLi);
};
// Function to toggle task completion
const toggleTaskCompletion = (taskId) => {
    // Find task by ID
    const task = allTasks.find((oneTask) => oneTask.id === taskId);
    if (!task)
        return;
    // Toggle completion
    task.isCompleted = !task.isCompleted;
    saveTasks(); // Save updated task state
    // Find task element <li> in the DOM and element <p>
    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`);
    const taskElementP = taskElementLi === null || taskElementLi === void 0 ? void 0 : taskElementLi.querySelector("p.text");
    // Toggle "completed" class for element <li> and <p>
    taskElementLi === null || taskElementLi === void 0 ? void 0 : taskElementLi.classList.toggle("completed");
    taskElementP === null || taskElementP === void 0 ? void 0 : taskElementP.classList.toggle("completed");
};
// Function to delete a task by ID
const deleteTask = (taskId) => {
    // Remove task from the allTask array
    allTasks = allTasks.filter((oneTask) => oneTask.id !== taskId);
    saveTasks(); // Save updated task state
    // Find task element <li> and remove from DOM
    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`);
    taskElementLi === null || taskElementLi === void 0 ? void 0 : taskElementLi.remove();
};
// Function to clear all completed tasks
const clearCompleted = () => {
    // Find all completed tasks
    const completedTasks = allTasks.filter((oneTask) => oneTask.isCompleted);
    // Validation
    if (completedTasks.length > 0) {
        // Remove completed tasks from the DOM
        completedTasks.forEach((oneTask) => {
            const taskElementLi = todoItems.querySelector(`[data-id="${oneTask.id}"]`);
            taskElementLi === null || taskElementLi === void 0 ? void 0 : taskElementLi.remove();
        });
        // Update the allTask array - leave only unfinished tasks
        allTasks = allTasks.filter((oneTask) => !oneTask.isCompleted);
        saveTasks(); // Save updated task state
    }
    else {
        alert("You don't have any completed tasks...");
    }
};
// Function hide or show message
const hideMessage = () => {
    if (allTasks.length === 0) {
        message.style.display = "flex";
    }
    else {
        message.style.display = "none";
    }
};
// Function to update the number of remaining tasks
const numOfItemsLeft = () => {
    numOfTasks.textContent = allTasks.filter((oneTask) => !oneTask.isCompleted).length.toString();
};
// Function to save tasks to localStorage
const saveTasks = () => {
    try {
        localStorage.setItem("allTasks", JSON.stringify(allTasks));
        numOfItemsLeft(); // Update task counter
        hideMessage(); // Hide message
    }
    catch (error) {
        console.error("Error while saving tasks to localStorage:", error);
    }
};
// Function to load tasks from localStorage
const loadTasks = () => {
    try {
        allTasks.forEach((oneTask) => createNewTask(oneTask));
        numOfItemsLeft();
        hideMessage();
    }
    catch (error) {
        console.error("Error while loading tasks:", error);
    }
};
// Event listener for addBtn
if (addBtn) {
    addBtn.addEventListener("click", (event) => {
        event.preventDefault();
        addTask();
    });
}
else {
    console.error("Add button not found!");
}
// Event listener for clearCompletedBtn
if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener("click", (event) => {
        event.preventDefault();
        clearCompleted();
    });
}
else {
    console.error("Clear Completed button not found!");
}
// Load tasks on page load
loadTasks();
