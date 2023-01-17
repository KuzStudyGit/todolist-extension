import { v4 } from "uuid";

const iconUrl = new URL("icons/delete.svg", import.meta.url);

class Todo {
    constructor({ todos = [], inputSelector, formSelector, listSelector }) {
        this.todos = todos;
        this.input = document.querySelector(inputSelector);
        this.form = document.querySelector(formSelector);
        this.list = document.querySelector(listSelector);
    }

    setTodos(todos) {
        this.todos = todos;
    }

    addTodo(todo) {
        this.setTodos([todo, ...this.todos]);
    }

    deleteTodo(id) {
        this.setTodos(this.todos.filter((todo) => todo.id !== id));
    }

    toggleTodo(id) {
        this.setTodos(
            this.todos.map((todo) =>
                todo.id === id ? { ...todo, checked: !todo.checked } : todo
            )
        );
    }

    async init() {
        this.form.addEventListener("submit", (event) =>
            this.handleSubmit(event)
        );
        this.list.addEventListener("click", (event) =>
            this.handleToggle(event)
        );
        this.list.addEventListener("click", (event) =>
            this.handleDelete(event)
        );
    }

    saveTodosToStorage() {
        chrome.storage.local.set({ todos: JSON.stringify(this.todos) });
    }

    async getTodosFromStorage() {
        try {
            const data = await chrome.storage.local.get(["todos"]);
            const todos = JSON.parse(data.todos);
            this.todos = todos;
            this.updateUI();
        } catch (error) {
            this.todos = [];
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const text = event.currentTarget.elements.todo.value.trim();

        const newTodo = { id: v4(), text, checked: false };

        this.addTodo(newTodo);

        this.list.insertAdjacentHTML(
            "afterbegin",
            this.createTodoMarkup(newTodo)
        );
    }

    handleToggle(event) {
        if (event.target.type !== "checkbox") return;

        const id = event.target.id;

        this.toggleTodo(id);
    }

    handleDelete(event) {
        if (!event.target.classList.contains("delete-image")) return;

        const todo = event.target.parentNode.parentNode;

        this.deleteTodo(todo.children[0].id);

        todo.remove();
    }

    updateUI() {
        this.list.innerHTML = this.todos.map(this.createTodoMarkup).join("");
    }

    createTodoMarkup({ id, text, checked }) {
        return ` <li><input type="checkbox" name="checkbox" id="${id}" ${
            checked ? "checked" : ""
        }/>
          <label for="${id}">
            <span class="check"></span> ${text}
          </label>
          <button type="button" class="delete-button">
            <img src="${iconUrl}" alt="delete icon" class="delete-image"/>
          </button></li>`;
    }
}

const todos = [
    { id: "1", text: "1", checked: false },
    { id: "2", text: "2", checked: true },
    { id: "3", text: "3", checked: false },
    { id: "4", text: "4", checked: true },
    { id: "5", text: "5", checked: false },
    { id: "6", text: "6", checked: false },
];

const todoList = new Todo({
    todos,
    inputSelector: ".inputTodo",
    formSelector: ".add",
    listSelector: ".todos",
});

todoList.init();
todoList.getTodosFromStorage();
