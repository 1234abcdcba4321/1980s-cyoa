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
function advanceDays(days,auto) {
    happiness *= 0.99**days; //you lose 1% of your happiness, whether positive or negative, per day.
    day += days;
    if (day > 365) { //on day 365, you're onto a new year.
        day -= 365;
        year++;
        if (year == 10) gameEnd(); //game lasts a decade
    }
    if (!auto) achCheck[0] = false;
    if (autonews) autoNews();
    updateDisplay();
}
function gameEnd() { //the end of the game.
    if (achCheck[0]) giveAchievement(1);
    document.getElementById("header").style.display = "none"
}
function addText(text) {
    if (!text) return false;
    document.getElementById("body").innerHTML += "<br>"+text;
}

///////////////news
const newsRead = [[],[],[],[],[],[],[],[],[],[]];

document.getElementById("newsbtn").onclick = function() {
    const msg = getNews();
    if (msg) {
        advanceDays(1);
        addText(msg);
    } else {
        if (newsRead[9].includes(newsRead[9].length-1)) giveAchievement(0);
        addText("There is no news left for you to read.");
    }
}
let autonews = false;
document.getElementById("autonews").onclick = function() {
    if (year>0) {
        if (!confirm("Are you sure you would like to enable auto-news? It will skip a lot of days!")) return;
    }
    autonews=true;
    document.getElementById("autonews").style.display="none";
    autoNews();
    addText("Auto-news has been enabled.");
}
function autoNews() {
    let msg = getNews();
    if (msg) {
        addText(msg);
        advanceDays(1)
    }
}

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
    return false
}

/////////////////achievements
let achievements = JSON.parse(localStorage.getItem("1980achievements"));
if (!achievements) achievements=[];
let achCheck = [true]

function giveAchievement(id) {
    if (achievements.includes(id)) return false;
    console.log(new Date().getTime()+": awarded achievement "+id);
    achievements.push(id);
    localStorage.setItem("1980achievements",JSON.stringify(achievements));
}
const ACHIEVEMENTS = [ //[name,locked desc,unlocked desc]
    ["Real news","???","Read every news message. Unlocks auto-news, not that you'll need it anymore."],
    ["True idle","Every 60 seconds, one day advances automatically.","Reach the end without passing any days except by idling. Unlocks an advance day button."],
]
document.getElementById("achmenu").onclick = function() {
    const str = ["<br><b>Locked achievements:</b>","<br><br><b>Unlocked achievements:</b>"]
    for (let i=0;i<ACHIEVEMENTS.length;i++) {
        const base = "<br>"+ ACHIEVEMENTS[i][0] +" - ";
        if (achievements.includes(i)) str[1] += base + ACHIEVEMENTS[i][2];
        else str[0] += base + ACHIEVEMENTS[i][1];
    }
    if (achievements.length==0) str[1] += "<br>None yet! Completed achievements will appear here."
    if (achievements.length==ACHIEVEMENTS.length) str[0] += "You've completed all of them. Thanks for playing!<br>Contact on Discord: slabdrill#7381"
    addText(str[0]+str[1]+"<hr>");
}

setInterval(advanceDays,60000,1,true); //automatically advance 1 day every minute. time waits for no one!

function init() {
    if (achievements[0]) document.getElementById("autonews").style.display = "block"
    if (achievements[1]) document.getElementById("skipday").style.display = "block"
    updateDisplay()
}