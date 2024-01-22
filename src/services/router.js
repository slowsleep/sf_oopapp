import * as render from "./render";

export function route(appState) {
    let curPath = window.location.pathname;

    switch (curPath) {
        case "/":
            return render.content(appState);
        case "/profile":
            return render.profile(appState);
        case "/users":
            if (appState.currentUser.role == "admin") {
                return render.adminUsers(appState);
            }
        default:
            return render.notFound();
    }
}
