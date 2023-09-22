let parsedSession = JSON.parse(localStorage.getItem('session'));

let filmsTitle= document.querySelector('.ticket__title');
filmsTitle.textContent = parsedSession.filmName;

let seanceStart = document.querySelector('.ticket__start');
let bookedDay = new Date(parsedSession.timeStamp*1000);
let bookedDate = bookedDay.toLocaleString().split(',')[0];
seanceStart.textContent = `${parsedSession.seanceTime}, ${bookedDate}`;

let hallInfo = document.querySelector('.ticket__hall');
hallInfo.textContent = parsedSession.hallName.split('Зал').join('');

let ticketChair = document.querySelector('.ticket__chairs');
let text = '';
let cost = 0;
let type = '';

for (let key in parsedSession.selectedPlace) {
    let row = parsedSession.selectedPlace[key].row;
    let place = parsedSession.selectedPlace[key].place;
    type = parsedSession.selectedPlace[key].place;
    type = parsedSession.selectedPlace[key].type;
    if (type === 'standart') {
        cost += Number(parsedSession.priceStandart);
        console.log(cost);
    } else {
        cost += Number(parsedSession.priceVip);
    }
    text += ` ${row}/${place}, `.replace(/.$/,"");
}

ticketChair.textContent = text.slice(0, -1);

let ticketCost = document.querySelector('.ticket__cost');
ticketCost = cost;

document.querySelector('.acceptin-button').addEventListener('click', () => {
    fetch('https://jscp-diplom.netoserver.ru/', {
        method: 'POST',
        body: `event=sale_add&timestamp=${parsedSession.timeStamp}&hallId=${parsedSession.hallID}&seanceId=${parsedSession.seanceId}&hallConfiguration=${parsedSession.hallConfig}`,
        headers: {
            'Content-Type':'application/x-www-form-urlencoded',
        },
    })
})