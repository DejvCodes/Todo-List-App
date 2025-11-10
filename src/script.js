"use strict";
const inputBox = document.querySelector(".input-form input");
const addBtn = document.querySelector(".input-form button");
const message = document.querySelector(".message");
const todoItems = document.querySelector(".todo-items");
const numOfTasks = document.querySelector(".num-of-tasks span");
const clearCompletedBtn = document.querySelector(".clear-completed");
const loader = document.getElementById("loader");
const filterBtns = document.querySelectorAll(".filter-btn");
let allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");
let currentFilter = "all";
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
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✎";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        editTask(id);
    });
    elementLi.appendChild(editBtn);
    const elementSpan = document.createElement("span");
    elementSpan.innerHTML = "\u00d7";
    elementSpan.classList.add("cross");
    elementSpan.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteTasks(id);
    });
    elementLi.appendChild(elementSpan);
    todoItems.appendChild(elementLi);
    applyFilter();
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
    applyFilter();
};
const deleteTasks = (taskId) => {
    allTasks = allTasks.filter((oneTask) => oneTask.id !== taskId);
    saveTasks();
    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`);
    taskElementLi === null || taskElementLi === void 0 ? void 0 : taskElementLi.remove();
    applyFilter();
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
    applyFilter();
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
const editTask = (taskId) => {
    const task = allTasks.find((oneTask) => oneTask.id === taskId);
    if (!task)
        return;
    const newText = prompt("Edit your task:", task.text);
    if (newText === null || newText.trim() === "")
        return;
    task.text = newText.trim();
    saveTasks();
    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`);
    const taskElementP = taskElementLi === null || taskElementLi === void 0 ? void 0 : taskElementLi.querySelector("p.text");
    if (taskElementP)
        taskElementP.textContent = newText.trim();
};
const applyFilter = () => {
    const taskElements = todoItems.querySelectorAll(".one-item");
    taskElements.forEach((taskElement) => {
        const taskId = parseInt(taskElement.getAttribute("data-id") || "0");
        const task = allTasks.find((t) => t.id === taskId);
        if (!task)
            return;
        if (currentFilter === "all") {
            taskElement.style.display = "flex";
        }
        else if (currentFilter === "active") {
            taskElement.style.display = task.isCompleted ? "none" : "flex";
        }
        else if (currentFilter === "completed") {
            taskElement.style.display = task.isCompleted ? "flex" : "none";
        }
    });
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
if (!addBtn)
    throw new Error("Add button not found!");
addBtn.addEventListener("click", (event) => {
    event.preventDefault();
    addTasks();
});
if (!inputBox)
    throw new Error("Input box not found!");
inputBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addTasks();
    }
});
if (!clearCompletedBtn)
    throw new Error("Clear Completed button not found!");
clearCompletedBtn.addEventListener("click", (event) => {
    event.preventDefault();
    clearCompleted();
});
filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-filter") || "all";
        applyFilter();
    });
});
window.addEventListener("DOMContentLoaded", () => {
    showLoader();
    loadTasks();
    setTimeout(() => {
        hideLoader();
    }, 1000);
});
const footerYear = document.querySelector('footer p');
const currentYear = new Date().getFullYear();
footerYear.innerHTML = `Coded by <a href="https://dejvcodes.netlify.app/" target="_blank">DejvCodes</a>. © ${currentYear} David Kalmus.`;
