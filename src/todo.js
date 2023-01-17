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
}
