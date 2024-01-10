import taskFieldTemplate from "../templates/taskField.html";
import formLoginned from "../templates/nav/right/formLoginned.html";
import formUnloginned from "../templates/nav/right/formUnloginned.html";
import tasksCounters from "../templates/footer/tasksCounters.html";


export function content(isAuth) {
    if (isAuth) {
      document.querySelector("#content").innerHTML = taskFieldTemplate;
    } else {
      alert("Доступ запрещен!");
      window.location.reload();
    }
  }

export function navRight(isAuth) {
    let fieldHTMLContent = isAuth ? formLoginned : formUnloginned;
    document.querySelector("#app-nav-right").innerHTML = fieldHTMLContent;
}

export function footer() {
    document.querySelector("#app-footer-counters").innerHTML = tasksCounters;
}
