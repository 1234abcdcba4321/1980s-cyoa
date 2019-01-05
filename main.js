"use strict"

let day = 1;
let year = 0; //time units. The game will advance 1 year every 365 days and the game will end after year 9.
let happiness = 0; //less happiness will block off options and make the game generally harder.

function updateDisplay() {
    document.getElementById("header").innerHTML = "198"+year+", day "+day+"<br>Happiness: "+happiness;
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





setInterval(advanceDay,60000,1); //automatically advance 1 day every minute. time waits for no one!