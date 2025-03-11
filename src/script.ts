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

    allTasks.push(newTask) // Add newTask to the allTasks
    saveTasks() // Save tasks to local storage
    createNewTask(newTask)// Render newTask
    numOfItemsLeft() // Update remaining task count

    inputBox.value = "" // Clear inputBox
}

// Function to create and display task
const createNewTask = (task: Task): void => {
    // Destructuring
    const { id, text, isCompleted } = task

    // Create li element (one-item)
    const elementLi = document.createElement('li')
    elementLi.dataset.id = id.toString()
    elementLi.classList.add("one-item");
    if (isCompleted) elementLi.classList.add("completed")

    // Click event on one-item::before
    elementLi.addEventListener('click', (event) => {
        // Click position
        const clickX: number = event.clientX - elementLi.getBoundingClientRect().left;
        // Validation
        if (clickX) toggleTaskCompletion(id)
    })

    // Create p element (text)
    const elementP = document.createElement('p')
    elementP.textContent = text
    elementP.classList.add("text")
    if (isCompleted) elementP.classList.add("completed")
    elementLi.appendChild(elementP)

    // Create span element (cross) - delete button
    const elementSpan = document.createElement('span')
    elementSpan.innerHTML = '\u00d7'
    elementSpan.classList.add("cross")
    elementSpan.addEventListener('click', () => deleteTask(id))
    elementLi.appendChild(elementSpan)

    // Append task to list
    todoItems.appendChild(elementLi)
}

// Function to toggle task completion
const toggleTaskCompletion = (taskId: number): void => {
    const task = allTasks.find((oneTask) => oneTask.id === taskId)
    if (!task) return

    task.isCompleted = !task.isCompleted
    saveTasks()
    numOfItemsLeft()

    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`)
    if (!taskElementLi) return

    taskElementLi?.classList.toggle("completed")
    taskElementLi.querySelector("p.text")?.classList.toggle("completed")
}

// Function to delete a task
const deleteTask = (taskId: number): void => {
    allTasks = allTasks.filter((oneTask) => oneTask.id !== taskId)
    saveTasks()
    numOfItemsLeft()

    const taskElementLi = todoItems.querySelector(`[data-id="${taskId}"]`)
    if (!taskElementLi) return
    taskElementLi.remove()
}

// Function to update the number of remaining tasks
const numOfItemsLeft = (): void => {
    const itemsLeft = allTasks.filter((task) => !task.isCompleted).length.toString()
    numOfTasks.textContent = itemsLeft
}

// Function to load tasks from localStorage
const loadTasks = (): void => {
    numOfItemsLeft()
    allTasks.forEach((task) => createNewTask(task))
}

// Event listener for addBtn
addBtn?.addEventListener('click', (e) => {
    e.preventDefault()
    addTask()
})
if (!addBtn) console.error("Add button not found!")

// Load tasks on page load
loadTasks()