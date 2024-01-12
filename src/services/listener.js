import { authUser } from "./auth";
import { appState } from "../app";
import { Task } from "../models/Task";

export function loginForm() {
    const loginForm = document.querySelector("#app-login-form");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const login = formData.get("login");
        const password = formData.get("password");
        const isAuth = authUser(login, password);

        if (isAuth) {
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: appState.currentUser.id,
                    role: appState.currentUser.role,
                })
            );

        }

        window.location.reload();
    });
}

export function logoutForm() {
    const logoutForm = document.querySelector("#app-logout-form");

    logoutForm.addEventListener("submit", function () {
        localStorage.removeItem("user");
        window.location.reload();
    });
}

export function addTaskBacklog() {
    const btnAddTaskBacklog = document.querySelector("#app-add-task-backlog");

    btnAddTaskBacklog.addEventListener("click", function(e) {
        const listTasksBacklog = document.querySelector("#app-tasks-list-backlog");
        const btnSubmitAddTaskBacklog = document.querySelector("#app-submit-add-task-backlog");
        const textArea = document.createElement("textarea");

        textArea.classList = "rounded";
        textArea.id = "app-textarea-add-backlog";
        listTasksBacklog.appendChild(textArea);
        e.target.style.display = "none";

        if (btnSubmitAddTaskBacklog.style.display == "none") {
            btnSubmitAddTaskBacklog.style.display = "block";
        }

        btnSubmitAddTaskBacklog.addEventListener("click", function(e) {
            e.stopImmediatePropagation();
            e.target.style.display = "none";
            const newTask = document.createElement("li");
            newTask.style.classList = "rounded bg-light";
            newTask.draggable = true;

            let textareaAddBacklog = document.querySelector("#app-textarea-add-backlog");

            if (textareaAddBacklog.value) {
                let taskEntity = new Task(textareaAddBacklog.value, appState.currentUser.id, "backlog");
                Task.save(taskEntity);
                newTask.textContent = textareaAddBacklog.value;
                listTasksBacklog.removeChild(listTasksBacklog.lastChild)
                listTasksBacklog.appendChild(newTask);

                const btnAddTaskReady =  document.querySelector("#app-add-task-ready");

                if (btnAddTaskReady.getAttribute("disabled")) {
                    btnAddTaskReady.removeAttribute("disabled");
                }
            } else {
                listTasksBacklog.removeChild(listTasksBacklog.lastChild);
            }

            btnAddTaskBacklog.style.display = "block";
        });
    })
}
