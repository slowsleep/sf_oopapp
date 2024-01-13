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
        textArea.classList = "form-control rounded";
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


export function addTaskFromTo(oldStatus, newStatus, nextStatus=false) {
    const btnAddTaskNewStatus =  document.querySelector(`#app-add-task-${newStatus}`);

    btnAddTaskNewStatus.addEventListener("click", function(e) {
        e.stopImmediatePropagation();
        let user = appState.currentUser;
        let tasksOldStatus = TaskController.getUsersTasksByStatus(user.id, oldStatus);
        let selectNewStatus = document.querySelector(`#app-select-${newStatus}`);
        selectNewStatus.innerHTML = "";
        let defaultOption = document.createElement("option");
        defaultOption.textContent = "Выберите задачу";
        selectNewStatus.appendChild(defaultOption);

        if (tasksOldStatus.length) {
            let taskListNewStatus = document.querySelector(`#app-tasks-list-${newStatus}`);

            for (let task of tasksOldStatus) {
                let option = document.createElement("option");
                option.textContent = task.title;
                option.dataset.id = task.id;
                selectNewStatus.appendChild(option);
            }

            if (selectNewStatus.style.display == "none") {
                selectNewStatus.style.display = "block";
            }

            selectNewStatus.addEventListener("change", function(e) {
                e.stopImmediatePropagation();
                let selectedTask = {
                    id: e.target.options[e.target.selectedIndex].dataset.id,
                    title: selectNewStatus.value
                }
                let taskListOldStatus = document.querySelector(`#app-tasks-list-${oldStatus}`);
                let oldTaskFromOldStatus = document.querySelector(`li[data-id="${selectedTask.id}"]`);
                taskListOldStatus.removeChild(oldTaskFromOldStatus);
                TaskController.setStatus(selectedTask.id, newStatus);
                addTaskToList(taskListNewStatus, selectedTask);
                e.target.style.display = "none";

                if (!taskListOldStatus.childNodes.length) {
                    console.log(`from ${oldStatus} to ${newStatus} в предыдущем блоке пусто`)
                    btnAddTaskNewStatus.setAttribute("disabled", true);
                }

                if (nextStatus) {
                    console.log(nextStatus)
                    if (document.querySelector(`#app-add-task-${nextStatus}`).getAttribute("disabled")) {
                        document.querySelector(`#app-add-task-${nextStatus}`).removeAttribute("disabled");
                    }
                }
            })
        }
    })
}
