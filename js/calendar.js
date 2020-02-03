class Calendar {
    constructor () {
        const element = this.element = document.createElement('div');

        element.classList.add('date__wrap');

        element.innerHTML =
            '<div class="date-create">Создано: <span></span></div>\n' +
            '<div class="date-picker">\n' +
            '<div class="selected-date">Выполнить до: <span></span></div>\n' +
            '<div class="dates">\n' +
            '<div class="month">\n' +
            '<div class="arrows prev-mth">&lt;</div>\n' +
            '<div class="mth"></div>\n' +
            '<div class="arrows next-mth">&gt;</div>\n' +
            '</div>\n' +
            '<div class="week__days"></div>\n' +
            '<div class="days"></div>\n' +
            '</div>\n' +
            '</div>';

        const datePickerElement = element.querySelector('.date-picker');
        const createDateElement = element.querySelector('.date-create span');
        const selectDateElement = element.querySelector('.selected-date span');
        const datesElement = element.querySelector('.dates');
        const monthElement = element.querySelector('.month .mth');
        const nextMonthElement = element.querySelector('.month .next-mth');
        const prevMonthElement = element.querySelector('.month .prev-mth');
        const weekDaysElement = element.querySelector('.week__days');
        const daysElement = element.querySelector('.days');

        const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь','Декабрь'];
        const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        let date = new Date();
        let day = date.getDate();
        // let weekDay = date.getDay();
        let month = date.getMonth();
        let year = date.getFullYear();

        // определяем день недели по дате
        function getWeekDay () {
            return weekdays[date.getDay()];
        }

        // let dayWeek = new Date(year, month, day++);
        // console.log(getWeekDay(dayWeek));

        let selectedDate = date;
        let selectedDay = day;
        let selectedMonth = month;
        let selectedYear = year;

        monthElement.textContent = months[month] + ', ' + year;

        createDateElement.textContent = formatDate(date).toLocaleString();
        createDateElement.dataset.value = selectedDate;

        selectDateElement.textContent = formatDate(date);
        selectDateElement.dataset.value = selectedDate;

        populateDates();

        datePickerElement.addEventListener('click', toggleDatePicker);
        nextMonthElement.addEventListener('click', nextMonthHandler);
        prevMonthElement.addEventListener('click', prevMonthHandler);

        function toggleDatePicker (evt) {
            if (!checkEventPathForClass(evt.path, 'dates')) {
                datesElement.classList.toggle('active');
            }
        }

        function nextMonthHandler (evt) {
            month++;
            if (month > 11) {
                month = 0;
                year++;
            }
            monthElement.textContent = months[month] + ', ' + year;
            populateDates();
        }

        function prevMonthHandler (evt) {
            month--;
            if (month < 0) {
                month = 11;
                year--;
            }
            monthElement.textContent = months[month] + ', ' + year;
            populateDates();
        }

        //функция вычисляет является ли год высокосным
        function isLeapYear (year) {
            return year % 4 === 0 && ( year % 100 !== 0 || year % 400 === 0 )
        }

        function createWeekDays() {
            weekDaysElement.innerHTML = '';
            let amountWeekDays = 7;

            for (let j = 0; j < amountWeekDays; j++) {
                const weekDayElement = document.createElement('div');
                weekDayElement.classList.add('week__day');
                weekDayElement.textContent = weekdays[j];
                weekDaysElement.appendChild(weekDayElement);
            }
        }

        // createWeekDays();

        function populateDates (evt) {
            daysElement.innerHTML = '';
            let amountDays = 31;

            //проверяем первый елемент массива месяцев и затем является ли текущий год высокосным
            if (month === 1) {
                if (isLeapYear(year)) {
                    amountDays = 29;
                } else {
                    amountDays = 28;
                }
            }

            for (let i = 0; i < amountDays; i++) {
                const dayElement = document.createElement('div');
                dayElement.classList.add('day');
                dayElement.textContent = i + 1;

                if (selectedDay === (i + 1) && selectedYear === year && selectedMonth === month) {
                    dayElement.classList.add('selected');
                }

                dayElement.addEventListener('click', function () {
                   selectedDate = new Date(year + '-' + (month + 1) + '-' + (i + 1));
                   selectedDay = (i + 1);
                   selectedMonth = month;
                   selectedYear = year;

                   selectDateElement.textContent = formatDate(selectedDate);
                   selectDateElement.dataset.value = selectedDate;

                   populateDates();
                });

                daysElement.append(dayElement);
            }
        }

        function checkEventPathForClass(path, selector) {
            for (let i=0; i < path.length; i++) {
                if (path[i].classList && path[i].classList.contains(selector)) {
                    return true;
                }
            }
            return false
        }

        function formatDate (date) {
            let day = date.getDate();

            if (day < 10) {
                day = '0' + day;
            }

            let month = date.getMonth() + 1;

            if (month < 10) {
                month = '0' + month;
            }

            let year = date.getFullYear();

            return day + ' / ' + month + ' / ' +year;
        }
    }
}