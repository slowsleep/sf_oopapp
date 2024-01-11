import { getFromStorage } from "../utils";

export function getTaskById(id) {
    try {
        const tasks = getFromStorage("tasks");
        for (let task of tasks) {
            if (task.id == id) {
                return task;
            }
        }
        return false;
    } catch (e) {
        throw new Error(e);
    }
}

export function getUsersTasks(userId) {
    let tasks = getFromStorage("tasks");
    let usersTask = [];

    for (let task of tasks) {
        if (task.userId == userId) {
            usersTask.push(task);
        }
    }

    return usersTask.length ? usersTask : false;
}
