import "bootstrap/dist/css/bootstrap.min.css";
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

if (localStorage.getItem("user")) {
  appState.currentUser = user;
  render.content(true);
  render.navRight(true);
  render.footer();
  listener.logoutForm();
  listener.addTaskBacklog();
} else {
  render.navRight(false);
  listener.loginForm();
}


