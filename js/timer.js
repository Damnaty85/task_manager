class Timer {
    constructor (timeDisplay = null, completeButton = null, startButton = null, timer = null, now = 0) {

        const element = this.element = document.createElement('div');

        element.classList.add('timer__wrap');

        element.innerHTML =
            '<div id="stopwatch">\n' +
            '<span>Затраченое время</span>' +
            '<div id="timeDisplay">00:00:00</div>\n' +
            '<div class="button__wrap">\n' +
            '<input type="button" value="Завершить" id="completeButton" disabled/>\n' +
            '<input type="button" value="Начать" id="startButton" disabled/>\n' +
            '</div>\n' +
            '</div>';

        timeDisplay = element.querySelector("#timeDisplay");
        completeButton = element.querySelector("#completeButton");
        startButton = element.querySelector("#startButton");

        completeButton.addEventListener("click", complete);
        completeButton.disabled = false;
        startButton.addEventListener("click", start);
        startButton.disabled = false;

        function tick () {
            now++;
            let remain = now;
            let hours = Math.floor(remain / 3600);
            remain -= hours * 3600;
            let mins = Math.floor(remain / 60);
            remain -= mins * 60;
            let secs = remain;

            if (hours < 10) { hours = "0" + hours; }
            if (mins < 10) { mins = "0" + mins; }
            if (secs < 10) { secs = "0" + secs; }
            timeDisplay.innerHTML = hours + ":" + mins + ":" + secs;
        }

        function  start () {
            timer = setInterval(tick, 1000);
            startButton.value = "Стоп";
            startButton.removeEventListener("click", start);
            startButton.addEventListener("click", stop);
        }

        function stop () {
            clearInterval(timer);
            timer = null;
            startButton.value = "Начать";
            startButton.removeEventListener("click", stop);
            startButton.addEventListener("click", start);
        }

        function complete () {
            clearInterval(timer);
            timer = null;
            startButton.style.display = 'none';
            completeButton.value = "Восстановить";
            completeButton.style.backgroundColor = '#006978';
            completeButton.addEventListener('mouseenter', () => {
                completeButton.style.backgroundColor = '#00838f';
            });
            completeButton.addEventListener('mouseleave', () => {
                completeButton.style.backgroundColor = '#006978';
            });
            startButton.removeEventListener("click", stop);
            completeButton.addEventListener('click', recovery);
        }

        function recovery() {
            timer = null;
            completeButton.value = "Завершить";
            startButton.value = "Начать";
            startButton.style.display = 'inline-flex';
            completeButton.style.backgroundColor = '#d32f2f';
            completeButton.addEventListener('mouseenter', () => {
                completeButton.style.backgroundColor = '#e53935';
            });
            completeButton.addEventListener('mouseleave', () => {
                completeButton.style.backgroundColor = '#d32f2f';
            });
            completeButton.removeEventListener('click', recovery);
            startButton.addEventListener("click", start);
        }
    }
}