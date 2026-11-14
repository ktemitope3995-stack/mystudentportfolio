// Academic planner: tasks live in an array and are saved in localStorage
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const due = document.getElementById("dueInput");
const list = document.getElementById("taskList");
const msg = document.getElementById("taskMsg");
const summary = document.getElementById("summary");
let tasks = [];

try { tasks = JSON.parse(localStorage.getItem("tasks")) || []; } catch (e) { tasks = []; }

function save() {
  try { localStorage.setItem("tasks", JSON.stringify(tasks)); } catch (e) {}
}

function render() {
  list.innerHTML = "";
  if (tasks.length === 0) {
    list.innerHTML = '<li class="empty">No tasks yet. Add your first task above.</li>';
  }
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = task.done;
    box.setAttribute("aria-label", "Mark complete: " + task.text);
    box.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = task.text;
    if (task.due) {
      const small = document.createElement("small");
      small.textContent = "Due " + task.due;
      text.appendChild(small);
    }

    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "Delete";
    del.setAttribute("aria-label", "Delete task: " + task.text);
    del.addEventListener("click", () => deleteTask(task.id));

    li.append(box, text, del);
    list.appendChild(li);
  });
  const done = tasks.filter(t => t.done).length;
  summary.textContent = tasks.length + " task" + (tasks.length === 1 ? "" : "s") + ", " + done + " completed";
}

function addTask(text, dueDate) {
  tasks.push({ id: Date.now(), text: text, due: dueDate, done: false });
  save(); render();
}
function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  save(); render();
}
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save(); render();
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) { msg.textContent = "Enter a task before adding it."; input.focus(); return; }
  msg.textContent = "";
  addTask(text, due.value);
  form.reset();
  input.focus();
});

render();
