import * as render from "./render";

export function route(appState) {
    let curPath = window.location.pathname;

    switch (curPath) {
        case "/":
            return render.content(appState);
        default:
            return render.notFound();
    }

}
