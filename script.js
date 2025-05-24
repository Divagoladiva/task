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

function updateTimer() {
  const now = new Date();
  let target;

  switch (currentFilter) {
    case 'today':
      target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    case 'tomorrow':
      target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
      break;
    case 'week': {
      const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
      target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilMonday);
      target.setHours(0, 0, 0, 0);
      break;
    }
    case 'month':
      target = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    case 'year':
      target = new Date(now.getFullYear() + 1, 0, 1);
      break;
    default:
      document.getElementById('timer').textContent = '';
      return;
  }

  const diff = target - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('timer').textContent =
    `Temps restant: ${days}j ${hours}h ${minutes}m ${seconds}s`;
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

  title.textContent = `${labelMap[currentFilter]} (${filtered.length} tâche${filtered.length !== 1 ? 's' : ''})`;

  filtered.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.done ? 'done' : 'fade-in'}`;
    li.innerHTML = `
      <span onclick="toggleTask(${tasks.indexOf(task)})">${task.text}</span>
      <button onclick="deleteTask(${tasks.indexOf(task)})">✕</button>
    `;
    list.appendChild(li);
  });

  updateTimer(); // Met à jour le timer après avoir changé de catégorie
}

setInterval(updateTimer, 1000);
renderTasks();
