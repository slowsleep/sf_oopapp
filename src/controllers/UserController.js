import { getFromStorage } from "../utils";
import { User } from "../models/User";

export function getUsers() {
    let users = getFromStorage("users");
    return users.length ? users : false;
}

export function getUserById(id) {
    let users = getUsers();
    if (!users) return false;
    for (let user of users) {
      if (user.id == id) {
        let curUs = new User();
        curUs.id = user.id;
        curUs.login = user.login;
        curUs.password = user.password;
        curUs.role = user.role;
        return curUs;
      }
    }
    return false;
}

// function addUser() {

// }

export function isExists(login, password) {
    let users = getUsers();
    if (!users) return false;
    for (let user of users) {
      if (user.login == login && user.password == password)
        return user.id;
    }
    return false;
}
