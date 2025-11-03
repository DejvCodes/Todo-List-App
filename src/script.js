"use strict";
const inputBox = document.querySelector(".input-form input");
const addBtn = document.querySelector(".input-form button");
const message = document.querySelector(".message");
const todoItems = document.querySelector(".todo-items");
const numOfTasks = document.querySelector(".num-of-tasks span");
const clearCompletedBtn = document.querySelector(".clear-completed");
const loader = document.getElementById("loader");
let allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");
const showLoader = () => {
    loader.style.display = "flex";
};
const hideLoader = () => {
    loader.style.display = "none";
};
const addTasks = () => {
    const keyword = inputBox.value.trim();
    if (!keyword) {
        alert("Please enter a new todo...");
        return;
    }
    const newTask = {
        id: Date.now(),
        text: keyword,
        isCompleted: false,
    };
    allTasks.push(newTask);
    createNewTask(newTask);
    saveTasks();
    inputBox.value = "";
};
const createNewTask = (task) => {
    const { id, text, isCompleted } = task;
    if (todoItems.querySelector(`[data-id="${id}"]`))
        return;
    const elementLi = document.createElement("li");
    elementLi.dataset.id = id.toString();
    elementLi.classList.add("one-item");
    if (isCompleted)
        elementLi.classList.add("completed");
    elementLi.addEventListener("click", (event) => {
        event.stopPropagation();
        if (event.target !== elementSpan) {
            toggleTaskCompletion(id);
        }
    });
    const elementP = document.createElement("p");
    elementP.textContent = text;
    elementP.classList.add("text");
    if (isCompleted)
        elementP.classList.add("completed");
    elementLi.appendChild(elementP);
    const elementSpan = document.createElement("span");
    elementSpan.innerHTML = "\u00d7";
    elementSpan.classList.add("cross");
    elementSpan.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteTasks(id);
    });
    elementLi.appendChild(elementSpan);
    todoItems.appendChild(elementLi);
};
const toggleTaskCompletion = (taskId) => {
    const task = allTasks.find((oneTask) => oneTask.id === taskId);
    if (!task)
        return;
    task.isCompleted = !task.isCompleted;
    saveTasks();
    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`);
    const taskElementP = taskElementLi === null || taskElementLi === void 0 ? void 0 : taskElementLi.querySelector("p.text");
    taskElementLi === null || taskElementLi === void 0 ? void 0 : taskElementLi.classList.toggle("completed");
    taskElementP === null || taskElementP === void 0 ? void 0 : taskElementP.classList.toggle("completed");
};
const deleteTasks = (taskId) => {
    allTasks = allTasks.filter((oneTask) => oneTask.id !== taskId);
    saveTasks();
    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`);
    taskElementLi === null || taskElementLi === void 0 ? void 0 : taskElementLi.remove();
};
const clearCompleted = () => {
    const completedTasks = allTasks.filter((oneTask) => oneTask.isCompleted);
    if (completedTasks.length === 0) {
        alert("You don't have any completed tasks...");
        return;
    }
    completedTasks.forEach((oneTask) => {
        const taskElementLi = todoItems.querySelector(`[data-id="${oneTask.id}"]`);
        taskElementLi === null || taskElementLi === void 0 ? void 0 : taskElementLi.remove();
    });
    allTasks = allTasks.filter((oneTask) => !oneTask.isCompleted);
    saveTasks();
};
const hideMessage = () => {
    if (allTasks.length === 0) {
        message.style.display = "flex";
    }
    else {
        message.style.display = "none";
    }
};
const numOfItemsLeft = () => {
    const itemsLeft = allTasks.filter((oneTask) => !oneTask.isCompleted);
    numOfTasks.textContent = itemsLeft.length.toString();
};
const saveTasks = () => {
    try {
        localStorage.setItem("allTasks", JSON.stringify(allTasks));
        numOfItemsLeft();
        hideMessage();
    }
    catch (error) {
        console.error("Error while saving tasks to localStorage:", error);
    }
};
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
addBtn.addEventListener("click", (event) => {
    event.preventDefault();
    addTasks();
});
if (!addBtn)
    throw new Error("Add button not found!");
clearCompletedBtn.addEventListener("click", (event) => {
    event.preventDefault();
    clearCompleted();
});
if (!clearCompletedBtn)
    throw new Error("Clear Completed button not found!");
window.addEventListener("DOMContentLoaded", () => {
    showLoader();
    setTimeout(() => {
        loadTasks();
        hideLoader();
    }, 500);
});
