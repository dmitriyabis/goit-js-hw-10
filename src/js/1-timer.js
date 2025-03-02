import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  daysFace: document.querySelector('[data-days]'),
  hoursFace: document.querySelector('[data-hours]'),
  minutesFace: document.querySelector('[data-minutes]'),
  secondsFace: document.querySelector('[data-seconds]'),
  chooseInput: document.querySelector('#datetime-picker'),

  options: {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    userSelectedDate: null,
    onClose(selectedDates) {
      refs.options.userSelectedDate = selectedDates[0];

      if (refs.options.userSelectedDate.getTime() > Date.now()) {
        refs.startBtn.removeAttribute('disabled');
      } else {
        refs.startBtn.setAttribute('disabled', true);
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future!',
          position: 'topRight',
          color: 'red',
          timeout: 5000,
        });
      }
    },
  },
};

flatpickr(refs.chooseInput, refs.options);
let countdownInterval;

refs.startBtn.setAttribute('disabled', true);

refs.startBtn.addEventListener('click', () => {
  const selectedDate = refs.options.userSelectedDate;

  if (!selectedDate || selectedDate.getTime() <= Date.now()) {
    refs.startBtn.setAttribute('disabled', true);
    return;
  }

  refs.startBtn.setAttribute('disabled', true);
  refs.chooseInput.setAttribute('disabled', true);
  refs.startBtn.style.pointerEvents = 'none';

  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const ms = selectedDate - now;

    if (ms <= 0) {
      clearInterval(countdownInterval);
      refs.daysFace.textContent = '00';
      refs.hoursFace.textContent = '00';
      refs.minutesFace.textContent = '00';
      refs.secondsFace.textContent = '00';

      refs.chooseInput.removeAttribute('disabled');
      return;
    }
    function convertMs(ms) {
      // Number of milliseconds per unit of time
      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      // Remaining days
      const days = Math.floor(ms / day);
      // Remaining hours
      const hours = Math.floor((ms % day) / hour);
      // Remaining minutes
      const minutes = Math.floor(((ms % day) % hour) / minute);
      // Remaining seconds
      const seconds = Math.floor((((ms % day) % hour) % minute) / second);

      return { days, hours, minutes, seconds };
    }

    const { days, hours, minutes, seconds } = convertMs(ms);

    refs.daysFace.textContent = String(days).padStart(2, '0');
    refs.hoursFace.textContent = String(hours).padStart(2, '0');
    refs.minutesFace.textContent = String(minutes).padStart(2, '0');
    refs.secondsFace.textContent = String(seconds).padStart(2, '0');
  }, 1000);
});
