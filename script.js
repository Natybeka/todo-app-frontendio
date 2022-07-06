// Query UI elements from the DOM
const inputBox = document.querySelector(".todo-input");
const inputForm = document.querySelector(".input-todo");
const form = document.querySelector("form");
const taskList = document.querySelector(".task-section");
const mainContent = document.querySelector(".main-content");
const darkMode = document.querySelector(".dark-mode");
const clear = document.querySelector(".clear-completed");
const filterList = document.querySelector(".task-filters");
const activeFilter = document.querySelector(".active-filter");
const allFilter = document.querySelector(".all-filter");
const completedFilter = document.querySelector(".completed-filter");

// State management
state = [];

// set state callback
function setState(callback) {
    callback();
    paintUI();
}

/**
 * Here are utility functions used to update the UI
 *
 */
function paintUI() {
    // Check if the state is empty
    clearAll();

    if (state.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.classList.add("todo-task");

        if (isDarkMode()) {
            emptyMessage.classList.add("dark");
        }

        emptyMessage.style.width = "100%";
        emptyMessage.innerHTML = `<p class="empty-message" style='width: 100%;text-align: center;'>Nothing for now. Feel free to add a task</p>`;
        taskList.appendChild(emptyMessage);
    } else {
        for (let i = 0; i < state.length; i++) {
            createTask(state[i]);
        }
    }

    document.querySelector(
        ".items-left"
    ).innerHTML = `${state.length} items remaining`;
}

function isDarkMode() {
    return darkMode.classList.contains("dark");
}

function createTask(task) {
    const newTask = document.createElement("li");
    newTask.classList.add("todo-task");
    var darkMode = isDarkMode();
    if (darkMode) {
        newTask.classList.add("dark");
    }
    newTask.innerHTML = `<input
                                type="checkbox"
                                name="add-todo"
                                class="todo-complete ${darkMode ? "dark" : ""}"
                            ${task.isComplete ? "checked" : ""}/>
                            
                            <p class="task-description" data-id="${task.id}">${
        task.description
    }</p>
                            
                            <img
                                src="./images/icon-cross.svg"
                                alt="delete-task"
                                class="delete-task"
                            />`;
    taskList.appendChild(newTask);
    document.querySelector(
        ".items-left"
    ).innerHTML = `${state.length} items remaining`;
}

function clearAll() {
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
}

function IDgenerator() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substring(2, 9);
}
/**
 * Section dedicated to event listeners
 * and updates the state including clear,addtask, deletetask, and
 * complete task switch
 */
mainContent.addEventListener("click", (e) => {
    var listItem = e.target.parentNode;
    let description = listItem.querySelector(".task-description");
    if (e.target.classList.contains("delete-task")) {
        setState(() => {
            // find the item with the set id
            state = state.filter((state) => state.id != description.dataset.id);
            console.log(state);
            localStorage.setItem("tasks", JSON.stringify(state));
        });
    }

    if (e.target.classList.contains("todo-complete")) {
        setState(() => {
            let element = state.find((el) => el.id == description.dataset.id);
            element.isComplete = !element.isComplete;
            localStorage.setItem("tasks", JSON.stringify(state));
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    setState(() => {
        if (tasks !== null) {
            tasks.forEach((task) => {
                state.push({
                    description: task.description,
                    id: task.id,
                    isComplete: task.isComplete,
                });
            });
        }
    });
});

inputBox.addEventListener("click", (e) => {
    inputForm.focus();
});

form.onsubmit = (e) => {
    e.preventDefault();
    var task = inputForm.value;
    if (!task) {
        alert("please enter a valid item");
        return;
    }
    setState(() => {
        state.push({ description: task, id: IDgenerator(), isComplete: false });
        localStorage.setItem("tasks", JSON.stringify(state));

        let emptyMessage = document.querySelector(".empty-message");
        if (state.length !== 0 && emptyMessage !== null) {
            emptyMessage.parentElement.style.display = "none";
        }
    });
};

darkMode.addEventListener("click", (e) => {
    // toggle the dark keyword in all the components
    darkMode.classList.toggle("dark");
    inputBox.classList.toggle("dark");
    document.querySelector("body").classList.toggle("dark");
    inputForm.classList.toggle("dark");
    mainContent.classList.toggle("dark");
    var allTasks = document.querySelectorAll(".todo-task");
    allTasks.forEach((task) => task.classList.toggle("dark"));
    var checkBoxes = document.querySelectorAll("input[type='checkbox']");
    checkBoxes.forEach((checkBox) => checkBox.classList.toggle("dark"));

    filterList.classList.toggle("dark");
    var taskFilters = document.querySelectorAll(".task-filters li");
    taskFilters.forEach((filter) => filter.classList.toggle("dark"));
    document.querySelector(".clear-completed").classList.toggle("dark");
    document.querySelector(".task-filters-mobile").classList.toggle("dark");
});

clear.addEventListener("click", (e) => {
    setState(() => {
        state = state.filter((task) => task.isComplete === false);
        localStorage.setItem("tasks", state);
    });
});

// Filter the tasks
allFilter.addEventListener("click", (e) => {
    let currentFilter = filterList.querySelector(".active");
    currentFilter.classList.remove("active");
    allFilter.classList.add("active");
    clearAll();
    state.forEach((task) => createTask(task));
});

activeFilter.addEventListener("click", (e) => {
    let activeTasks = state.filter((state) => state.isComplete == false);

    let currentFilter = filterList.querySelector(".active");
    currentFilter.classList.remove("active");

    activeFilter.classList.add("active");
    clearAll();
    activeTasks.forEach((task) => createTask(task));
});

completedFilter.addEventListener("click", (e) => {
    let currentFilter = filterList.querySelector(".active");
    currentFilter.classList.remove("active");
    let completedTasks = state.filter((state) => state.isComplete == true);

    completedFilter.classList.add("active");
    clearAll();
    completedTasks.forEach((task) => createTask(task));
});
