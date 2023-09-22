function qrCode () {
    let parsedSession = JSON.parse(localStorage.getItem('session'));

    let filmTitle = document.querySelector('.ticket__title');
    filmTitle.textContent = parsedSession.filmName;

    let seanceStart = document.querySelector('.ticket__start');
    let bookedDay = new Date(parsedSession.timeStamp*1000);
    let bookedDate = bookedDay.toLocaleString().split(',')[0];

    seanceStart.textContent = `${parsedSession.seanceTime}, ${bookedDate}`;
    let hallInfo = document.querySelector('.ticket__hall');
    hallInfo.textContent = parsedSession.hallName.split('Зал').join('');

    let ticketChair = document.querySelector('.ticket__chairs');
    let text = '';
    let type = '';

    for (let key in parsedSession.selectedPlace) {
        let row = parsedSession.selectedPlace[key].row;
        let place = parsedSession.selectedPlace[key].place;
        type = parsedSession.selectedPlace[key].place;
        text += `${row}/${place},`;
    }

    ticketChair.textContent = text.slice(0, -1);

    let qrContent = `
    Фильм: '${parsedSession.filmName}'.
    Ряд/место: ${text.slice(0, -1)}.
    Зал: ${parsedSession.hallName.split('Зал').join('')}.
    Начало сеанса: ${parsedSession.seanceTime}.
    Дата сеанса: ${bookedDate}.
    
    Билет действителен строго на свой сеанс. 
    `

    document.querySelector('.ticket__info-qr').outerHTML = '<div class="ticket__info-qr"></div>';

    let genQr = QRCreator(qrContent, {image: "SVG"});
    document.querySelector('.ticket__info-qr').append(genQr.result);
}

document.addEventListener('DOMContentLoaded', qrCode);