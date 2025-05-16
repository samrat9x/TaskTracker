// Every comments are written at the end of the statement

let tasks = JSON.parse(localStorage.getItem("tasks")) || {}; // Initialize tasks from local storage. If no tasks are found, initialize with an empty object
const currentDay = new Date().toLocaleString("en-us", {
  weekday: "short",
}); // Get the current day in short format (e.g., "Mon", "Tue", etc.)
const tabsContainer = document.querySelector(".tabs"); // Get the container for the tabs
const taskList = document.getElementById("taskList"); // Get the task list element
let activeTab = currentDay; // Set the active tab to the current day

const addTaskButton = document.getElementById("addTaskButton"); // Get the button to add a new task
const addTaskPopup = document.getElementById("addTaskPopup"); // Get the popup for adding a new task
const taskNameInput = document.getElementById("taskName"); // Get the input field for the task name
const closePopupButton = document.getElementById("closePopup"); // Get the button to close the popup

function initializeTabs() {
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
    const button = document.createElement("button"); // Create a new button for each day of the week
    button.textContent = day; // Set the button text to the day of the week
    button.className = `tab-button ${day === currentDay ? "active" : ""}`; // Set the button text and class
    button.onclick = () => switchTab(day); // Set the onclick event to switch tabs
    tabsContainer.appendChild(button); // Append the button to the tabs container
  }); // Create buttons for each day of the week
  displayTasks(); // Display tasks for the current day
} // Initialize the tabs with the days of the week

function switchTab(day) {
  activeTab = day; // Set the active tab to the selected day
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.classList.toggle("active", btn.textContent === day); // Toggle the active class based on the selected day
  }); // Switch the active class to the selected tab
  displayTasks(); // Display tasks for the selected day
} // Switch to the selected tab and display tasks for that day
//--------------------------------------------------------------------------------

