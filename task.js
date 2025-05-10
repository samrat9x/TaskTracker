let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
const currentDay = new Date().toLocaleString("en-us", {
  weekday: "short",
});
const tabsContainer = document.querySelector(".tabs");
const taskList = document.getElementById("taskList");
let activeTab = currentDay;

const addTaskButton = document.getElementById("addTaskButton");
const addTaskPopup = document.getElementById("addTaskPopup");
const taskNameInput = document.getElementById("taskName");
const closePopupButton = document.getElementById("closePopup");

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
            <button class="delete" onclick="deleteTask(${index})">Delete</button>
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

function deleteTask(index) {
  tasks[activeTab].splice(index, 1);
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
    taskNameInput.value = ""; // Clear input field
    document
      .querySelectorAll(".weekdays-container input:checked")
      .forEach((checkbox) => (checkbox.checked = false)); // Clear checkboxes
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
  const today = new Date().toLocaleDateString(); // Get current date in 'MM/DD/YYYY' format

  // If there's no last reset date or the date has changed
  if (lastResetDate !== today) {
    // Reset task completion statuses
    for (const key in tasks) {
      tasks[key].forEach((e) => (e.completed = false));
    }
    // Update the tasks in local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Save the new reset date
    localStorage.setItem("lastResetDate", today);
  }
}

// Call this function on page load
window.onload = () => {
  resetTasksIfDateChanged(); // Ensure tasks are reset if the date has changed
};

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
  });

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
