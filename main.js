import './assets/styles/style.scss';

const themeToggleBtn = document.querySelector('.theme-toggle');
const form = document.querySelector('#submit-form');
const input = document.querySelector('#submit-input');
const clearCompleted = document.querySelector('.clear-completed');
const filterList = document.querySelector('.filter-list');
const mobileFilterContainer = document.querySelector('.mobile-filters');
const todoList = document.querySelector('.todo-list');
const itemsLeft = document.querySelector('.items-left');

const generateRandomString = () => {
	return Math.floor(Math.random() * Date.now()).toString(36);
};

const getNewTodoHTMLString = (todo) => {
	return `
					<li class="todo-item row" data-completed='${todo.isCompleted}' data-todo-id="${
		todo.id
	}">
						<label
							for="${todo.id}"
							class="todo-item__icon todo-item__icon--circle row__no-shrink todo-item__check"
						>
							<input type="checkbox" name="checker" id="${todo.id}" ${
		todo.isCompleted ? 'checked' : ''
	}/>
						</label>
						<p class="row__text todo-item__text row__grow">
							${todo.text}
						</p>
						<button
							class="todo-item__icon todo-item__clear row__no-shrink"
						></button>
					</li>
	`;
};

const updateTodosInStorage = (todos) => {
	localStorage.setItem('todos', JSON.stringify(todos));
};

const getTodosFromStorage = () => {
	return JSON.parse(localStorage.getItem('todos')) || [];
};

const renderTodos = (todos) => {
	console.log(todos);
	let todoItems = todos.map((todo) => getNewTodoHTMLString(todo));
	todoList.innerHTML = todoItems.join('');
};

const updateItemsLeft = () => {
	let count = getTodosFromStorage().filter(
		(todo) => todo.isCompleted === false
	).length;
	itemsLeft.textContent = `${count} items left`;
};

const renderUI = (todos) => {
	updateItemsLeft();
	renderTodos(todos);
};

const moveFilterList = () => {
	if (window.innerWidth <= 768) {
		mobileFilterContainer.append(filterList);
	} else {
		clearCompleted.before(filterList);
	}
};

window.addEventListener('resize', () => {
	moveFilterList();
});

themeToggleBtn.addEventListener('click', () => {
	document.documentElement.setAttribute(
		'data-theme',
		document.documentElement.getAttribute('data-theme') === 'dark'
			? 'light'
			: 'dark'
	);

	localStorage.setItem(
		'theme',
		document.documentElement.getAttribute('data-theme')
	);
});

form.addEventListener('submit', (e) => {
	e.preventDefault();
	if (!input.value) return;
	const newTodo = {
		id: generateRandomString(),
		isCompleted: false,
		text: input.value,
	};
	let element = getNewTodoHTMLString(newTodo);
	todoList.insertAdjacentHTML('afterbegin', element);
	input.value = '';
	updateTodosInStorage([newTodo, ...getTodosFromStorage()]);
	renderUI(getTodosFromStorage());
});

todoList.addEventListener('click', (e) => {
	if (e.target.classList.contains('todo-item__check')) {
		let itemID = e.target.closest('.todo-item').dataset.todoId;
		let todos = getTodosFromStorage();
		let updatedTodos = todos.map((todo) =>
			todo.id === itemID
				? { id: todo.id, isCompleted: !todo.isCompleted, text: todo.text }
				: todo
		);
		updateTodosInStorage(updatedTodos);
		renderUI(updatedTodos);
		return;
	}

	if (e.target.classList.contains('todo-item__clear')) {
		let itemID = e.target.closest('.todo-item').dataset.todoId;
		let todos = getTodosFromStorage();
		let updatedTodos = todos.filter((todo) => todo.id !== itemID);
		updateTodosInStorage(updatedTodos);
		renderUI(updatedTodos);
		return;
	}
});

clearCompleted.addEventListener('click', (e) => {
	let todos = getTodosFromStorage();
	let updatedTodos = todos.filter((todo) => todo.isCompleted === false);
	updateTodosInStorage(updatedTodos);
	renderUI(updatedTodos);
});

filterList.addEventListener('click', (e) => {
	// console.log(e.target.getAttribute('id'), e.target.nodeName == 'INPUT');
	if (
		e.target.getAttribute('id') === 'filter-all' &&
		e.target.nodeName == 'INPUT'
	) {
		let todos = getTodosFromStorage();
		renderUI(todos);
		return;
	}

	if (
		e.target.getAttribute('id') === 'filter-active' &&
		e.target.nodeName == 'INPUT'
	) {
		let todos = getTodosFromStorage();
		let filteredTodos = todos.filter((todo) => todo.isCompleted === false);
		renderUI(filteredTodos);
		return;
	}

	if (
		e.target.getAttribute('id') === 'filter-completed' &&
		e.target.nodeName == 'INPUT'
	) {
		let todos = getTodosFromStorage();
		let filteredTodos = todos.filter((todo) => todo.isCompleted === true);
		renderUI(filteredTodos);
		return;
	}
});

renderUI(getTodosFromStorage());
document.documentElement.setAttribute(
	'data-theme',
	localStorage.getItem('theme') || 'dark'
);
