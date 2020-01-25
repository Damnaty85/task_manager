class Calendar {
    constructor () {
        const element = this.element = document.createElement('div');

        element.classList.add('date__wrap');
        const dateSpan = document.createElement('span');
        dateSpan.textContent = 'Создано:';
        element.append(dateSpan);
        const elementDateCalendar = document.createElement('div');
        elementDateCalendar.classList.add('date__calendar');
        element.append(elementDateCalendar);
    }
}