import * as render from "./render";
import { authUser } from "./auth";
import { appState } from "../app";

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
            render.content(isAuth);
            render.navRight(isAuth);
            logoutForm();
        } else {
            render.content(isAuth);
            render.navRight(isAuth);
        }
    });
}

export function logoutForm() {
    const logoutForm = document.querySelector("#app-logout-form");

    logoutForm.addEventListener("submit", function () {
        localStorage.removeItem("user");
    });
}

export function addTaskBacklog() {
    const btnAddTaskBacklog = document.querySelector("#app-add-task-backlog");

    btnAddTaskBacklog.addEventListener("click", function(e) {
        const listTasksBacklog = document.querySelector("#app-tasks-list-backlog");
        const btnSubmitAddTaskBacklog = document.querySelector("#app-submit-add-task-backlog");
        const textArea = document.createElement("textarea");
        textArea.classList = "rounded";
        textArea.textContent = "";
        listTasksBacklog.appendChild(textArea);
        e.target.style.display = "none";

        if (btnSubmitAddTaskBacklog.style.display == "none") {
            btnSubmitAddTaskBacklog.style.display = "block";
        }

        btnSubmitAddTaskBacklog.addEventListener("click", function(e) {
            e.target.style.display = "none";
            const newTask = document.createElement("li");
            newTask.style.classList = "rounded bg-light";
            newTask.draggable = true;

            if (textArea.value) {
                newTask.textContent = textArea.value;
                listTasksBacklog.removeChild(listTasksBacklog.lastChild)
                listTasksBacklog.appendChild(newTask);
            } else {
                listTasksBacklog.removeChild(listTasksBacklog.lastChild);
            }

            btnAddTaskBacklog.style.display = "block";
        });
    })
}
