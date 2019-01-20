//"use strict"

let day = 1;
let year = 0; //time units. The game will advance 1 year every 365 days and the game will end after year 9.
let happiness = 0; //less happiness will block off options and make the game generally harder.
let money = 20
let affection = [0,0]

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_START = [0,31,59,90,120,151,181,212,243,273,304,334];
function monthDisplay(d) { //convert an amount of days into a month and date
    for (let i=11;i>=0;i--) {
        if (d > MONTH_START[i]) return MONTHS[i] + " " + (d-MONTH_START[i]);
    }
}

function updateDisplay() {
    document.getElementById("header1").innerHTML = monthDisplay(day)+", 198"+year+"; Happiness: "+happiness+"; Money: "+money+"Bonds: Alex="+affection[0]+" Natalie="+affection[1]
}
function advanceDays(days,auto) {
    happiness *= 0.99**days; //you lose 1% of your happiness, whether positive or negative, per day.
    affection[0] *= 0.995**days; //People's bonds don't last forever. Be careful with them.
    affection[1] *= 0.995**days;
    day += days;
    if (day > 365) { //on day 365, you're onto a new year.
        day -= 365;
        year++;
        if (year == 10) gameEnd(); //game lasts a decade
    }

    let tempEvent = EVENTS[nextEvent]
    if (year>tempEvent[0] || year==tempEvent[0] && day>=tempEvent[1]) {
        nextEvent++;
        tempEvent[2];
    }
    if (!auto) achCheck[0] = false;
    if (autonews) autoNews();
    updateDisplay();
}
function gameEnd() { //the end of the game.
    if (achCheck[0]) giveAchievement(1);
    if (Math.random() < 0.01) {
        giveAchievement(2);
        if (Math.random() < 0.01) addText("You're truly lucky! Have some lucky numbers: "+Math.random()+" "+Math.random()+" "+Math.random())
    }
    document.getElementById("header").style.display = "none"
}
function addText(text) {
    if (!text) return false;
    document.getElementById("body").innerHTML += "<br>"+text;
}
document.getElementById("work").onclick = function() {
    money += 5;
    advanceDays(2);
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
    ["Just plain lucky","You have a 1% chance to get this achievement every time you win.","There's a 0.01% chance to get a secret message when you win!"],
    ["A code diver","This game is open source.","Well now the rest of the achievements are trivial."]
]
document.getElementById("achmenu").onclick = function() {
    const str = ["<br><b>Locked achievements:</b>","<br><br><b>Unlocked achievements:</b>"]
    for (let i=0;i<ACHIEVEMENTS.length;i++) {
        const base = "<br>"+ ACHIEVEMENTS[i][0] +" - ";
        if (achievements.includes(i)) str[1] += base + ACHIEVEMENTS[i][2];
        else str[0] += base + ACHIEVEMENTS[i][1];
    }
    if (achievements.length==0) str[1] += "<br>None yet! Completed achievements will appear here."
    if (achievements.length==ACHIEVEMENTS.length) addText("You've completed all of them. Thanks for playing!<br>Contact on Discord: slabdrill#7381<br>")
    else addText(str[0]+str[1]+"<hr>");
}

document.getElementById("miscinfo").onclick = function() {
    addText("Game made by slabdrill#7381. Any bugs and suggestions should be brought up to me there.");
    addText("This game is free to use if a link to the original page is easily accessible and it doesn't profit the owner.");
    addText("This game is not based off of real events. It was made for my grade 11 history class, and so a lot of it is based on the wikipedia pages for the 1980s.");
    addText("Your character doesn't have a predetermined sex or name. This is because it would be really annoying to create.");
    addText("The game doesn't save, so be sure to have a lot of time before playing. However, achievements save on local storage.")
}

