import React, { useState } from "react";
import { loginUser, registerUser, getTask, saveTask } from "./api";
import "./App.css";
import logoImage from "./images/logo.jpeg"; 


function App() {
  // Stanja za stranicu i korisnika
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Stanja za modale
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Stanja za kalendar i zadatke
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskList, setTaskList] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const month_names = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [currMonth, setCurrMonth] = useState(new Date().getMonth());
  const [currYear, setCurrYear] = useState(new Date().getFullYear());

  // Logika za dane
  const isLeapYear = (y) => (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  const getFebDays = (y) => (isLeapYear(y) ? 29 : 28);
  const daysInMonth = [31, getFebDays(currYear), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Navigacija meseci
  const changeMonth = (offset) => {
    let newMonth = currMonth + offset;
    if (newMonth < 0) {
      setCurrMonth(11);
      setCurrYear(currYear - 1);
    } else if (newMonth > 11) {
      setCurrMonth(0);
      setCurrYear(currYear + 1);
    } else {
      setCurrMonth(newMonth);
    }
  };

  const handleDayClick = async (day) => {
    if (!isLoggedIn) {
      alert("Please login to manage tasks!");
      return;
    }
    const datum = `${currYear}-${String(currMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(datum);
    try {
      const data = await getTask(username, datum);
      setTaskList(data.task || "");
    } catch { setTaskList(""); }
  };

  const handleAddTask = async () => {
    if (!isLoggedIn) return alert("Login required");
    try {
      await saveTask(username, selectedDate, taskList);
      alert("Task saved!");
    } catch { alert("Failed to save."); }
  };

  const handleLogin = async () => {
    try {
      const res = await loginUser(username, password);
      if (res.status === "ok") {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setStatusMsg("");
      } else { setStatusMsg("Invalid credentials"); }
    } catch { setStatusMsg("Login failed"); }
  };
  
  const handleJoin = async () => {
    try {
      // registerUser vraća res.data (ono što je poslao backend)
      const data = await registerUser(username, password);
      
      // Pošto je axios uspešno izvršen (status 201), 
      // možemo smatrati da je registracija uspela.
      console.log("Server response data:", data); // Pogledaj u konzoli šta tačno piše

      setStatusMsg("Account created! Now you can login.");
      setShowJoinModal(false);
      setShowLoginModal(true);
      
    } 
    catch (error) {
    // Axios baca sve 4xx i 5xx greške ovde
    console.error("Join error:", error.response);
    const errorMsg = error.response?.data?.message || "Registration failed";
    setStatusMsg(errorMsg);
    }
  };


  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setSelectedDate(null);
    setTaskList("");
  };

  return (
    <>
      {/* MODAL ZA LOGIN */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Login</h2>
            <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}className="add-btn">Login</button>
            <button onClick={() => setShowLoginModal(false)}className="add-btn">Close</button>
            <p>{statusMsg}</p>
          </div>
        </div>
      )}
      {/* MODAL ZA JOIN (REGISTRACIJU) */}
      {showJoinModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create Account</h2>
            <input 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleJoin} className="add-btn">Sign Up</button>
            <button onClick={() => setShowJoinModal(false)} className="logout-btn">Cancel</button>
            
            {statusMsg && <p className="status-msg">{statusMsg}</p>}
          </div>
        </div>
      )}

      <div className="blob-outer-container">
        <div className="blob-inner-container"><div className="blob"></div></div>
      </div>

      <header className="top-bar">
        {/* Kontejner za logo sliku */}
        <div className="logo-container">
          <img src={logoImage} alt="Logo" className="logo-img" />
        </div>
        <div className="auth-buttons">
          {!isLoggedIn ? (
            <>
              <button onClick={() => setShowLoginModal(true)}>Login</button>
              <button onClick={() => setShowJoinModal(true)}>Join</button>
            </>
          ) : (
            <div className="user-info">
              <span>Welcome, {username}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      <div className="main-container">
        <div className="outer-wrapper">
          <div className="calendar">
            <div className="calendar-header">
              {/* MESEC SA STRELICAMA */}
              <div className="month-picker-nav">
                <span className="year-change" onClick={() => changeMonth(-1)}>{"<"}</span>
                <span className="month-display">{month_names[currMonth]}</span>
                <span className="year-change" onClick={() => changeMonth(1)}>{">"}</span>
              </div>
              {/* GODINA SA STRELICAMA */}
              <div className="year-picker">
                <span className="year-change" onClick={() => setCurrYear(currYear - 1)}>{"<"}</span>
                <span>{currYear}</span>
                <span className="year-change" onClick={() => setCurrYear(currYear + 1)}>{">"}</span>
              </div>
            </div>

            <div className="calendar-body">
              <div className="calendar-week-days">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>
              <div className="calendar-days">
                {Array.from({ length: new Date(currYear, currMonth, 1).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="empty-day"></div>
                ))}
                {Array.from({ length: daysInMonth[currMonth] }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === new Date().getDate() && 
                                  currMonth === new Date().getMonth() && 
                                  currYear === new Date().getFullYear();
                  return (
                    <div key={day} className={isToday ? "current-date" : ""} onClick={() => handleDayClick(day)}>
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="todo-list">
          <h2>To-Do List</h2>
          <p>Datum: {selectedDate || "Select a date"}</p>
          <textarea
            rows={10}
            placeholder={isLoggedIn ? "Unesi svoj zadatak..." : "Prijavite se da biste pisali..."}
            value={taskList}
            disabled={!isLoggedIn}
            onChange={(e) => setTaskList(e.target.value)}
          />
          <button className="add-btn" onClick={handleAddTask} disabled={!isLoggedIn}>
            Add / Update
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
