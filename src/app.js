import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.sass";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import formLoginned from "./templates/nav/right/formLoginned.html";
import formUnloginned from "./templates/nav/right/formUnloginned.html";
import { User } from "./models/User";
import { generateTestUser } from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";

export const appState = new State();

generateTestUser(User);

const navRight = document.querySelector("#app-nav-right");

if (localStorage.getItem("user")) {
  navRight.innerHTML = formLoginned;
  renderContent(true);
  renderNavRight(true);
  listenLogoutForm();
} else {
  navRight.innerHTML = formUnloginned;
  listenLoginForm();
}


function listenLoginForm() {
  const loginForm = document.querySelector("#app-login-form");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const login = formData.get("login");
    const password = formData.get("password");
    const isAuth = authUser(login, password);

    if (isAuth) {
      localStorage.setItem("user", JSON.stringify(
        {
          id: appState.currentUser.id,
          role: appState.currentUser.role
        })
      );
    }
    renderContent(isAuth);
    renderNavRight(isAuth);
    listenLogoutForm();
  });
}

function listenLogoutForm() {
  const logoutForm = document.querySelector("#app-logout-form");
  console.log("logout")

  logoutForm.addEventListener("submit", function() {
    localStorage.removeItem("user");
  });
}

function renderContent(isAuth) {
  let fieldHTMLContent = isAuth ? taskFieldTemplate : noAccessTemplate;
  document.querySelector("#content").innerHTML = fieldHTMLContent;
}

function renderNavRight(isAuth) {
  let fieldHTMLContent = isAuth ? formLoginned : formUnloginned;
  document.querySelector("#app-nav-right").innerHTML = fieldHTMLContent;
}