function displayTasks() {
  taskList.innerHTML = ""; // Clear the task list before displaying new tasks
  tasks = JSON.parse(localStorage.getItem("tasks")) || {}; // Update tasks from local storage
  const dayTasks = tasks[activeTab] || []; // Get tasks for the active tab or an empty array if none exist
  dayTasks.forEach((task, index) => {
    const taskItem = document.createElement("li"); // Create a new list item for each task
    taskItem.className = "task-item"; // Set the class for the task item
    taskItem.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""}>
            <div class="task-name ${task.completed ? "completed" : ""}">${
      task.name
    }</div>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
          `; // Create the inner HTML for the task item
    // -------------------------------------------------------------------------------
    const checkbox = taskItem.querySelector("input[type='checkbox']"); // Get the checkbox element
    const taskName = taskItem.querySelector(".task-name"); // Get the task name element
    const editButton = taskItem.querySelector(".edit"); // Get the edit button
    const deleteButton = taskItem.querySelector(".delete"); // Get the delete button

    taskItem.addEventListener("pointerdown", (e) => {
      console.log("Task item clicked");
    });

    checkbox.addEventListener("change", (e) => {
      e.stopPropagation();
      console.log("Checkbox clicked");
      toggleCompletion(index); // Call the toggleCompletion function with the task index
    });
    editButton.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      editTask(index); // Call the editTask function with the task index
      console.log("Edit button clicked");
    });
    deleteButton.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      deleteTask(index); // Call the deleteTask function with the task index
      console.log("Delete button clicked");
    });

    // -------------------------------------------------------------------------------

    taskList.appendChild(taskItem); // Append the task item to the task list
  }); // Append each task to the task list
} // Display tasks for the active tab
//--------------------------------------------------------------------------------

function toggleCompletion(index) {
  tasks[activeTab][index].completed = !tasks[activeTab][index].completed;
  saveTasks();
  displayTasks();
} // Toggle the completion status of a task
//--------------------------------------------------------------------------------

function editTask(index) {
  const newName = prompt("Edit Task Name:", tasks[activeTab][index].name);
  if (newName) {
    tasks[activeTab][index].name = newName; // Update the task name
    saveTasks();
    displayTasks();
  }
} // Edit the name of a task
//--------------------------------------------------------------------------------

function deleteTask(index) {
  tasks[activeTab].splice(index, 1); // Remove the task from the list
  saveTasks();
  displayTasks();
} // Delete a task from the list
//--------------------------------------------------------------------------------

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Save tasks to local storage
} // Save tasks to local storage
//--------------------------------------------------------------------------------

function saveTask() {
  const taskName = taskNameInput.value.trim();
  const selectedDays = Array.from(
    document.querySelectorAll(".weekdays-container input:checked")
  ).map((checkbox) => checkbox.value); // Get selected days from checkboxes
  if (taskName && selectedDays.length) {
    selectedDays.forEach((day) => {
      tasks[day] = tasks[day] || []; // Initialize the day if it doesn't exist
      tasks[day].push({ name: taskName, completed: false }); // Add the new task to the selected days
    });
    saveTasks();
    shadowPopup.style.display = "none"; // Hide the shadow popup when clicking outside
    taskNameInput.value = ""; // Clear input field
    document
      .querySelectorAll(".weekdays-container input:checked")
      .forEach((checkbox) => (checkbox.checked = false)); // Clear checkboxes
    addTaskPopup.style.display = "none"; // Hide the popup
    displayTasks();
  }
} // Save a new task to the list
//--------------------------------------------------------------------------------

addTaskButton.addEventListener("click", () => {
  addTaskPopup.style.display = "flex"; // Show the popup to add a new task
}); // Show the popup to add a new task

closePopupButton.addEventListener("click", () => {
  addTaskPopup.style.display = "none"; // Hide the popup when the close button is clicked
  shadowPopup.style.display = "none"; // Hide the popup when the close button is clicked
}); // Close the popup when the close button is clicked
//--------------------------------------------------------------------------------

function resetTasksIfDateChanged() {
  const lastResetDate = localStorage.getItem("lastResetDate");
  const today = new Date().toLocaleDateString(); // Get current date in 'MM/DD/YYYY' format

  // If there's no last reset date or the date has changed
  if (lastResetDate !== today) {
    // Reset task completion statuses
    for (const key in tasks) {
      tasks[key].forEach((e) => (e.completed = false));
    }
    // Update the tasks in local storage
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Save the updated tasks

    // Save the new reset date
    localStorage.setItem("lastResetDate", today); // Update the last reset date
  }
} // Reset tasks if the date has changed
//--------------------------------------------------------------------------------

// Call this function on page load
window.onload = () => {
  resetTasksIfDateChanged(); // Ensure tasks are reset if the date has changed
}; // Call the function to reset tasks if the date has changed

//--------------------------------------------------------------------------------
const dragArea = document.querySelector(".drag-area");
function saveSorted() {
  const items = JSON.parse(localStorage.getItem("tasks"));
  const dudu = Array.from(dragArea.children).map((task) => {
    return task.innerText.split("\n")[0]; // retrieve data after sorting
  });

  let arr = [];

  dudu.forEach((e) => {
    items[activeTab].forEach((f) => {
      if (f.name == e) {
        arr.push(f);
      }
    });
  }); // Create a new array with the sorted tasks

  items[activeTab] = arr;

  localStorage.setItem("tasks", JSON.stringify(items));
  displayTasks();
}

// Initialize SortableJS
new Sortable(dragArea, {
  animation: 300,
  onEnd: saveSorted, // Save tasks after sorting
});
//--------------------------------------------------------------------------------

initializeTabs();

// Shadow popup when click + sign
const shadowPopup = document.querySelector(".shadow-popup");
addTaskButton.addEventListener("click", () => {
  shadowPopup.style.display = "block"; // Show the shadow popup
}); // Show the shadow popup when the add task button is clicked
shadowPopup.addEventListener("click", (e) => {
  if (e.target === shadowPopup) {
    shadowPopup.style.display = "none"; // Hide the shadow popup when clicking outside
    closePopupButton.click(); // Close the popup
  }
}); // Hide the shadow popup when clicking outside of it

//--------------------------------------------------------------------------------
