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
    allTasks.push(newTask);
    numOfItemsLeft();
    saveTasks();
    createNewTask(newTask);
    inputBox.value = "";
};
// Function to create and display task
const createNewTask = (task) => {
    // Destructuring
    const { id, text, isCompleted } = task;
    // Element li (class - one-item)
    const elementLi = document.createElement('li');
    elementLi.setAttribute("data-id", id.toString());
    elementLi.classList.add("one-item");
    if (isCompleted) {
        elementLi.classList.add("completed");
    }
    todoItems.appendChild(elementLi);
    // Adding event listener to <li> to click on :: before
    elementLi.addEventListener('click', (event) => {
        // Getting click position
        const clickX = event.clientX - elementLi.getBoundingClientRect().left;
        // Validation
        if (clickX) {
            toggleTaskCompletion(id);
        }
    });
    // Element p (class - text)
    const elementP = document.createElement('p');
    elementP.textContent = text;
    elementP.classList.add("text");
    if (isCompleted) {
        elementP.classList.add("completed");
    }
    elementLi.appendChild(elementP);
    // Element span (class - cross) - delete button
    const elementSpan = document.createElement('span');
    elementSpan.innerHTML = '\u00d7';
    elementSpan.classList.add("cross");
    elementSpan.addEventListener('click', (e) => {
        // Zabrání přepnutí isCompleted při kliknutí na delete
        e.stopPropagation();
        deleteTask(id);
    });
    elementLi.appendChild(elementSpan);
};
// Function to toggle task completion
const toggleTaskCompletion = (taskId) => {
    const findCompleteTask = allTasks.find(oneTask => oneTask.id === taskId);
    // Validation
    if (findCompleteTask) {
        findCompleteTask.isCompleted = !findCompleteTask.isCompleted;
        saveTasks();
        numOfItemsLeft();
        const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`);
        taskElementLi === null || taskElementLi === void 0 ? void 0 : taskElementLi.classList.toggle("completed");
        const textElementP = taskElementLi === null || taskElementLi === void 0 ? void 0 : taskElementLi.querySelector("p.text");
        textElementP === null || textElementP === void 0 ? void 0 : textElementP.classList.toggle("completed");
    }
};
// Function to delete a task
const deleteTask = (taskId) => {
    allTasks = allTasks.filter(oneTask => oneTask.id !== taskId);
    saveTasks();
    numOfItemsLeft();
    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`);
    if (taskElementLi) {
        todoItems.removeChild(taskElementLi);
    }
};
// Function numOfItemsLeft
const numOfItemsLeft = () => {
    const itemsLeft = allTasks.filter(task => task.isCompleted === false).length.toString();
    numOfTasks.textContent = itemsLeft;
};
// Function to load tasks from localStorage
const loadTasks = () => {
    numOfItemsLeft();
    allTasks.forEach(task => createNewTask(task));
};
// Calling the addTask() function after the addBtn button is pressed
if (addBtn) {
    addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });
}
else {
    console.error("Add button not found!");
}
// Load tasks on page load
loadTasks();
