// Variables
const inputBox = document.querySelector(".input-form input") as HTMLInputElement;
const addBtn = document.querySelector(".input-form button") as HTMLButtonElement;
const message = document.querySelector(".message") as HTMLElement;
const todoItems = document.querySelector(".todo-items") as HTMLElement;
const numOfTasks = document.querySelector(".num-of-tasks span") as HTMLElement;
const clearCompletedBtn = document.querySelector(".clear-completed") as HTMLButtonElement;
const loader = document.getElementById("loader") as HTMLElement;
const filterBtns = document.querySelectorAll(".filter-btn") as NodeListOf<HTMLButtonElement>;
const langToggle = document.getElementById("langToggle") as HTMLButtonElement;

// Default values
let allTasks: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
let currentFilter: string = "all";
let currentLang: string = localStorage.getItem("language") || "en";

// Task type definition
type Task = { id: number, text: string, isCompleted: boolean };

// Translations
type Translations = {
    [key: string]: {
        [key: string]: string;
    };
};

let translations: Translations = {};

// Load translations from JSON files
const loadTranslations = async (): Promise<void> => {
    try {
        const enResponse = await fetch('/locales/en.json');
        const czResponse = await fetch('/locales/cz.json');
        
        translations.en = await enResponse.json();
        translations.cz = await czResponse.json();
    } catch (error) {
        console.error("Error loading translations:", error);
    }
};

// Language switching
const switchLanguage = (): void => {
    currentLang = currentLang === "en" ? "cz" : "en";
    localStorage.setItem("language", currentLang);
    updateUILanguage();
    langToggle.textContent = currentLang.toUpperCase();
};

const updateUILanguage = (): void => {
    const trans = translations[currentLang];
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (key && trans[key]) {
            element.textContent = trans[key];
        }
    });
    
    // Update placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        const key = element.getAttribute("data-i18n-placeholder");
        if (key && trans[key]) {
            (element as HTMLInputElement).placeholder = trans[key];
        }
    });
};

// Loader spinner
const showLoader = (): void => {
    loader.style.display = "flex";
}

const hideLoader = (): void => {
    loader.style.display = "none";
}

// Function to add a new task
const addTasks = (): void => {
    const keyword: string = inputBox.value.trim();

    // Validation
    if (!keyword) {
        alert(translations[currentLang].alertEmpty);
        return;
    }

    // Create task object
    const newTask: Task = {
        id: Date.now(), // Unique ID
        text: keyword,
        isCompleted: false,
    }

    allTasks.push(newTask); // Add newTask to allTasks array
    createNewTask(newTask); // Render new task
    saveTasks(); // Save updated task state
    inputBox.value = ""; // Clear inputBox
}

// Function to create and display new task
const createNewTask = (task: Task): void => {
    // Destructure task object
    const { id, text, isCompleted } = task;

    // Validation
    if (todoItems.querySelector(`[data-id="${id}"]`)) return;

    // Create <li> element (one-item)
    const elementLi = document.createElement("li");
    elementLi.dataset.id = id.toString();
    elementLi.classList.add("one-item");
    if (isCompleted) elementLi.classList.add("completed");

    // Click event on one-item::before
    elementLi.addEventListener("click", (event: MouseEvent) => {
        event.stopPropagation();
        // Validation
        if (event.target !== elementSpan) {
            toggleTaskCompletion(id);
        }
    })

    // Create <p> element (text)
    const elementP = document.createElement("p");
    elementP.textContent = text;
    elementP.classList.add("text");
    if (isCompleted) elementP.classList.add("completed");
    elementLi.appendChild(elementP);

    // Create edit button
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✎";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", (event: MouseEvent) => {
        event.stopPropagation();
        editTask(id);
    });
    elementLi.appendChild(editBtn);

    // Create <span> element (cross) - delete button
    const elementSpan = document.createElement("span");
    elementSpan.innerHTML = "\u00d7"; // Unicode for "x"
    elementSpan.classList.add("cross");

    // Click event on cross (deleteTask)
    elementSpan.addEventListener("click", (event: MouseEvent) => {
        event.stopPropagation();
        deleteTasks(id);
    })
    elementLi.appendChild(elementSpan);
    // Append task to the task list (todoItems)
    todoItems.appendChild(elementLi);
    applyFilter();
}

// Function to toggle task completion
const toggleTaskCompletion = (taskId: number): void => {
    // Find task by ID
    const task = allTasks.find((oneTask) => oneTask.id === taskId);
    if (!task) return;

    // Toggle completion
    task.isCompleted = !task.isCompleted;
    saveTasks(); // Save updated task state

    // Find task element <li> in the DOM and element <p>
    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`);
    const taskElementP = taskElementLi?.querySelector("p.text");

    // Toggle "completed" class for element <li> and <p>
    taskElementLi?.classList.toggle("completed");
    taskElementP?.classList.toggle("completed");
    applyFilter();
}

// Function to delete a task by ID
const deleteTasks = (taskId: number): void => {
    // Remove task from the allTask array
    allTasks = allTasks.filter((oneTask) => oneTask.id !== taskId);
    saveTasks(); // Save updated task state

    // Find task element <li> and remove from DOM
    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`);
    taskElementLi?.remove();
    applyFilter();
}

