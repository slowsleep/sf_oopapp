import { authUser } from "./auth";
import { appState } from "../app";
import { Task } from "../models/Task";
import * as TaskController from "../controllers/TaskController";
import { addTaskToList } from "./render";

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
        const taskBacklogList = document.querySelector("#app-tasks-list-backlog");
        const btnSubmitAddTaskBacklog = document.querySelector("#app-submit-add-task-backlog");
        const textArea = document.createElement("textarea");
        textArea.classList = "rounded";
        textArea.id = "app-textarea-add-backlog";
        taskBacklogList.appendChild(textArea);
        e.target.style.display = "none";

        if (btnSubmitAddTaskBacklog.style.display == "none") {
            btnSubmitAddTaskBacklog.style.display = "block";
        }

        btnSubmitAddTaskBacklog.addEventListener("click", function(e) {
            e.stopImmediatePropagation();
            e.target.style.display = "none";

            let textareaAddBacklog = document.querySelector("#app-textarea-add-backlog");

            if (textareaAddBacklog.value) {

                let taskEntity = new Task(textareaAddBacklog.value, appState.currentUser.id, "backlog");
                Task.save(taskEntity);

                let task = {
                    id: taskEntity.id,
                    title: textareaAddBacklog.value
                }

                taskBacklogList.removeChild(taskBacklogList.lastChild)
                addTaskToList(taskBacklogList, task);

                const btnAddTaskReady =  document.querySelector("#app-add-task-ready");

                if (btnAddTaskReady.getAttribute("disabled")) {
                    btnAddTaskReady.removeAttribute("disabled");
                }
            } else {
                taskBacklogList.removeChild(taskBacklogList.lastChild);
            }

            btnAddTaskBacklog.style.display = "block";
        });
    })
}


export function addTaskReady() {
    const btnAddTaskReady =  document.querySelector("#app-add-task-ready");

    btnAddTaskReady.addEventListener("click", function () {
        let user = appState.currentUser;
        let backlogTasks = TaskController.getUsersTasksByStatus(user.id, "backlog");
        let selectReady = document.querySelector("#app-select-ready");
        selectReady.innerHTML = "";
        let defaultOption = document.createElement("option");
        defaultOption.textContent = "Выберите задачу";
        selectReady.appendChild(defaultOption);

        if (backlogTasks.length) {
            let taskReadyList = document.querySelector("#app-tasks-list-ready");

            for (let task of backlogTasks) {
                let option = document.createElement("option");
                option.textContent = task.title;
                option.dataset.id = task.id;
                selectReady.appendChild(option);
            }

            if (selectReady.style.display == "none") {
                selectReady.style.display = "block";
            }

            selectReady.addEventListener("change", function(e) {
                e.stopImmediatePropagation();
                let selectedTask = {
                    id: e.target.options[e.target.selectedIndex].dataset.id,
                    title: selectReady.value
                }
                let taskBacklogList = document.querySelector("#app-tasks-list-backlog");
                let oldTaskFromBacklog = document.querySelector(`[data-id="${selectedTask.id}"]`);
                taskBacklogList.removeChild(oldTaskFromBacklog);
                TaskController.setStatus(selectedTask.id, "ready");
                addTaskToList(taskReadyList, selectedTask);
                e.target.style.display = "none";
            })
        }
    });

}
