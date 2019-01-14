"use strict"

let day = 1;
let year = 0; //time units. The game will advance 1 year every 365 days and the game will end after year 9.
let happiness = 0; //less happiness will block off options and make the game generally harder.

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const MONTH_START = [0,31,59,90,120,151,181,212,243,273,304,334]
function monthDisplay(d) { //convert an amount of days into a month and date
    for (let i=11;i>=0;i--) {
        if (d > MONTH_START[i]) return MONTHS[i] + " " + (d-MONTH_START[i])
    }
}

function updateDisplay() {
    document.getElementById("header").innerHTML = monthDisplay(day)+", 198"+year+"<br>Happiness: "+happiness;
}
function advanceDays(days) {
    happiness *= 0.99**days; //you lose 1% of your happiness, whether positive or negative, per day.
    day += days;
    if (day > 365) {
        day -= 365;
        year++;
        if (year == 10) gameEnd();
    }
    updateDisplay();
}
function gameEnd() {
    //the end of the game. function not created yet.
}



setInterval(advanceDays,60000,1); //automatically advance 1 day every minute. time waits for no one!