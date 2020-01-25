class Timer {
    constructor () {
        const ss = document.getElementsByClassName('stopwatch');

        const element = this.element = document.createElement('div');

        element.classList.add('timer__wrap');

        element.innerHTML =
            '<div id="stopwatch">\n' +
            '<span>Затраченое время</span>' +
            '<div id="timeDisplay">00:00:00</div>\n' +
            '<div class="button__wrap">\n' +
            '<input type="button" value="Сброс" id="resetButton" disabled/>\n' +
            '<input type="button" value="Начать" id="startButton" disabled/>\n' +
            '</div>\n' +
            '</div>';

        const stopWatch = {
            timeDisplay : null, // holds HTML time display
            resetButton : null, // holds HTML reset button
            startButton : null, // holds HTML start/stop button
            timer : null, // timer object
            now : 0, // current timer

            init : function () {
                // Get HTML elements
                stopWatch.timeDisplay = document.getElementById("timeDisplay");
                stopWatch.resetButton = document.getElementById("resetButton");
                stopWatch.startButton = document.getElementById("startButton");

                // Attach listeners
                stopWatch.resetButton.addEventListener("click", stopWatch.reset);
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

                // Update the display timer
                if (hours<10) { hours = "0" + hours; }
                if (mins<10) { mins = "0" + mins; }
                if (secs<10) { secs = "0" + secs; }
                stopWatch.timeDisplay.innerHTML = hours + ":" + mins + ":" + secs;
            },

            start : function () {
                // start() : start the stopwatch

                stopWatch.timer = setInterval(stopWatch.tick, 1000);
                stopWatch.startButton.value = "Стоп";
                stopWatch.startButton.removeEventListener("click", stopWatch.start);
                stopWatch.startButton.addEventListener("click", stopWatch.stop);
            },

            stop  : function () {
                // stop() : stop the stopwatch

                clearInterval(stopWatch.timer);
                stopWatch.timer = null;
                stopWatch.startButton.value = "Начать";
                stopWatch.startButton.removeEventListener("click", stopWatch.stop);
                stopWatch.startButton.addEventListener("click", stopWatch.start);
            },

            reset : function () {
                // reset() : reset the stopwatch

                // Stop if running
                if (stopWatch.timer != null) { stopWatch.stop(); }

                // Reset time
                stopWatch.now = -1;
                stopWatch.tick();
            }
        };

        window.addEventListener("load", stopWatch.init);
    }
}