//"use strict"

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
    document.getElementById("header1").innerHTML = monthDisplay(day)+", 198"+year+", Happiness: "+happiness
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
function addText(text) {
    if (!text) return false;
    document.getElementById("body").innerHTML += "<br>"+text;
}

const newsRead = [[],[],[],[],[],[],[],[],[],[]]

function getNews() {
    let j = NEWS[year].length-1;
    while (day < NEWS[year][j][1]) j--;
    while (j>=0) {
        if (!newsRead[year].includes(j)) {
            newsRead[year].push(j);
            return NEWS[year][j][0];
        }
        j--;
    }
    for (let i=year-1;i>=0;i--) {
        for (j=NEWS[i].length;j>=0;j--) {
            if (!newsRead[i].includes(j)) {
                newsRead[i].push(j)
                return NEWS[i][j][0];
            }
        }
    }
    if (newsRead[9].includes(newsRead[9].length-1)) giveAchievement(0) //potentially unlock auto-news? or on a route
    return "There is no news left for you to read."
}

let achievements = JSON.parse(localStorage.getItem("1980achievements"));
if (!achievements) achievements=[];

function giveAchievement(id) {
    if (achievements.includes(id)) return false;
    console.log("awarded achievement: "+id);
    achievements.push(id);
    localStorage.setItem("1980achievements",JSON.stringify(achievements));
}

setInterval(advanceDays,60000,1); //automatically advance 1 day every minute. time waits for no one!

function init() {
    updateDisplay()
}