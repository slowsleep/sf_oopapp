import * as render from "./render";

export function route(appState) {
    let curPath;
    let path = window.location.pathname;
    let arrPath = path.split("/");

    if (arrPath.length == 2) {
        curPath = arrPath[1]
    } else if (arrPath.length == 3) {
        curPath = arrPath[2]
    }

    switch (curPath) {
        case "":
            return render.content(appState);
        case "profile":
            return render.profile(appState);
        case "users":
            if (appState.currentUser.role == "admin") {
                return render.adminUsers(appState);
            }
        default:
            return render.notFound();
    }

}
