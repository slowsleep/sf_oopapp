import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./styles/style.sass";
import * as render from "./services/render";
import * as listener from "./services/listener";
import { User } from "./models/User";
import { generateTestUser } from "./utils";
import { State } from "./state";
import { getFromStorage } from "./utils";
import { route } from "./services/router";

export const appState = new State();
generateTestUser(User);
let user = getFromStorage("user");

if (user.length !== 0) {
    appState.currentUser = user;
    let isAdmin = user.role == "admin" ? true : false;
    render.baseTemplate(appState, isAdmin);
    route(appState);
    listener.logout();
} else {
    render.navRight(false);
    listener.loginForm();
}
