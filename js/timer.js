class Timer {
    constructor () {
        const element = this.element = document.createElement('div');

        element.classList.add('timer__wrap');

        element.innerHTML =
            '<div id="stopwatch">\n' +
            '<span>Затраченое время</span>' +
            '<div id="timeDisplay">00:00:00</div>\n' +
            '<div class="button__wrap">\n' +
            '<input type="button" value="Завершить" id="resetButton" disabled/>\n' +
            '<input type="button" value="Начать" id="startButton" disabled/>\n' +
            '</div>\n' +
            '</div>';

        const stopWatch = {
            timeDisplay : null,
            resetButton : null,
            startButton : null,
            timer : null,
            now : 0,

            init : function () {
                stopWatch.timeDisplay = element.querySelector("#timeDisplay");
                stopWatch.resetButton = element.querySelector("#resetButton");
                stopWatch.startButton = element.querySelector("#startButton");

                stopWatch.resetButton.addEventListener("click", stopWatch.complete);
                stopWatch.resetButton.disabled = false;
                stopWatch.startButton.addEventListener("click", stopWatch.start);
                stopWatch.startButton.disabled = false;
            },

            tick : function () {
                stopWatch.now++;
                let remain = stopWatch.now;
                let hours = Math.floor(remain / 3600);
                remain -= hours * 3600;
                let mins = Math.floor(remain / 60);
                remain -= mins * 60;
                let secs = remain;

                if (hours < 10) { hours = "0" + hours; }
                if (mins < 10) { mins = "0" + mins; }
                if (secs < 10) { secs = "0" + secs; }
                stopWatch.timeDisplay.innerHTML = hours + ":" + mins + ":" + secs;
            },

            start : function () {
                stopWatch.timer = setInterval(stopWatch.tick, 1000);
                stopWatch.startButton.value = "Стоп";
                stopWatch.startButton.removeEventListener("click", stopWatch.start);
                stopWatch.startButton.addEventListener("click", stopWatch.stop);
            },

            stop  : function () {
                clearInterval(stopWatch.timer);
                stopWatch.timer = null;
                stopWatch.startButton.value = "Начать";
                stopWatch.startButton.removeEventListener("click", stopWatch.stop);
                stopWatch.startButton.addEventListener("click", stopWatch.start);
            },

            complete  : function () {
                clearInterval(stopWatch.timer);
                stopWatch.timer = null;
                stopWatch.startButton.remove();
                stopWatch.resetButton.value = "Восстановить";
                stopWatch.startButton.removeEventListener("click", stopWatch.stop);
            }
        };

        window.addEventListener("load", stopWatch.init);
    }
}