let nextEvent = 0;
const EVENTS = [[0,180,prom()]];
function prom() {
    if (happiness < -10) addText("Prom is today. You don't really feel like going.");
    else if (affection[0]-5 > affection[1]) {
        if (confirm("Alex invited you to prom. Would you like to go?")) promAlex();
        else {
            addText("You tell him that you don't want to go.");
            affection[0] -= 5;
        }
    }
    else if (affection[1]-5 > affection[0]) {
        if (confirm("Natalie invited you to prom. Would you like to go?")) promNatalie();
        else {
            addText("You tell her that you have other people to go with. You don't.");
            affection[1] -= 5;
        }
    }
    else if (achCheck[0] || happiness < -5) addText("Prom is today, but you weren't invited, and don't care to invite anyone else.");
    else {
        let input = prompt("Prom is today. No one invited you, but perhaps you could invite someone.");
        switch(input.toUpperCase()) {
            case "ALEX":
            if (affection[0] < 5) addText("Alex has a better friend to go out with.");
            else {
                alert("Alex accepted your invitation!");
                promAlex();
            }
            break; case "NATALIE":
            if (affection[1] < 5) addText("Natalie has a better friend to go out with.");
            else {
                alert("Natalie accepted your invitation!");
                promNatalie();
            }
            break; case "CALVIN": case "DANG":
            addText("Hey, that's me! I'm not interested. Actually, that really depends on who you are. But probably not.");
            break; case "LESLIE": case "DICKSON":
            addText("Yourself isn't really a valid date...");
            break; case "NEGLIGENT OPEN YOUTUBE STUDIO FORUM TWEET HUNDRED SECRET PUBLIC VOID CLASSIC KEYWORD ACHIEVEMENT": //may change the code in the future
            giveAchievement(3);
            break; default:
            addText("You sent "+input+" an invitation, but "+Math.random()<0.5?"they already have someone":"they aren't interested in going"+". You decide to not go.")
        }
    }
    advanceDays(1);
}
function promAlex() {
    happiness += 2;
    let spiked = true;
    if (confirm("While dancing, you two share stories that you haven't really shared yet. Alex, also chatting with a few other people, asks about spiking the punch. Are you interested?")) alert("The attempt to spike the punch went pretty well. It's funny watching people fall for it.")
    else if (affection[0] > 10) {
        alert("\"That's a bummer.\", he says, ditching his friends to continue hanging out with you for the rest of the day. The attempt to spike the punch failed without his help.");
        affection[0]++;
    } else if (confirm("\"If you're not in for this, I'll do it and then come back with you after. You <i>sure</i> you don't wanna come?\"")) {
        alert("I knew that'd work! Thanks so much; we'll probably need your help.");
        affection[0]++; happiness++;
    } else {
        alert("\"Welp; that's all I've got. See you after it's done.\"");
        let spiked = false;
        affection[0]-=2; happiness--;
    }
    if (confirm("At some point, Alex brings you to the bar and offers a drink.")) {
        addText("It turns out, you get pretty bad when drunk and can't actually remember much. You both got a bad hangover, but he seems to not regret what happened.");
        affection[0]+=2; happiness--;
        if (spiked) {
            addText("Asking other people, it turns out you managed to fuck Brittany during that. The spiked punch managed to get her overly drunk, too. It's just part of life, really.");
            affection[1]--; happiness--;
        }
        advanceDays(1)
    } else if (affection[0] > 10) {
        addText("Alex joined you with not drinking. He's super cool like that! Sometimes, being around so many drunk people is exhausting...")
        affection[0]+=3; happiness-=0.5;
    } else if (spiked) {
        addText("You avoided drinking the punch, too. You really got to know the people when they were all drunk. It seemed like some of the girls even liked you!");
        affection[1]+=1.5; happiness+=2;
    } else {
        addText("No one really understands why you didn't really want to drink.");
        affection[0]--; affection[1]--; happiness-=2;
    }
}
function promNatalie() {
    happiness += 2;
    addText("But before you go, you need to pick out clothes! What do you wear?")
    clothesSelect("prom")
}

let clothesStreak = 0;
let clothesOccasion;
function clothesSelect(occasion) {
    document.getElementById("options").style.display="none";
    document.getElementById("natclothes").style.display="block";
    clearInterval(dayInterval);
    clothesOccasion = occasion;
}
function hideClothes() {
    document.getElementById("options").style.display="block";
    document.getElementById("natclothes").style.display="none";
    dayInterval = setInterval(advanceDays,60000,1);
    clothesStreak++;
    affection[1]+=0.08+clothesStreak**0.7/150; //streak helps a fairly large amount for garnering affection.
    happiness += 0.04+clothesStreak**0.75/150; //streak is critical for gaining happiness in this manner.
}
function clothesFail() { //strict penalties for doing bad. I really want the player to think, especially since I give infinite time.
    money-=2;
    happiness-=0.2;
    affection[1]-=0.3;
    clothesStreak = 0;
}
document.getElementById("natsubmit").onclick = function() {
    let top = document.getElementById("nattop").value;
    let bottom = document.getElementById("natbottom").value;
    switch (occasion) {
        case "prom":
        if (top=="jacket" || top=="turtleneck") {
            addText("\"Do you know how hot it'd be in there?\"");
            clothesFail()
        }
        break;
    }
}

let dayInterval = setInterval(advanceDays,60000,1,true); //automatically advance 1 day every minute. time waits for no one!

function init() {
    if (achievements[0]) document.getElementById("autonews").style.display = "block"
    if (achievements[1]) document.getElementById("skipday").style.display = "block"
    updateDisplay()
}

/*
having internet -> 2 news/day
special event (grad party) - 0,180
get a better job -> +1/d passive income, overtime now only takes 1 day
star wars release lets you watch movie (costs $$)

ALEX - tech stuff like computers; game-y minis
NATALIE - fashion, music, art; trivia-y minis
JONATHAN - shady, gets into the black market and stuff
*/