import taskFieldTemplate from "../templates/taskField.html";
import formLoginned from "../templates/nav/right/formLoginned.html";
import formUnloginned from "../templates/nav/right/formUnloginned.html";
import tasksCounters from "../templates/footer/tasksCounters.html";
import { appState } from "../app";
import * as TaskController from "../controllers/TaskController";

export function content(isAuth) {
    if (isAuth) {
        document.querySelector("#content").innerHTML = taskFieldTemplate;

        ["backlog", "ready", "in-progress", "finished"].map((status) => {
            document.querySelector(`#app-submit-add-task-${status}`).style.display = "none";
        });

        ["ready", "in-progress", "finished"].map((status) => {
            document.querySelector(`#app-add-task-${status}`).setAttribute("disabled", true);
        });

        document.querySelector("#app-select-ready").style.display = "none";
        document.querySelector("#app-select-in-progress").style.display = "none";
        document.querySelector("#app-select-finished").style.display = "none";

        let tasksListBacklog = document.querySelector("#app-tasks-list-backlog");
        let tasksListReady = document.querySelector("#app-tasks-list-ready");
        let tasksListInProgress = document.querySelector("#app-tasks-list-in-progress");
        let tasksListFinished = document.querySelector("#app-tasks-list-finished");

        let user = appState.currentUser;

        if (user) {
            let backlogTasks = TaskController.getUsersTasksByStatus(user.id, "backlog");
            let readyTasks = TaskController.getUsersTasksByStatus(user.id, "ready");
            let inProgressTasks = TaskController.getUsersTasksByStatus(user.id, "in-progress");
            let finishedTasks = TaskController.getUsersTasksByStatus(user.id, "finished");

            if (backlogTasks) {
                document.querySelector("#app-add-task-ready").removeAttribute("disabled");
                backlogTasks.map((taskBacklog) => {
                    addTaskToList(tasksListBacklog, taskBacklog);
                });
            }
            if (readyTasks) {
                document.querySelector("#app-add-task-in-progress").removeAttribute("disabled");
                readyTasks.map((readyTask) => {
                    addTaskToList(tasksListReady, readyTask);
                });
            }
            if (inProgressTasks) {
                document.querySelector("#app-add-task-finished").removeAttribute("disabled");
                inProgressTasks.map((inProgressTask) => {
                    addTaskToList(tasksListInProgress, inProgressTask);
                });
            }
            if (finishedTasks) {
                // document.querySelector("#app-add-task-finished").removeAttribute("disabled");
                finishedTasks.map((finishedTask) => {
                    addTaskToList(tasksListFinished, finishedTask);
                });
            }

        }
    } else {
        alert("Доступ запрещен!");
        window.location.reload();
    }
}

export function addTaskToList(taskList, task) {
    let li = document.createElement("li");
    li.dataset.id = task.id;
    let taskToAppend = document.createElement("div");
    taskToAppend.classList = "rounded bg-light p-1 m-2 bg-opacity-50";
    taskToAppend.textContent = task.title;
    li.appendChild(taskToAppend);
    taskList.appendChild(li);
}

export function navRight(isAuth) {
    let fieldHTMLContent = isAuth ? formLoginned : formUnloginned;
    document.querySelector("#app-nav-right").innerHTML = fieldHTMLContent;
}

export function footer() {
    document.querySelector("#app-footer-counters").innerHTML = tasksCounters;
}

