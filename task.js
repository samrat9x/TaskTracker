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
    const button = document.createElement("button");
    button.textContent = day;
    button.className = `tab-button ${day === currentDay ? "active" : ""}`;
    button.onclick = () => switchTab(day);
    tabsContainer.appendChild(button);
  });
  displayTasks();
}

function switchTab(day) {
  activeTab = day;
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.classList.toggle("active", btn.textContent === day);
  });
  displayTasks();
}

function displayTasks() {
  taskList.innerHTML = "";
  tasks = JSON.parse(localStorage.getItem("tasks")) || {};
  const dayTasks = tasks[activeTab] || [];
  dayTasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.innerHTML = `
            <input type="checkbox" onclick="toggleCompletion(${index})" ${
      task.completed ? "checked" : ""
    }>
            <div class="task-name ${
              task.completed ? "completed" : ""
            }" onclick="toggleCompletion(${index})">${task.name}</div>
            <button class="edit" onclick="editTask(${index})">Edit</button>
            <button class="delete" onclick="deleteTaskByName('${task.name.replace(
              /'/g,
              "\\'"
            )}')">Delete</button>
          `;
    taskList.appendChild(taskItem);
  });
}

function toggleCompletion(index) {
  tasks[activeTab][index].completed = !tasks[activeTab][index].completed;
  saveTasks();
  displayTasks();
}

function editTask(index) {
  const newName = prompt("Edit Task Name:", tasks[activeTab][index].name);
  if (newName) {
    tasks[activeTab][index].name = newName;
    saveTasks();
    displayTasks();
  }
}

// ✅ Modified delete function using task name instead of index
function deleteTaskByName(taskName) {
  tasks[activeTab] = tasks[activeTab].filter((task) => task.name !== taskName);
  saveTasks();
  displayTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveTask() {
  const taskName = taskNameInput.value.trim();
  const selectedDays = Array.from(
    document.querySelectorAll(".weekdays-container input:checked")
  ).map((checkbox) => checkbox.value);
  if (taskName && selectedDays.length) {
    selectedDays.forEach((day) => {
      tasks[day] = tasks[day] || [];
      tasks[day].push({ name: taskName, completed: false });
    });
    saveTasks();
    taskNameInput.value = "";
    document
      .querySelectorAll(".weekdays-container input:checked")
      .forEach((checkbox) => (checkbox.checked = false));
    addTaskPopup.style.display = "none";
    displayTasks();
  }
}

addTaskButton.addEventListener("click", () => {
  addTaskPopup.style.display = "flex";
});

closePopupButton.addEventListener("click", () => {
  addTaskPopup.style.display = "none";
});

function resetTasksIfDateChanged() {
  const lastResetDate = localStorage.getItem("lastResetDate");
  const today = new Date().toLocaleDateString();

  if (lastResetDate !== today) {
    for (const key in tasks) {
      tasks[key].forEach((e) => (e.completed = false));
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("lastResetDate", today);
  }
}

window.onload = () => {
  resetTasksIfDateChanged();
};

const dragArea = document.querySelector(".drag-area");
function saveSorted() {
  const items = JSON.parse(localStorage.getItem("tasks"));
  const dudu = Array.from(dragArea.children).map((task) => {
    return task.innerText.split("\n")[0];
  });

  let arr = [];

  dudu.forEach((e) => {
    items[activeTab].forEach((f) => {
      if (f.name == e) {
        arr.push(f);
      }
    });
  });

  items[activeTab] = arr;

  localStorage.setItem("tasks", JSON.stringify(items));
  displayTasks();
}

new Sortable(dragArea, {
  animation: 300,
  onEnd: saveSorted,
});

initializeTabs();
