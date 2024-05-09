var splashIsOpened = true;

var openSplash = delayClose => {
    document.body.classList.add("splash-visible");
    const splashScreen = document.getElementById("splash-screen");
    splashScreen?.classList.add("visible");
    splashScreen?.classList.remove("fade");

    if (delayClose && !isNaN(parseInt(delayClose))) {
        setTimeout(() => {
            closeSplash();
        }, delayClose);
    }

    splashIsOpened = true;
}

var closeSplash = delayClose => {
    const splashScreen = document.getElementById("splash-screen");
    document.body.classList.remove("splash-visible");

    if (delayClose && !isNaN(parseInt(delayClose))) {
        setTimeout(() => {
            splashScreen?.classList.remove("visible");
            splashScreen?.classList.add("fade");
        }, delayClose);
    } else {
        splashScreen?.classList.remove("visible");
        splashScreen?.classList.add("fade");
    }

    splashIsOpened = false;
}

document.onreadystatechange = function () {
    const exceptionsPathNames = ['/login', '/signup', '/play-game/', '/play-demo/'];

    if (
        document.readyState === "complete"
        && !exceptionsPathNames.includes(window.location.pathname)//текущий путь не является одним из запрещенных
        && !exceptionsPathNames.find(partOfTurl => window.location.pathname.includes(partOfTurl))//в текущем пути нет частей из списка запрещенных
        && window.location.pathname.indexOf("/games/") === -1
    ) {

        closeSplash();
    }
}