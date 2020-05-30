'use strict';

document.addEventListener('DOMContentLoaded', ()=>{

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent(){
        tabsContent.forEach(item =>{
            item.style.display = 'none';
        });
        tabs.forEach(item =>{
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0){
        tabsContent[i].style.display= 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click',(event) =>{
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) =>{
                if (target == item){
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    ///timer

    const deadline ='2020-06-10';

    function getTimeRemaining(endtime){
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t/(1000 * 60 * 60 * 24)),
            hours = Math.floor((t/(1000 * 60 * 60) % 24)),
            minutes = Math.floor((t/(1000 * 60 ) % 60)),
            seconds = Math.floor((t/(1000)) % 60);

        return{
            'total': t,
            'days':days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }

    function addZero(num){
        if(num >= 0 && num < 10){
          return `0${num}`;
        } else {
            return num;
        }

    }

    function setClock(selector, endtime){
        const timer = document.querySelector('.timer'),
            days = document.querySelector('#days'),
            hours = document.querySelector('#hours'),
            minutes = document.querySelector('#minutes'),
            seconds = document.querySelector('#seconds'),
            timeInterval = setInterval(updateClock , 1000);

            updateClock();

        function updateClock(){
            const t = getTimeRemaining(endtime);
            days.innerHTML = addZero(t.days);
            hours.innerHTML = addZero(t.hours);
            minutes.innerHTML = addZero(t.minutes);
            seconds.innerHTML = addZero(t.seconds);

            if(t.total <= 0) {
                clearInterval(timeInterval);
            }
            
        }
    }

    setClock('.timer', deadline);
    getTimeRemaining(deadline);


    //modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalClose = document.querySelector('[data-close]');

    console.log(modalTrigger, modal);

    function showModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    modalTrigger.forEach((item) => {
        item.addEventListener('click', showModal);
    });


    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if(e.target === modal){
            closeModal();
        }
        });

    document.addEventListener('keydown', (e) =>{
        if(e.code === "Escape" && modal.style.display === 'block'){
            closeModal();
        }
    });

    const modalTimerId = setTimeout(showModal, 300000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

///card

class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.descr = descr;
        this.price = price;
        this.classes = classes; //array
        this.parentSelector = document.querySelector(parentSelector);
        this.transfer = 27;
        this.changeToUAH();
    }
    changeToUAH() {
        this.price = this.price * this.transfer;
    }
    render() {
        let element = document.createElement('div');

        console.log(this.classes);
        console.log(this.classes.length);
        if(this.classes.length === 0){
            console.log("1");
            element.classList.add('menu__item');
        } else {
        this.classes.forEach(className => element.classList.add(className));
        }
        element.innerHTML = `<img src="${this.src}" alt="${this.alt}">
        <h3 class="menu__item-subtitle">Меню "${this.title}"</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>`;
    this.parentSelector.append(element);
    }
}

new MenuCard(
    "img/tabs/post.jpg",
    "post",
    "ПОСТНОЕ",
    "test",
    12,
    ".menu .container",
    "menu__item",
    "large"
).render();


new MenuCard(
    "img/tabs/elite.jpg",
    "elite",
    "elite",
    "test",
    16,
    ".menu .container",
).render();

new MenuCard(
    "img/tabs/vegy.jpg",
    "vegy",
    "vegy",
    "test",
    19,
    ".menu .container"
).render();

//forms

//Forms

const forms = document.querySelectorAll('form');
const message = {
    loading: 'Загрузка',
    success: 'Спасибо, скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так'
};

forms.forEach(item =>{
    postData(item);
});

function postData(form) {
    form.addEventListener('submit', (e) =>{
        e.preventDefault();

        const statusMassage = document.createElement('div');
        statusMassage.classList.add('status');
        statusMassage.textContent = message.loading;
        form.append(statusMassage);


        const r = new XMLHttpRequest();
        r.open('POST', 'server.php');

        r.setRequestHeader('Content-type', 'appliacation/json');
        const formData = new FormData(form);

            // formData to object
        const object= {}; 
        formData.forEach(function(value,key){
            object[key] = value;
        });
            //object to JSON
        const json = JSON.stringify(object);

        r.send(json);
        r.addEventListener('load', ()=> {
            if (r.status === 200){
                console.log(r.response);
                statusMassage.textContent = message.success;
                form.reset();
                setTimeout(()=>{
                    statusMassage.remove();
                },2000);
            } else {
                statusMassage.textContent = message.failure;
            }
        });
    });
}


});