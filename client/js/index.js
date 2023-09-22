document.addEventListener('DOMContentLoaded', () => {
  let dayToday = document.querySelector('.page-nav__day_today')
  let dayWeek = document.querySelectorAll('.page-nav__day-week');
  let dayNumber = document.querySelectorAll('.page-nav__day-number');
  let navDay = document.querySelectorAll('.page-nav__day');
 
  let today = new Date().getTime();

  for (let i = 0; i < navDay.length; i++) {
    let actuallyDate = new Date(today + 24 * 60 * 60 * 1000 * i);
    dayWeek[i].textContent = getDay(actuallyDate); 
    dayNumber[i].textContent = actuallyDate.getDate(); 

    if(getDay(actuallyDate) === "Вс" || getDay(actuallyDate) === "Сб"){
      
      dayWeek[i].classList.add('page-nav__day_weekend');
      dayNumber[i].classList.add('page-nav__day_weekend');
      
    } else {
      for (let element of navDay) {
      element.closest('.page-nav__day').classList.remove('page-nav__day_weekend');
      }
    }
  }  
      
  function getDay(actuallyDate) {
    let days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    return days[actuallyDate.getDay()];
  }

  createRequest('event=update', function(data) {
    let films = data.films.result;
    let halls = data.halls.result;
    halls = halls.filter((hall) => hall.hall_open === '1');
    let seances = data.seances.result;
    let output = '';
        
  for (let film of films) {
    let outputHalls = '';
     for(let hall of halls) {   
        let actuallySeances = seances.filter(seance => ((seance.seance_hallid === hall.hall_id) && (seance.seance_filmid === film.film_id)));
      if(actuallySeances.length > 0) {
      outputHalls += `<div class="movie-seances__hall">
                        <h3 class="movie-seances__hall-title">${hall.hall_name.split('Зал').join('Зал ')}</h3>
                        <ul class="movie-seances__list">`
       for(let seance of actuallySeances) {
        outputHalls += `<li class="movie-seances__time-block"><a class="movie-seances__time" href="hall.html"
        data-film-name="${film.film_name}" data-film-id="${film.film_id}" data-hall-id="${hall.hall_id}"
        data-hall-name="${hall.hall_name}" data-price-standart="${hall.hall_price_standart}" 
        data-price-vip="${hall.hall_price_vip}" data-seance-id="${seance.seance_id}"
        data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}">
        ${seance.seance_time}</a></li>`
                        }
      outputHalls += `</ul>
                        </div>` 
      }  
    }  
    output += `<section class="movie">
                    <div class="movie__info">      
                        <div class="movie__poster">
                            <img class="movie__poster-image" alt='${film.film_name}' src='${film.film_poster}'>
                        </div>
          <div class="movie__description">        
            <h2 class="movie__title">${film.film_name}</h2>
            <p class="movie__synopsis">${film.film_description}</p>
          <p class="movie__data">
            <span class="movie__data-duration">${film.film_duration} минут</span>
            <span class="movie__data-origin">${film.film_origin}</span>
          </p>
        </div> 
        </div>
        ${outputHalls}
        </section>`
    }
  
  document.querySelector('main').innerHTML = output; 

  let seancesTime = document.querySelectorAll('.movie-seances__time');
  
        function updateSeances () {
            seancesTime.forEach((element) => {
                let seanceStart = element.dataset.seanceStart;
                let chosenDay = document.querySelector('.page-nav__day_chosen');
                let chosenDayIndex = Array.from(navDay).indexOf(chosenDay);
  
                let chosenDate = new Date();
                chosenDate.setDate(chosenDate.getDate() + chosenDayIndex);
                chosenDate.setHours(0, 0, 0);
  
                let seanceTime = Math.floor(chosenDate.getTime() / 1000) + seanceStart * 60;
                element.dataset.timeStamp = seanceTime;
  
                let todayTime = new Date();
                let currentTime = Math.round(todayTime.getTime() / 1000);
  
                if (currentTime > seanceTime){
                    element.classList.add('acceptin-button-disabled');
                } else {
                    element.classList.remove('acceptin-button-disabled');
                }
            })
        }
  
        let dayChosen = document.querySelector('.page-nav__day_chosen');
        dayChosen.classList.remove('page-nav__day_chosen');
        dayToday.classList.add('page-nav__day_chosen');
  
        navDay.forEach((element, index) => {
            element.addEventListener('click', (e) => {
                for (let element of navDay) {
                    element.classList.remove('page-nav__day_chosen');
                }
                navDay[index].classList.add('page-nav__day_chosen');
                e.preventDefault();
                updateSeances();
            })
        })
  
        updateSeances();
  
        for (let element of seancesTime) {
            element.addEventListener('click', () => {
                let hallId = element.dataset.hallId;
                let chosenHall = halls.find((hall) => hall.hall_id === hallId);
                let chosenData = {
                    ...element.dataset,
                    hallConfig: chosenHall.hall_config
                };
  
                localStorage.setItem('session', JSON.stringify(chosenData));
            })
        }
    })
  })
  
  
  
  
  