"use strict";
const inputBox = document.querySelector('.input-form input');
const addBtn = document.querySelector('.input-form button');
const todoItems = document.querySelector('.todo-items');
let keyword = "";
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
const createNewTask = (task) => {
    const elementLi = document.createElement('li');
    elementLi.setAttribute("data-id", task.id.toString());
    elementLi.classList.add("one-item");
    todoItems.appendChild(elementLi);
    const elementP = document.createElement('p');
    elementP.innerHTML = task.text;
    elementP.classList.add("text");
    elementLi.appendChild(elementP);
    const elementSpan = document.createElement('span');
    elementSpan.innerHTML = '\u00d7';
    elementSpan.classList.add("cross");
    elementLi.appendChild(elementSpan);
};
if (addBtn) {
    addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });
}
else {
    console.error("Add button not found!");
}
