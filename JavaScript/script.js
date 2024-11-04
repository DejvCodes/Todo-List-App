// Variables
const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');
const addBtn = document.getElementById('add-btn');

// Default values
let keyword = '';

// Function addTask()
const addTask = () => {
    keyword = inputBox.value.trim();
    // Validace zdali uživatel vyplnil input
    if (keyword === '') {
        alert('You must write your task!');
        return;
    } else {
        // Vytvořeni <li> elementu + přidání hodnoty
        const li = document.createElement('li');
        li.innerHTML = keyword;
        listContainer.appendChild(li);

        // Vytvoření křížku pro smazání
        const span = document.createElement('span');
        span.innerHTML = '\u00d7';
        li.appendChild(span);
    }
    // Po přidání úkolu nastavíme inputBox na prázdný string
    inputBox.value = '';
    // Uložení dat po přidání úkolu
    saveData();
}

// Splnění úkolu nebo jeho smazání (zavoláme funkci saveData() pro uložení)
listContainer.addEventListener('click', (e) => {
    if (e.target.tagName == 'LI') {
        e.target.classList.toggle('checked');
        saveData();
    }
    if (e.target.tagName == 'SPAN') {
        e.target.parentElement.remove();
        saveData();
    }
})

// Function saveData()
const saveData = () => {
    localStorage.setItem('data', listContainer.innerHTML);
}

// Function showData()
const showData = () => {
    if (localStorage.getItem('data')) {
        listContainer.innerHTML = localStorage.getItem('data');
    }
}
showData();

// Zavolání funkce addTask() po stisknutí tlačítka addBtn
addBtn.addEventListener('click', addTask);

// Přidání události pro klávesu Enter k přidání úkolu
inputBox.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        addTask();
    }
})