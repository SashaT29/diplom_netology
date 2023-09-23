let parsedSeances = JSON.parse(localStorage.getItem('session'));
let confStepWrapper = document.querySelector('.conf-step__wrapper');
let button = document.querySelector('.acceptin-button');

let filmTitle = document.querySelector('.buying__info-title');
filmTitle.textContent = parsedSeances.filmName;

let startSeance = document.querySelector('.buying__info-start');
startSeance.textContent = `Начало сеанса: ${parsedSeances.seanceTime}`;

let infoHall = document.querySelector('.buying__info-hall');
infoHall.textContent = parsedSeances.hallName.split('Зал').join('Зал ');

let priceStd = document.querySelector('.price-standart');
priceStd.textContent = parsedSeances.priceStandart;

let priceVip = document.querySelector('.price-vip');
priceVip.textContent = parsedSeances.priceVip;

let scale = document.querySelector('.buying');

let hint = document.querySelector('.buying__info-hint');
hint.addEventListener('dblclick', () => {
    scale.classList.toggle('buying-scale');
})

createRequest(`event=get_hallConfig&timestamp=${parsedSeances.timeStamp}&hallId=${parsedSeances.hallId}&seanceId=${parsedSeances.seanceId}`, function (data) {
    if (data) {
        document.querySelector('.conf-step__wrapper').innerHTML = data;
    } else {
        document.querySelector('.conf-step__wrapper').innerHTML = parsedSeances.hallConfig;
    }

    let chairSelected = document.querySelectorAll('.conf-step__row .conf-step__chair_selected');
    if (chairSelected.length > 0) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }

    let chairs = document.querySelectorAll('.conf-step__chair');
    for (let chair of chairs) {
        chair.addEventListener('click', () => {
            chair.classList.toggle('conf-step__chair_selected');

            if (chair.classList.contains('conf-step__chair_taken')) {
                chair.classList.remove('conf-step__chair_selected');
            }

            chairSelected = document.querySelectorAll('.conf-step__row .conf-step__chair_selected');

            if (chairSelected.length > 0){
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })
    }

    button.addEventListener('click', () => {
        let selectedChairs = [];
        chairSelected.forEach((selectedChair) => {
            let rowElement = selectedChair.closest('.conf-step__row');
            let rowIndex = Array.from(rowElement.parentNode.children).indexOf(rowElement) + 1;
            let placeIndex = Array.from(rowElement.children).indexOf(selectedChair) + 1;

            let typePlace;
            if (selectedChair.classList.contains('conf-step__chair_standart')) {
                typePlace = 'standart';
            } else if (selectedChair.classList.contains('conf-step__chair_vip')) {
                typePlace = 'vip';
            }
                selectedChairs.push({ row: rowIndex, place: placeIndex, type: typePlace});

            parsedSeances.hallConfig = confStepWrapper.innerHTML;
            parsedSeances.selectedPlaces = selectedChairs;
            localStorage.setItem('session', JSON.stringify(parsedSeances));
            location.href = 'payment.html';
        })
    })
})
