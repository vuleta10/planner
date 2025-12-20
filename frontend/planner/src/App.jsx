import React, { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const isLeapYear = (year) =>
      (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
      (year % 100 === 0 && year % 400 === 0);
    const getFebDays = (year) => (isLeapYear(year) ? 29 : 28);

    let calendar = document.querySelector(".calendar");
    const month_names = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    let month_picker = document.querySelector("#month-picker");

    // ----- funkcija za generisanje kalendara -----
    const generateCalendar = (month, year) => {
      let calendar_days = document.querySelector(".calendar-days");
      calendar_days.innerHTML = "";
      let calendar_header_year = document.querySelector("#year");
      let days_of_month = [
        31, getFebDays(year), 31, 30, 31, 30,
        31, 31, 30, 31, 30, 31
      ];
      let currentDate = new Date();
      month_picker.innerHTML = month_names[month];
      calendar_header_year.innerHTML = year;
      let first_day = new Date(year, month);

      for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
        let day = document.createElement("div");
        if (i >= first_day.getDay()) {
          day.innerHTML = i - first_day.getDay() + 1;
          if (
            i - first_day.getDay() + 1 === currentDate.getDate() &&
            year === currentDate.getFullYear() &&
            month === currentDate.getMonth()
          ) {
            day.classList.add("current-date");
          }
        }
        calendar_days.appendChild(day);
      }
    };

    // ----- lista meseci -----
    let month_list = calendar.querySelector(".month-list");
    const month_list_render = () => {
      month_names.forEach((e, index) => {
        let month = document.createElement("div");
        month.innerHTML = `<div>${e}</div>`;
        month_list.append(month);
        month.onclick = () => {
          currentMonth.value = index;
          generateCalendar(currentMonth.value, currentYear.value);
          month_list.classList.replace("show", "hide");
        };
      });
    };
    month_list_render();

    // ----- logika meseci -----
    month_list.classList.add("hideonce");
    month_picker.onclick = () => {
      month_list.classList.toggle("show");
    };

    document.querySelector("#pre-year").onclick = () => {
      --currentYear.value;
      generateCalendar(currentMonth.value, currentYear.value);
    };
    document.querySelector("#next-year").onclick = () => {
      ++currentYear.value;
      generateCalendar(currentMonth.value, currentYear.value);
    };

    // ----- inicijalni prikaz -----
    let currentDate = new Date();
    let currentMonth = { value: currentDate.getMonth() };
    let currentYear = { value: currentDate.getFullYear() };
    generateCalendar(currentMonth.value, currentYear.value);

    // ----- prikaz vremena -----
    const todayShowTime = document.querySelector(".time-formate");
    const todayShowDate = document.querySelector(".date-formate");
    const currshowDate = new Date();
    const showCurrentDateOption = {
      year: "numeric", month: "long", day: "numeric", weekday: "long"
    };
    const currentDateFormate = new Intl.DateTimeFormat(
      "en-US", showCurrentDateOption
    ).format(currshowDate);
    todayShowDate.textContent = currentDateFormate;

    setInterval(() => {
      const timer = new Date();
      const option = { hour: "numeric", minute: "numeric", second: "numeric" };
      todayShowTime.textContent = new Intl.DateTimeFormat("en-us", option).format(timer);
    }, 1000);
  }, []); // 

  return (
    <>
      {/* Animirana pozadina */}
      <div className="blob-outer-container">
        <div className="blob-inner-container">
          <div className="blob"></div>
        </div>
      </div>

      {/* Gornje zaglavlje */}
      <header className="top-bar">
        <h1 className="app-title">Planner</h1>
        <div className="auth-buttons">
          <button className="login-btn">Login</button>
          <button className="join-btn">Join</button>
        </div>
      </header>

      {/* Kalendar */}
      <div className="outer-wrapper">
        <div className="calendar">
          <div className="calendar-header">
            <span className="month-picker" id="month-picker">May</span>
            <div className="year-picker" id="year-picker">
              <span className="year-change" id="pre-year"><pre>{"<"}</pre></span>
              <span id="year">2024</span>
              <span className="year-change" id="next-year"><pre>{">"}</pre></span>
            </div>
          </div>

          <div className="calendar-body">
            <div className="calendar-week-days">
              <div>Sun</div><div>Mon</div><div>Tue</div>
              <div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div className="calendar-days"></div>
          </div>

          <div className="calendar-footer"></div>

          <div className="date-time-format">
            <div className="day-text-format">TODAY</div>
            <div className="date-time-value">
              <div className="time-formate">00:00:00</div>
              <div className="date-formate">--</div>
            </div>
          </div>

          <div className="month-list"></div>
        </div>
      </div>
    </>
  );
}

export default App;