// Function to clear all completed tasks
const clearCompleted = (): void => {
    // Find all completed tasks
    const completedTasks = allTasks.filter((oneTask) => oneTask.isCompleted);

    // Validation
    if (completedTasks.length === 0) {
        alert(translations[currentLang].alertNoCompleted);
        return;
    }

    // Remove completed tasks from the DOM
    completedTasks.forEach((oneTask) => {
        const taskElementLi = todoItems.querySelector(`[data-id="${oneTask.id}"]`);
        taskElementLi?.remove();
    })

    // Update the allTask array - leave only unfinished tasks
    allTasks = allTasks.filter((oneTask) => !oneTask.isCompleted);
    saveTasks(); // Save updated task state
    applyFilter();
}

// Function hide or show message
const hideMessage = (): void => {
    if (allTasks.length === 0) {
        message.style.display = "flex";
    } else {
        message.style.display = "none";
    }
}

// Function to update the number of remaining tasks
const numOfItemsLeft = (): void => {
    const itemsLeft = allTasks.filter((oneTask) => !oneTask.isCompleted);
    numOfTasks.textContent = itemsLeft.length.toString();
}

// Function to edit a task
const editTask = (taskId: number): void => {
    const task = allTasks.find((oneTask) => oneTask.id === taskId); // Find task by ID
    if (!task) return;

    const newText = prompt(translations[currentLang].editPrompt, task.text); // Prompt for new text
    if (newText === null || newText.trim() === "") return;

    task.text = newText.trim(); // Update task text
    saveTasks(); // Save updated task state

    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`); // Find task element <li>
    const taskElementP = taskElementLi?.querySelector("p.text"); // Find task element <p>
    if (taskElementP) taskElementP.textContent = newText.trim(); // Update displayed text
}

// Function to filter tasks
const applyFilter = (): void => {
    const taskElements = todoItems.querySelectorAll(".one-item");
    
    taskElements.forEach((taskElement) => {
        const taskId = parseInt(taskElement.getAttribute("data-id") || "0"); // Get task ID
        const task = allTasks.find((t) => t.id === taskId); // Find task by ID
        
        if (!task) return;
        
        if (currentFilter === "all") {
            (taskElement as HTMLElement).style.display = "flex";
        } else if (currentFilter === "active") {
            (taskElement as HTMLElement).style.display = task.isCompleted ? "none" : "flex";
        } else if (currentFilter === "completed") {
            (taskElement as HTMLElement).style.display = task.isCompleted ? "flex" : "none";
        }
    });
}

// Function to save tasks to localStorage
const saveTasks = (): void => {
    try {
        localStorage.setItem("allTasks", JSON.stringify(allTasks));
        numOfItemsLeft(); // Update task counter
        hideMessage(); // Hide message
    } catch (error) {
        console.error("Error while saving tasks to localStorage:", error);
    }
}

// Function to load tasks from localStorage
const loadTasks = (): void => {
    try {
        allTasks.forEach((oneTask) => createNewTask(oneTask));
        numOfItemsLeft(); // Update task counter
        hideMessage(); // Hide message
    } catch (error) {
        console.error("Error while loading tasks:", error);
    }
}

// Event listener for addBtn
if (!addBtn) throw new Error("Add button not found!");
addBtn.addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();
    addTasks();
})

// Event listener for Enter key
if (!inputBox) throw new Error("Input box not found!");
inputBox.addEventListener("keypress", (event: KeyboardEvent) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addTasks();
    }
})

// Event listener for clearCompletedBtn
if (!clearCompletedBtn) throw new Error("Clear Completed button not found!");
clearCompletedBtn.addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();
    clearCompleted();
})

// Event listeners for filter buttons
filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-filter") || "all";
        applyFilter();
    });
})

// Event listener for language toggle
if (!langToggle) throw new Error("Language toggle button not found!");
langToggle.addEventListener("click", () => {
    switchLanguage();
})

// Load tasks on page load + show loader
window.addEventListener("DOMContentLoaded", async () => {
    showLoader();
    await loadTranslations();
    updateUILanguage();
    langToggle.textContent = currentLang.toUpperCase();
    loadTasks();
    // Simulate loading delay
    setTimeout(() => {
        hideLoader();
    }, 1000);
});

// Footer year update
const footerYear = document.querySelector('footer p') as HTMLElement;
const currentYear = new Date().getFullYear();
footerYear.innerHTML = `Coded by <a href="https://dejvcodes.netlify.app/" target="_blank">DejvCodes</a>. © ${currentYear} David Kalmus.`;