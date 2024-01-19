import taskFieldTemplate from "../templates/taskField.html";
import profileTemplate from "../templates/pages/profile.html";
import adminUsersTemplate from "../templates/pages/admin/users.html";
import formLoginned from "../templates/nav/right/formLoginned.html";
import formUnloginned from "../templates/nav/right/formUnloginned.html";
import adminMenuTemplate from "../templates/nav/menu/adminMenu.html";
import userMenuTemplate from "../templates/nav/menu/userMenu.html";
import tasksCounters from "../templates/footer/tasksCounters.html";
import { appState } from "../app";
import * as TaskController from "../controllers/TaskController";
import * as UserController from "../controllers/UserController";
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

    // Adding users task to page in blocks by status
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
            finishedTasks.map((finishedTask) => {
                addTaskToList(tasksListFinished, finishedTask);
            });
        }

        // Adding count task in footer
        renderCount(user, "backlog");
        renderCount(user, "finished");
    }

    listener.addTaskBacklog();
    listener.addTaskFromTo("backlog", "ready", "in-progress");
    listener.addTaskFromTo("ready", "in-progress", "finished");
    listener.addTaskFromTo("in-progress", "finished");
}

// Adding count task in footer
export function renderCount(user, status) {
    let tasksByStatus = TaskController.getUsersTasksByStatus(user.id, status);
    let countTask;
    if (status == "backlog") {
        countTask = document.querySelector(`#count-active`);
    } else {
        countTask = document.querySelector(`#count-${status}`);
    }
    countTask.textContent = tasksByStatus.length ? tasksByStatus.length : 0;
}

export function addTaskToList(taskList, task) {
    let li = document.createElement("li");
    li.dataset.id = task.id;
    li.textContent = task.title;
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
        let user = UserController.getUserById(appState.currentUser.id);
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

export function profile(appState) {
    document.querySelector("#content").innerHTML = profileTemplate;
    let user = UserController.getUserById(appState.currentUser.id)
    document.querySelector("#app-profile-login").textContent = user.login;
}


const addUserToList = (user, listTemplate) => {
    let itemListAdmin = document.createElement("li");
    itemListAdmin.dataset.id = user.id;
    itemListAdmin.classList = "d-flex";

    let loginItemListAdmin = document.createElement("p");
    loginItemListAdmin.classList = "me-2";
    loginItemListAdmin.textContent = user.login;

    itemListAdmin.appendChild(loginItemListAdmin);

    if (user.id == appState.currentUser.id) {
        let youTextItemListAdmin = document.createElement("p");
        youTextItemListAdmin.textContent = "(you)";
        itemListAdmin.appendChild(youTextItemListAdmin);
    } else {
        let deleteBtnItemListAdmin = document.createElement("button");
        deleteBtnItemListAdmin.classList = "app-btn-user-delete btn btn-danger";
        deleteBtnItemListAdmin.textContent = "delete";
        itemListAdmin.appendChild(deleteBtnItemListAdmin);
    }

    listTemplate.appendChild(itemListAdmin);
}

export function adminUsers(appState) {
    document.querySelector("#content").innerHTML = adminUsersTemplate;

    let adminList = document.querySelector("#app-admin-list");
    let userList = document.querySelector("#app-user-list");

    let users = UserController.getUsers();

    for (let user of users) {
        if (user.role == "admin") {
            addUserToList(user, adminList);
        } else if (user.role == "user") {
            addUserToList(user, userList);
        }
    }

    listener.btnAddUser("user");
    listener.btnAddUser("admin");
    listener.btnUserDelete();
}