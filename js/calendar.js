class Calendar {
    constructor () {
        const element = this.element = document.createElement('div');

        element.classList.add('date__wrap');

        element.innerHTML =
            '<div class="calendar disable-selection" id="calendar">\n' +
            '    <div class="left-side">\n' +
            '        <div class="current-day">\n' +
            '            <div class="calendar-left-side-day"></div>\n' +
            '            <div class="calendar-left-side-month"></div>\n' +
            '            <div class="calendar-left-side-day-of-week"></div>\n' +
            '        <div class="calendar-change-year">\n' +
            '            <div class="calendar-change-year-slider">\n' +
            '                <span class="material-icons calendar-change-year-slider-prev">navigate_before</span>\n' +
            '                <span class="calendar-current-year"></span>\n' +
            '                <span class="material-icons calendar-change-year-slider-next">navigate_next</span>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '    <div class="right-side">\n' +
            '        <div class="calendar-month-list">\n' +
            '            <ul class="calendar-month"></ul>\n' +
            '        </div>\n' +
            '        <div class="calendar-week-list">\n' +
            '            <ul class="calendar-week"></ul>\n' +
            '        </div>\n' +
            '        <div class="calendar-day-list">\n' +
            '            <ul class="calendar-days"></ul>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>';

        this.availableMonth = ['Январь', 'Февраль', 'Март', 'Апрель', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        this.AVAILABLE_WEEK_DAYS = ['Воскресенье', 'Понедельник', 'Вторник' ,'Среда', 'Четверг', 'Пятница', 'Суббота'];
        this.date = +new Date();
        this.maxDays = 42;

        this.LocalEventList = JSON.parse(localStorage.getItem('calendar-event')) || {};

        this.elementDays = element.querySelector('.calendar-days');
        this.elementWeek = element.querySelector('.calendar-week');
        this.elementMonth = element.querySelector('.calendar-month');
        this.elementYear = element.querySelector('.calendar-current-year');
        this.elementEventList = element.querySelector('.current-day-events-list');
        this.elementCurrentDay = element.querySelector('.calendar-left-side-day');
        this.elementCurrentWeekDay = element.querySelector('.calendar-left-side-day-of-week');
        this.elementCurrentMonth = element.querySelector('.calendar-left-side-month');
        this.elementPrevYear = element.querySelector('.calendar-change-year-slider-prev');
        this.elementNextYear = element.querySelector('.calendar-change-year-slider-next');

        this.drawAll();
        this.eventsTrigger();
    }

        drawAll () {
            this.drawWeekDays();
            this.drawMonth();
            this.drawDays();
            this.drawYearAndCurrentDay();
        }

        drawWeekDays () {
            let weekTemplate = "";
            this.AVAILABLE_WEEK_DAYS.forEach(week => {
                weekTemplate += `<li>${week.slice(0, 3)}</li>`
            });

            this.elementWeek.innerHTML = weekTemplate;
        }

        drawMonth () {
            let monthTemplate = '';
            let calendar = this.getCalendar();

            this.availableMonth.forEach((month, idx) => {
                monthTemplate += `<li class="${idx === calendar.active.month ? 'active' : ''}" data-month = "${idx}">${month}</li>`;
            });

            this.elementMonth.innerHTML = monthTemplate;
        }

        drawYearAndCurrentDay () {
            let calendar = this.getCalendar();
            this.elementYear.innerHTML = calendar.active.year;
            this.elementCurrentDay.innerHTML = calendar.active.day;
            this.elementCurrentWeekDay.innerHTML = this.AVAILABLE_WEEK_DAYS[calendar.active.week];
            this.elementCurrentMonth.innerHTML = this.availableMonth[calendar.active.month];
        }

        drawDays () {
            let calendar = this.getCalendar();

            let latestDaysInPrevMonth = this.range(calendar.active.startWeek).map((day, idx) => {
                return {
                    dayNumber: this.countOfDaysInMonth(calendar.pMonth) - idx,
                    month: new Date(calendar.pMonth).getMonth(),
                    year: new Date(calendar.pMonth).getFullYear(),
                    currentMonth: false
                }
            }).reverse();

            let daysInActiveMonth = this.range(calendar.active.days).map((day, idx) => {
                let dayNumber = idx + 1;
                let today = new Date();
                return {
                    dayNumber,
                    today: today.getDate() === dayNumber && today.getFullYear() === calendar.active.year && today.getMonth() === calendar.active.month,
                    month: calendar.active.month,
                    year: calendar.active.year,
                    selected: calendar.active.day === dayNumber,
                    currentMonth: true
                }
            });

            let countOfDays = this.maxDays - (latestDaysInPrevMonth.length + daysInActiveMonth.length);
            let daysInNextMonth = this.range(countOfDays).map((day, idx) => {
                return {
                    dayNumber: idx + 1,
                    month: new Date(calendar.nMonth).getMonth(),
                    year: new Date(calendar.nMonth).getFullYear(),
                    currentMonth: false
                }
            });

            let days = [...latestDaysInPrevMonth, ...daysInActiveMonth, ...daysInNextMonth];

            days = days.map(day => {
                let newDayParam = day;
                let formatted = this.getFormattedDate(new Date(`${Number(day.month) + 1}/${day.dayNumber}/${day.year}`));
                newDayParam.hasEvent = this.LocalEventList[formatted];
                return newDayParam;
            });

            let daysTemplate = "";
            days.forEach(day => {
                daysTemplate += `<li class="${day.currentMonth ? '' : 'another-month'}${day.today ? ' active-day ' : ''}${day.selected ? 'selected-day' : ''}${day.hasEvent ? ' event-day' : ''}" data-day="${day.dayNumber}" data-month="${day.month}" data-year="${day.year}">${day.dayNumber}</li>`
            });

            this.elementDays.innerHTML = daysTemplate;
        }

        updateTime(time) {
            this.date = +new Date(time);
        }

        eventsTrigger () {
            this.elementPrevYear.addEventListener('click', (evt) => {
                let calendar = this.getCalendar();
                this.updateTime(calendar.pYear);
                this.drawAll();
            });

            this.elementNextYear.addEventListener('click', (evt) => {
                let calendar = this.getCalendar();
                this.updateTime(calendar.nYear);
                this.drawAll();
            });

            this.elementMonth.addEventListener('click', (evt) => {
                let calendar = this.getCalendar();
                let month = evt.srcElement.getAttribute('data-month');
                if (!month || calendar.active.month == month) return false;

                let newMonth = new Date(calendar.active.tm).setMonth(month);
                this.updateTime(newMonth);
                this.drawAll();
            });

            this.elementDays.addEventListener('click', (evt) => {
                let element = evt.srcElement;
                let day = element.getAttribute('data-day');
                let month = element.getAttribute('data-month');
                let year = element.getAttribute('data-year');
                if (!day) return false;
                let srcDate = `${Number(month) + 1}/${day}/${year}`;
                this.updateTime(srcDate);
                this.drawAll();
            });
        }

        getCalendar() {
            let time = new Date(this.date);

            return {
                active: {
                    days: this.countOfDaysInMonth(time),
                    startWeek: this.getStartedDaysOfWeekByTime(time),
                    day: time.getDate(),
                    week: time.getDay(),
                    month: time.getMonth(),
                    year: time.getFullYear(),
                    formatted: this.getFormattedDate(time),
                    tm: +time
                },
                pMonth: new Date(time.getFullYear(), time.getMonth() - 1, 1),
                nMonth: new Date(time.getFullYear(), time.getMonth() + 1, 1),
                pYear: new Date(new Date(time).getFullYear() - 1, 0, 1),
                nYear: new Date(new Date(time).getFullYear() + 1, 0, 1)
            }
        }

        countOfDaysInMonth(time) {
            let date = this.getMonthAndYear(time);
            return new Date(date.year, date.month + 1, 0).getDate();
        }

        getStartedDaysOfWeekByTime (time) {
            let date = this.getMonthAndYear(time);
            return new Date(date.year, date.month, 1).getDay()
        }

        getFormattedDate (date) {
            return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
        }

        getMonthAndYear(time) {
            let date = new Date(time);
            return {
                year: date.getFullYear(),
                month: date.getMonth()
            }
        }

        range(number) {
            return new Array(number).fill().map((e, i) => i);
        }

}
