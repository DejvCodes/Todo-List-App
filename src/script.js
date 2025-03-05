"use strict";
// Variables
const inputBox = document.querySelector('.input-form input');
const addBtn = document.querySelector('.input-form button');
const todoItems = document.querySelector('.todo-items');
// Default values
let keyword = "";
// Function addTask()
const addTask = () => {
    keyword = inputBox.value.trim();
    if (keyword === "") {
        alert("Please enter a new todo...");
    }
    else {
        const newTask = {
            id: new Date().getTime(),
            text: keyword,
        };
        createNewTask(newTask);
    }
    inputBox.value = "";
};
// Function createNewTask()
const createNewTask = (task) => {
    // Element li (class one-item)
    const elementLi = document.createElement('li');
    elementLi.setAttribute("data-id", task.id.toString());
    elementLi.classList.add("one-item");
    todoItems.appendChild(elementLi);
    // Element p (class text)
    const elementP = document.createElement('p');
    elementP.innerHTML = task.text;
    elementP.classList.add("text");
    elementLi.appendChild(elementP);
    // Element span (class cross) - delete button
    const elementSpan = document.createElement('span');
    elementSpan.innerHTML = '\u00d7';
    elementSpan.classList.add("cross");
    elementLi.appendChild(elementSpan);
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
