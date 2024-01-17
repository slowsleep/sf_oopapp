import taskFieldTemplate from "../templates/taskField.html";
import formLoginned from "../templates/nav/right/formLoginned.html";
import formUnloginned from "../templates/nav/right/formUnloginned.html";
import adminMenuTemplate from "../templates/nav/menu/adminMenu.html";
import userMenuTemplate from "../templates/nav/menu/userMenu.html";
import tasksCounters from "../templates/footer/tasksCounters.html";
import { appState } from "../app";
import * as TaskController from "../controllers/TaskController";
import { getUserById } from "../controllers/UserController";
import * as listener from "./listener";


export function baseTemplate(appState, isAdmin) {
    navRight(true);
    menu(isAdmin);
    footer();
}

export function content(appState) {
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

    listener.addTaskBacklog();
    listener.addTaskFromTo("backlog", "ready", "in-progress");
    listener.addTaskFromTo("ready", "in-progress", "finished");
    listener.addTaskFromTo("in-progress", "finished");
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

export function menu(isAdmin=false) {
    document.querySelector("#app-user-menu").innerHTML = userMenuTemplate;
    if (isAdmin) {
        document.querySelector("#app-admin-menu").innerHTML = adminMenuTemplate;
    }
}

export function navRight(isAuth) {
    let fieldHTMLContent = isAuth ? formLoginned : formUnloginned;
    document.querySelector("#app-nav-right").innerHTML = fieldHTMLContent;
    if (appState.currentUser) {
        let user = getUserById(appState.currentUser.id);
        if (user) {
            document.querySelector("#app-menu-login").innerHTML = user.login;
            let userAvatar = document.querySelector("#app-user-avatar");
            if (user.avatar) {
                userAvatar = user.avatar;
            }
        }
    }
}

export function footer() {
    document.querySelector("#app-footer-counters").innerHTML = tasksCounters;
}

export function notFound() {
    document.querySelector("#content").innerHTML = "404 <br> Page not Found";
}
