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
}
