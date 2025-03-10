// Variables
const inputBox = document.querySelector('.input-form input') as HTMLInputElement
const addBtn = document.querySelector('.input-form button') as HTMLButtonElement
const todoItems = document.querySelector('.todo-items') as HTMLElement
const numOfTasks = document.querySelector(".num-of-tasks span") as HTMLElement

// Default values
let keyword: string = ""
let allTasks: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]")

// Task type
type Task = { id: number, text: string, isCompleted: boolean }

// Function to save tasks to localStorage
const saveTasks = (): void => {
    localStorage.setItem("allTasks", JSON.stringify(allTasks))
}

// Function to add task
const addTask = (): void => {
    keyword = inputBox.value.trim()

    // Validation
    if (keyword === "") {
        alert("Please enter a new todo...")
        return
    }

    // Create task object
    const newTask: Task = {
        id: Date.now(),
        text: keyword,
        isCompleted: false,
    }

    allTasks.push(newTask)
    numOfItemsLeft()
    saveTasks()

    createNewTask(newTask)

    inputBox.value = ""
}

// Function to create and display task
const createNewTask = (task: Task): void => {
    // Destructuring
    const { id, text, isCompleted } = task

    // Element li (class - one-item)
    const elementLi = document.createElement('li')
    elementLi.setAttribute("data-id", id.toString())
    elementLi.classList.add("one-item");
    if (isCompleted) {
        elementLi.classList.add("completed");
    }

    todoItems.appendChild(elementLi)

    // Adding event listener to <li> to click on :: before
    elementLi.addEventListener('click', (event) => {
        // Getting click position
        const clickX: number = event.clientX - elementLi.getBoundingClientRect().left;

        // Validation
        if (clickX) {
            toggleTaskCompletion(id)
        }
    })

    // Element p (class - text)
    const elementP = document.createElement('p')
    elementP.textContent = text
    elementP.classList.add("text")
    if (isCompleted) {
        elementP.classList.add("completed");
    }
    elementLi.appendChild(elementP)

    // Element span (class - cross) - delete button
    const elementSpan = document.createElement('span')
    elementSpan.innerHTML = '\u00d7'
    elementSpan.classList.add("cross")
    elementSpan.addEventListener('click', (e) => {
        // Zabrání přepnutí isCompleted při kliknutí na delete
        e.stopPropagation()
        deleteTask(id)
    })
    elementLi.appendChild(elementSpan)
}

// Function to toggle task completion
const toggleTaskCompletion = (taskId: number): void => {
    const findCompleteTask = allTasks.find(oneTask => oneTask.id === taskId)

    // Validation
    if (findCompleteTask) {
        findCompleteTask.isCompleted = !findCompleteTask.isCompleted
        saveTasks()
        numOfItemsLeft()

        const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`)
        taskElementLi?.classList.toggle("completed")

        const textElementP = taskElementLi?.querySelector("p.text")
        textElementP?.classList.toggle("completed")
    }
}

// Function to delete a task
const deleteTask = (taskId: number): void => {
    allTasks = allTasks.filter(oneTask => oneTask.id !== taskId)
    saveTasks()
    numOfItemsLeft()

    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`)
    if (taskElementLi) {
        todoItems.removeChild(taskElementLi)
    }
}

// Function numOfItemsLeft
const numOfItemsLeft = (): void => {
    const itemsLeft = allTasks.filter(task => task.isCompleted === false).length.toString()
    numOfTasks.textContent = itemsLeft
}

// Function to load tasks from localStorage
const loadTasks = (): void => {
    numOfItemsLeft()
    allTasks.forEach(task => createNewTask(task))
}

// Calling the addTask() function after the addBtn button is pressed
if (addBtn) {
    addBtn.addEventListener('click', (e) => {
        e.preventDefault()
        addTask()
    })
} else {
    console.error("Add button not found!")
}

// Load tasks on page load
loadTasks()