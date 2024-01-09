import * as render from "./render";
import { authUser } from "./auth";
import { appState } from "../app";

export function loginForm() {
    const loginForm = document.querySelector("#app-login-form");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const login = formData.get("login");
        const password = formData.get("password");
        const isAuth = authUser(login, password);

        if (isAuth) {
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: appState.currentUser.id,
                    role: appState.currentUser.role,
                })
            );
            render.content(isAuth);
            render.navRight(isAuth);
            logoutForm();
        } else {
            render.content(isAuth);
            render.navRight(isAuth);
        }
    });
}

export function logoutForm() {
    const logoutForm = document.querySelector("#app-logout-form");

    logoutForm.addEventListener("submit", function () {
        localStorage.removeItem("user");
    });
}
