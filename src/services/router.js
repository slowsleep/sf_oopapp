import * as render from "./render";

export function route(appState) {
    let curPath = window.location.pathname;
    let href = window.location.href;
    let hrefSplit = href.split("/");
    // 3 - for localhost
    // curPath = hrefSplit[3];
    // 4 - for github
    curPath = hrefSplit[4];

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
