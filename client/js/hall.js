let parsedSession = JSON.parse(localStorage.getItem('session'));
let confStepWrapper = document.querySelector('.conf-step__wrapper');
let button = document.querySelector('.acceptin-button');

let filmsTitle = document.querySelector('.buying__info-title');
filmsTitle.textContent = parsedSession.filmName;

let seanceStart = document.querySelector('.buying__info-start');
seanceStart.textContent = `Начало сеанса: ${parsedSession.seanceTime}`;

let hallInfo = document.querySelector('.buying__info-hall');
hallInfo.textContent = parsedSession.hallName.split('Зал').join('Зал ');

let priceStd = document.querySelector('.price-standart');
priceStd.textContent = parsedSession.priceStandart;

let priceVip = document.querySelector('.price-vip');
priceVip.textContent = parsedSession.priceVip;

let buy = document.querySelector('.buying');

let hint = document.querySelector('.buying__info-hint');
hint.addEventListener('dblclick', () => {
    buy.classList.toggle('buying-scale');
})

createRequest(`event=get_hallConfig&timestamp=${parsedSession.timeStamp}&hallId=${parsedSession.hallId}&seanceId=${parsedSession.seanceId}`, function (data) {
    if (data) {
        document.querySelector('.conf-step__wrapper').innerHTML = data;
    } else {
        document.querySelector('.conf-step__wrapper').innerHTML = parsedSession.hallConfig;
    }

    let selectChair = document.querySelectorAll('.conf-step__row .conf-step__chair_selected');
    if (selectChair.length > 0) {
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

            selectChair = document.querySelectorAll('.conf-step__row .conf-step__chair_selected');

            if (selectChair.length > 0){
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })
    }

    button.addEventListener('click', () => {
        let chairsSelected = [];
        selectChair.forEach((selectedChair) => {
            let rowElement = selectedChair.closest('.conf-step__row');
            let rowIndex = Array.from(rowElement.parentNode.children).indexOf(rowElement) + 1;
            let placeIndex = Array.from(rowElement.children).indexOf(selectedChair) + 1;

            let placeType;
            if (selectedChair.classList.contains('conf-step__chair_standart')) {
                placeType = 'standart';
            } else if (selectedChair.classList.contains('conf-step__chair_vip')) {
                placeType = 'vip';
            }
                chairsSelected.push({ row: rowIndex, place: placeIndex, type: placeType});

            parsedSession.hallConfig = confStepWrapper.innerHTML;
            parsedSession.selectedPlace = chairsSelected;
            localStorage.setItem('session', JSON.stringify(parsedSession));
            location.href = 'payment.html';
        })
    })
})
