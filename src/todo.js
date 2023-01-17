import { v4 } from "uuid";

/**
 * Ссылка на иконку delete
 *
 * @const {URL}
 */
const iconUrl = new URL("icons/delete.svg", import.meta.url);

/**
 * Планировщик задач
 *
 * Класс предоставляет функционал
 * для работы с задами пользователя
 *
 * @class
 * @author      Kseniia Kuzina
 * @version     1.0.0
 * @copyright GNU Public License
 * @todo          Реализовать все методы
 */

class Todo {
    /**
     * Конструктор класса
     *
     * @param {array} todos Массив задач
     * @param {string} inputSelector Селектор элемента для ввода новой задачи
     * @param {string} formSelector Селектор формы, содержащей inputSelector
     * @param {string} listSelector Селектор списка, хранящего задачи
     *
     */
    constructor({ todos = [], inputSelector, formSelector, listSelector }) {
        this.todos = todos;
        this.input = document.querySelector(inputSelector);
        this.form = document.querySelector(formSelector);
        this.list = document.querySelector(listSelector);
    }

    /**
     * Сеттер задач
     *
     * @param {array} todos Массив задач
     *
     */
    setTodos(todos) {
        this.todos = todos;
    }

    /**
     * Добавление новой задачи
     *
     * @param {object} todo Объект задачи
     *
     */
    addTodo(todo) {
        this.setTodos([todo, ...this.todos]);
    }

    /**
     * Удаление задачи
     *
     * @param {string} id ID задачи
     *
     */
    deleteTodo(id) {
        this.setTodos(this.todos.filter((todo) => todo.id !== id));
    }

    /**
     * Переключение выполнения задачи
     *
     * @param {string} id ID задачи
     *
     */
    toggleTodo(id) {
        this.setTodos(
            this.todos.map((todo) =>
                todo.id === id ? { ...todo, checked: !todo.checked } : todo
            )
        );
    }

    /**
     * Добавление слушателей на элементы
     */
    init() {
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

    /**
     * Сохранение массива задач в хранилище
     */
    saveTodosToStorage() {
        chrome.storage.local.set({ todos: JSON.stringify(this.todos) });
    }

    /**
     * Получение массива задач из хранилища
     *
     * @async
     */
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

    /**
     * Обработчик события Submit
     *
     * @param {object} event Объект события
     *
     */
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

    /**
     * Обработчик клика на checkbox
     *
     * @param {object} event Объект события
     *
     */
    handleToggle(event) {
        if (event.target.type !== "checkbox") return;

        const id = event.target.id;

        this.toggleTodo(id);
    }

    /**
     * Обработчик клика на удаление
     *
     * @param {object} event Объект события
     *
     */
    handleDelete(event) {
        if (!event.target.classList.contains("delete-image")) return;

        const todo = event.target.parentNode.parentNode;

        this.deleteTodo(todo.children[0].id);

        todo.remove();
    }

    /**
     * Перерисовка пользовательского интерфейса
     */
    updateUI() {
        this.list.innerHTML = this.todos.map(this.createTodoMarkup).join("");
    }

    /**
     * Создание html шаблона для одной задачи
     *
     * @param {string} id ID задачи
     * @param {string} text Текст задачи
     * @param {boolean} checked Состояние задачи
     *
     * @return {string} Строка шаблона
     */
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

/**
 * Массив изначальных задач
 *
 * @const {array}
 */
const todos = [
    { id: "1", text: "1", checked: false },
    { id: "2", text: "2", checked: true },
    { id: "3", text: "3", checked: false },
    { id: "4", text: "4", checked: true },
    { id: "5", text: "5", checked: false },
    { id: "6", text: "6", checked: false },
];

/**
 * Объект класса {@link Todo}
 *
 * @const {Todo}
 */
const todoList = new Todo({
    todos,
    inputSelector: ".inputTodo",
    formSelector: ".add",
    listSelector: ".todos",
});

todoList.init();
todoList.getTodosFromStorage();
