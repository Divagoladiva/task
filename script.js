let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'today';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById('taskInput');
  const category = document.getElementById('categorySelect').value;

  if (input.value.trim() === '') return;

  tasks.push({ text: input.value.trim(), category, done: false });
  input.value = '';
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function filterTasks(category) {
  currentFilter = category;
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById('taskList');
  const title = document.getElementById('categoryTitle');
  list.innerHTML = '';

  const filtered = tasks.filter(t => t.category === currentFilter);
  const labelMap = {
    today: "Aujourd'hui",
    tomorrow: "Demain",
    week: "Cette semaine",
    month: "Ce mois",
    year: "Cette année"
  };

  title.textContent = `${labelMap[currentFilter]} (${filtered.length} tâche${filtered.length > 1 ? 's' : ''})`;

  filtered.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.done ? 'done' : 'fade-in'}`;
    li.innerHTML = `
      <span onclick="toggleTask(${tasks.indexOf(task)})">${task.text}</span>
      <button onclick="deleteTask(${tasks.indexOf(task)})">✕</button>
    `;
    list.appendChild(li);
  });

  updateTimer(); // 🧠 Important : Mettre à jour le timer ici aussi
}

setInterval(updateTimer, 1000);
renderTasks();
