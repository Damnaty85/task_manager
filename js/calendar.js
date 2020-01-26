class Calendar {
    constructor () {
        const element = this.element = document.createElement('div');

        element.classList.add('date__wrap');
        const dateSpan = document.createElement('span');
        dateSpan.textContent = 'Создано:';
        element.append(dateSpan);

        var d=new Date();
        var day=d.getDate();
        var month=d.getMonth() + 1;
        var year=d.getFullYear();

        const elementDateCalendar = document.createElement('div');
        elementDateCalendar.classList.add('date__calendar');
        elementDateCalendar.textContent = day + ".0" + month + "." + year;
        element.append(elementDateCalendar);
    }
}