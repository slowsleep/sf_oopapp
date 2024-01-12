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

        let TasksListBacklog = document.querySelector(
            "#app-tasks-list-backlog"
        );
        let user = appState.currentUser;

        if (user) {
            let usersTasks = TaskController.getUsersTasks(user.id);
            if (usersTasks) {
                for (let task of usersTasks) {
                    if (task.status == "backlog") {
                        let taskToAppend = document.createElement("li");
                        taskToAppend.textContent = task.title;
                        TasksListBacklog.appendChild(taskToAppend);
                    }
                    // TODO: and then append another tasks by status
                }
            }
        }
    } else {
        alert("Доступ запрещен!");
        window.location.reload();
    }
}

export function navRight(isAuth) {
    let fieldHTMLContent = isAuth ? formLoginned : formUnloginned;
    document.querySelector("#app-nav-right").innerHTML = fieldHTMLContent;
}

export function footer() {
    document.querySelector("#app-footer-counters").innerHTML = tasksCounters;
}
