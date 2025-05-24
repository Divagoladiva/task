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
  list.innerHTML = '';

  const filtered = tasks.filter(t => t.category === currentFilter);
  filtered.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.done ? 'done' : 'fade-in'}`;
    li.innerHTML = `
      <span onclick="toggleTask(${tasks.indexOf(task)})">${task.text}</span>
      <button onclick="deleteTask(${tasks.indexOf(task)})">✕</button>
    `;
    list.appendChild(li);
  });
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
  }

  const diff = target - now;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById('timer').textContent =
    `Temps restant: ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateTimer, 1000);
renderTasks();
