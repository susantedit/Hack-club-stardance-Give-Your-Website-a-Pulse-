const DEFAULT_TASKS = [
    { id: 't1', text: 'Explore daily NASA APOD discovery', completed: true },
    { id: 't2', text: 'Orbit through 3D Solar System', completed: false }
];

export function initTasks() {
    const listEl = document.getElementById('tasks-list');
    const form = document.getElementById('task-input-form');
    const input = document.getElementById('task-input');
    const dateTitle = document.getElementById('widget-task-date');

    if (dateTitle) {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
        dateTitle.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${formattedDate}`;
    }

    function getTasks() {
        const saved = localStorage.getItem('cosmora_tasks_v1');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        localStorage.setItem('cosmora_tasks_v1', JSON.stringify(DEFAULT_TASKS));
        return DEFAULT_TASKS;
    }

    function saveTasks(list) {
        localStorage.setItem('cosmora_tasks_v1', JSON.stringify(list));
        render();
    }

    function render() {
        if (!listEl) return;
        const tasks = getTasks();
        listEl.innerHTML = '';

        tasks.forEach(t => {
            const li = document.createElement('li');
            li.className = 'task-item ' + (t.completed ? 'completed' : '');
            li.innerHTML = `<label class="task-checkbox-wrap">
                <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''}>
                <span class="task-text">${t.text}</span>
            </label>
            <button type="button" class="task-delete-btn" title="Delete Task">✕</button>`;

            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => {
                t.completed = checkbox.checked;
                saveTasks(tasks);
            });

            const delBtn = li.querySelector('.task-delete-btn');
            delBtn.addEventListener('click', () => {
                const newList = getTasks().filter(item => item.id !== t.id);
                saveTasks(newList);
            });

            listEl.appendChild(li);
        });
    }

    if (form && input) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (text) {
                const tasks = getTasks();
                tasks.push({ id: Date.now().toString(), text, completed: false });
                saveTasks(tasks);
                input.value = '';
            }
        });
    }

    render();
}
