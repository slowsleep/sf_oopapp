import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./styles/style.sass";
import * as render from "./services/render";
import * as listener from "./services/listener";
import { User } from "./models/User";
import { generateTestUser } from "./utils";
import { State } from "./state";
import { getFromStorage } from "./utils";

export const appState = new State();

generateTestUser(User);

let user = getFromStorage("user");

if (user.length !== 0) {
  appState.currentUser = user;

  let isAdmin = user.role == "admin" ? true : false;

  render.menu(isAdmin);
  render.navRight(true);
  render.footer();
  render.content(true);
  listener.logout();
  listener.addTaskBacklog();
  listener.addTaskFromTo("backlog", "ready", "in-progress");
  listener.addTaskFromTo("ready", "in-progress", "finished");
  listener.addTaskFromTo("in-progress", "finished");
} else {
  render.navRight(false);
  listener.loginForm();
}


