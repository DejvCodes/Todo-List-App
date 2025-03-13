// Variables
const inputBox = document.querySelector(".input-form input") as HTMLInputElement
const addBtn = document.querySelector(".input-form button") as HTMLButtonElement
const message = document.querySelector(".message") as HTMLElement
const todoItems = document.querySelector(".todo-items") as HTMLElement
const numOfTasks = document.querySelector(".num-of-tasks span") as HTMLElement
const clearCompletedBtn = document.querySelector(".clear-completed") as HTMLButtonElement

// Default values
let allTasks: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]")

// Task type definition
type Task = { id: number, text: string, isCompleted: boolean }

// Function to add a new task
const addTask = (): void => {
    const keyword: string = inputBox.value.trim()

    // Validation
    if (!keyword) {
        alert("Please enter a new todo...")
        return
    }

    // Create task object
    const newTask: Task = {
        id: Date.now(), // Unique ID
        text: keyword,
        isCompleted: false,
    }

    allTasks.push(newTask) // Add newTask to allTasks array
    createNewTask(newTask) // Render new task
    saveTasks() // Save updated task state
    inputBox.value = "" // Clear inputBox
}

// Function to create and display new task
const createNewTask = (task: Task): void => {
    // Destructure task object
    const { id, text, isCompleted } = task

    // Create <li> element (one-item)
    const elementLi = document.createElement("li")
    elementLi.dataset.id = id.toString()
    elementLi.classList.add("one-item")
    if (isCompleted) elementLi.classList.add("completed")

    // Click event on one-item::before
    elementLi.addEventListener("click", (event: MouseEvent) => {
        event.stopPropagation()
        // Click position
        const clickX: number = event.clientX - elementLi.getBoundingClientRect().left;
        // Validation
        if ((event.target as HTMLElement).tagName !== "SPAN" && clickX) {
            toggleTaskCompletion(id)
        }
    })

    // Create <p> element (text)
    const elementP = document.createElement("p")
    elementP.textContent = text
    elementP.classList.add("text")
    if (isCompleted) elementP.classList.add("completed")
    elementLi.appendChild(elementP)

    // Create <span> element (cross) - delete button
    const elementSpan = document.createElement("span")
    elementSpan.innerHTML = "\u00d7" // Unicode for "x"
    elementSpan.classList.add("cross")

    // Click event on cross (deleteTask)
    elementSpan.addEventListener("click", (event: MouseEvent) => {
        event.stopPropagation()
        deleteTask(id)
    })
    elementLi.appendChild(elementSpan)

    // Append task to the task list (todoItems)
    todoItems.appendChild(elementLi)
}

// Function to toggle task completion
const toggleTaskCompletion = (taskId: number): void => {
    // Find task by ID
    const task = allTasks.find((oneTask) => oneTask.id === taskId)
    if (!task) return

    // Toggle completion
    task.isCompleted = !task.isCompleted
    saveTasks() // Save updated task state

    // Find task element <li> in the DOM and element <p>
    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`)
    const taskElementP = taskElementLi?.querySelector("p.text")

    // Toggle "completed" class for element <li> and <p>
    taskElementLi?.classList.toggle("completed")
    taskElementP?.classList.toggle("completed")
}

// Function to delete a task by ID
const deleteTask = (taskId: number): void => {
    // Remove task from the allTask array
    allTasks = allTasks.filter((oneTask) => oneTask.id !== taskId)
    saveTasks() // Save updated task state

    // Find task element <li> and remove from DOM
    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`)
    taskElementLi?.remove()
}

// Function to clear all completed tasks
const clearCompleted = (): void => {
    // Find all completed tasks
    const completedTasks = allTasks.filter((oneTask) => oneTask.isCompleted)

    // Validation
    if (completedTasks.length > 0) {
        // Remove completed tasks from the DOM
        completedTasks.forEach((oneTask) => {
            const taskElementLi = todoItems.querySelector(`[data-id="${oneTask.id}"]`)
            taskElementLi?.remove()
        })

        // Update the allTask array - leave only unfinished tasks
        allTasks = allTasks.filter((oneTask) => !oneTask.isCompleted)
        saveTasks() // Save updated task state
    } else {
        alert("You don't have any completed tasks...")
    }
}

// Function hide or show message
const hideMessage = (): void => {
    if (allTasks.length === 0) {
        message.style.display = "flex"
    } else {
        message.style.display = "none"
    }
}

// Function to update the number of remaining tasks
const numOfItemsLeft = (): void => {
    numOfTasks.textContent = allTasks.filter((oneTask) => !oneTask.isCompleted).length.toString()
}

// Function to save tasks to localStorage
const saveTasks = (): void => {
    try {
        localStorage.setItem("allTasks", JSON.stringify(allTasks))
        numOfItemsLeft() // Update task counter
        hideMessage() // Hide message
    } catch (error) {
        console.error("Error while saving tasks to localStorage:", error)
    }
}

// Function to load tasks from localStorage
const loadTasks = (): void => {
    try {
        allTasks.forEach((oneTask) => createNewTask(oneTask))
        numOfItemsLeft()
        hideMessage()
    } catch (error) {
        console.error("Error while loading tasks:", error)
    }
}

// Event listener for addBtn
if (addBtn) {
    addBtn.addEventListener("click", (event: MouseEvent) => {
        event.preventDefault()
        addTask()
    })
} else { console.error("Add button not found!") }

// Event listener for clearCompletedBtn
if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener("click", (event: MouseEvent) => {
        event.preventDefault()
        clearCompleted()
    })
} else { console.error("Clear Completed button not found!") }

// Load tasks on page load
loadTasks()