import taskFieldTemplate from "../templates/taskField.html";
import formLoginned from "../templates/nav/right/formLoginned.html";
import formUnloginned from "../templates/nav/right/formUnloginned.html";
import tasksCounters from "../templates/footer/tasksCounters.html";
import { appState } from "../app";
import * as TaskController from "../controllers/TaskController";

export function content(isAuth) {
    if (isAuth) {
        document.querySelector("#content").innerHTML = taskFieldTemplate;

        document.querySelector("#app-submit-add-task-backlog").style.display = "none";
        document.querySelector("#app-submit-add-task-ready").style.display = "none";
        document.querySelector("#app-add-task-ready").setAttribute("disabled", true);

        document.querySelector("#app-submit-add-task-in-progress").style.display = "none";
        document.querySelector("#app-add-task-in-progress").setAttribute("disabled", true);

        document.querySelector("#app-submit-add-task-finished").style.display = "none";
        document.querySelector("#app-add-task-finished").setAttribute("disabled", true);

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
