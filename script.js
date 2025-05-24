let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'today';
let lastResetTimes = JSON.parse(localStorage.getItem('lastResetTimes')) || {};

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('lastResetTimes', JSON.stringify(lastResetTimes));
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
  tasks[index].done = true; // Ne supprime plus, juste barre la tâche
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
  let resetKey = `${currentFilter}`;

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

  // Check for automatic reset
  if (!lastResetTimes[resetKey] || (new Date(lastResetTimes[resetKey]) < target && now >= target)) {
    tasks = tasks.filter(t => !(t.category === currentFilter && t.done));
    lastResetTimes[resetKey] = now.toISOString();
    saveTasks();
    renderTasks();
  }

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
    li.setAttribute('draggable', true);

    li.innerHTML = `
      <span onmousedown="startDrag(event)" onclick="toggleTask(${tasks.indexOf(task)})">${task.text}</span>
      <button onclick="deleteTask(${tasks.indexOf(task)})">✕</button>
    `;

    li.addEventListener('dragstart', (e) => handleDragStart(e, tasks.indexOf(task)));
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', (e) => handleDrop(e, tasks.indexOf(task)));

    list.appendChild(li);
  });

  updateTimer();
}

let dragSrcIndex = null;

function handleDragStart(e, index) {
  dragSrcIndex = index;
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e, index) {
  e.preventDefault();
  const draggedTask = tasks[dragSrcIndex];
  tasks.splice(dragSrcIndex, 1);
  tasks.splice(index, 0, draggedTask);
  saveTasks();
  renderTasks();
}

// Mode sombre
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

setInterval(updateTimer, 1000);
renderTasks();
