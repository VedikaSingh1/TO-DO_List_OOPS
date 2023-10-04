"use strict";

const form = document.querySelector(".todo-list");
const taskEntries = document.querySelector(".tasks");
const addButton = document.querySelector("#add");
const filterButton = document.querySelector("#filter-priority");
const prioritySelect = document.querySelector("#priority");

class Task {
  constructor(title, priority = "Medium") {
    this.title = title;
    this.priority = priority;
    this.completed = false;
  }

  complete() {
    this.completed = true;
  }

  undo() {
    this.completed = false;
  }

  editTitle(newTitle) {
    this.title = newTitle;
  }
}

class TaskList {
  constructor() {
    this.tasks = [];
  }
  addTask(title, priority) {
    const newTask = new Task(title, priority);
    this.tasks.push(newTask);
  }
  removeTask(task) {
    const index = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }
  //DISPLAY ENTRIES
  renderTasks(taskEntries, tasksToRender = this.tasks) {
    taskEntries.innerHTML = ""; //RESET
    tasksToRender.forEach((task, index) => {
      const taskDiv = document.createElement("div");
      taskDiv.innerHTML = `
      <p class="${task.completed ? "completed" : ""}">${
        task.title
      } (Priority: ${task.priority})</p>
      <button class="complete-btn" data-index="${index}">${
        task.completed ? "Undo" : "Complete"
      }</button>
      <button class="edit-btn" data-index="${index}">Edit</button>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;

      const completeButton = taskDiv.querySelector(".complete-btn");
      const editButton = taskDiv.querySelector(".edit-btn");
      const deleteButton = taskDiv.querySelector(".delete-btn");
      const taskTitle = taskDiv.querySelector("p");

      completeButton.addEventListener("click", () => {
        if (task.completed) {
          task.undo();
        } else {
          task.complete();
        }
        this.renderTasks(taskEntries, tasksToRender);
      });

      editButton.addEventListener("click", () => {
        const newTitle = prompt("Edit Task Title:", task.title);
        if (newTitle !== null && newTitle.trim() !== "") {
          task.editTitle(newTitle);
          this.renderTasks(taskEntries);
        }
      });

      deleteButton.addEventListener("click", () => {
        this.removeTask(task);
        this.renderTasks(taskEntries, tasksToRender);
      });

      if (task.completed) {
        taskTitle.style.textDecoration = "line-through";
      }

      taskEntries.appendChild(taskDiv);
    });
  }

  filterTasksByPriority(priority) {
    return this.tasks.filter((task) => task.priority === priority);
  }
}

const taskList = new TaskList();

addButton.addEventListener("click", (event) => {
  event.preventDefault();
  const titleInput = document.querySelector("#title");
  const title = titleInput.value.trim();
  const priority = prioritySelect.value;
  if (title !== "") {
    taskList.addTask(title, priority);
    titleInput.value = "";
    taskList.renderTasks(taskEntries);
  }
});

taskList.renderTasks(taskEntries);

const priorityFilterSelect = document.querySelector("#priority-filter");

filterButton.addEventListener("click", () => {
  const selectedPriority = priorityFilterSelect.value;
  let filteredTasks;

  if (selectedPriority !== "all") {
    filteredTasks = taskList.filterTasksByPriority(selectedPriority);
  } else {
    filteredTasks = taskList.tasks; // Display all tasks when "All" is selected
  }

  taskList.renderTasks(taskEntries, filteredTasks);
});
