//"use strict"

let day = 1;
let year = 0; //time units. The game will advance 1 year every 365 days and the game will end after year 9.
let happiness = 0; //less happiness will block off options and make the game generally harder.
let money = 20;
let affection = [0,0]; //Alex and Natalie.
let spAffection = [0,0]; //special - fucking
let specialEvents = [false,0,false,0];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_START = [0,31,59,90,120,151,181,212,243,273,304,334];
function monthDisplay(d) { //convert an amount of days into a month and date
    for (let i=11;i>=0;i--) {
        if (d > MONTH_START[i]) return MONTHS[i] + " " + (d-MONTH_START[i]);
    }
}

function updateDisplay() {
    let happyDisplay;
    if (happiness < -35) happyDisplay = "Extremelyer sad-" +(-happiness-35)
    else if (happiness < -20) happyDisplay = "Extremely sad"
    else if (happiness < -10) happyDisplay = "Very sad"
    else if (happiness < -3) happyDisplay = "Sad"
    else if (happiness < 5) happyDisplay = "Neutral"
    else if (happiness < 15) happyDisplay = "Happy"
    else if (happiness < 25) happyDisplay = "Very happy"
    else if (happiness < 40) happyDisplay = "Extremely happy"
    else if (happiness < 60) happyDisplay = "Extremelyer happy"
    else if (happiness < 85) happyDisplay = "Extremelyerest happy" + happiness > 70? "+"+happiness-70 :""
    else happyDisplay = "Extremelyerester happy+" +happiness-85 
    document.getElementById("header1").innerHTML = monthDisplay(day)+", 198"+year+"; Mood: "+happyDisplay+"; Money: $"+money;

    if (affection[0] < -5 || affection[0]/2+happiness < -10) document.getElementById("hangalex").style.display = "none";
    else if (affection[0] > 0 || affection[0]/2+happiness > -5) document.getElementById("hangalex").style.display = "block";
    if (affection[1] < -5 || affection[1]/2+happiness < -10) document.getElementById("hangnat").style.display = "none"; //you can't hang out if you aren't close, or you're unhappy!
    else if (affection[1] > 0 || affection[1]/2+happiness > -5) document.getElementById("hangnat").style.display = "block"; //and once you aren't hanging out, it takes a bit to be able to again

    document.getElementById("starwars").style.display = year==3&& day>175&&day<235 &&!specialEvents[0]&& happiness*5>day-200 &&money>2.7?"block":"none"; //2 months because it'd be lame if you missed it
}
function advanceDays(days,auto) {
    happiness *= 0.99**days; //you lose 1% of your happiness, whether positive or negative, per day.
    affection[0] *= 0.998**days; //People's bonds don't last forever. Be careful with them.
    affection[1] *= 0.998**days;
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
    if (year>0 && Math.random()>=(0.9999-happiness/100000)**days && !specialEvents[1]) { //40 happiness makes it a 0.05% chance, which i think is reasonable.
        addText("You see an open spot for a job you could probably get. It pays better than your current one...");
        specialEvents[1]++;
        document.getElementById("job").style.display = "block";
    } else if (specialEvents[1]===2) {
        money += days/10 //$0.10 per day income, which is actually a lot for this game...
        happiness -= days/30 //has a downside in that the work is really hard. Minor effect tho
    }

    if (!auto) achCheck[0] = false;
    if (autonews) autoNews(true);
    updateDisplay();
}
function gameEnd() { //the end of the game.
    if (achCheck[0]) giveAchievement(1);
    document.getElementById("header").style.display = "none"
    pauseWorld()

    addText("<hr><b>1990 - The End!</b>");
    if (Math.random() < 0.01) {
        giveAchievement(2);
        if (Math.random() < 0.01) addText("You're truly lucky! Have some lucky numbers: "+Math.random()+" "+Math.random()+" "+Math.random())
    }
    addText("Over the 10 years, you've done plenty. Here's the outcome of your journey...<br>");
    if (spAffection[1] > 3+spAffection[0] && affection[1] > 45) { //partner with Nat
        if (spAffection[0]) {
            addText("There's some lingering regrets from your sex with Alex, and eventually it got out.");
            if ((affection[1]-affection[0])/10 > 8+spAffection[0]) addText("Despite this, Natalie is willing to accept that you've left Alex and that was just a regret from long ago.");
            else addText("This isn't enough to make Natalie leave you, but you can tell that she's not happy about this.")
        } else addText("You continued your relationship. It went well into the end of life. Natalie even produced some children, in the end.");
    } else if (spAffection[0] > 3+spAffection[1] && affection[0] > 45) { //partner with Alex
        if (spAffection[1]) {
            addText("Alex dug at some point and found your sex with Natalie.");
            if ((affection[0]-affection[1])/10 > 8+spAffection[1]) addText("He doesn't really care, since you don't seem to be fucking her anymore.");
            else addText("He just wants to make sure you don't plan on cheating on him, not that you do.");
        } else addText("You continued your life as it would go normally. Alex really loves you, and you love him.");
    } else if (affection[0] + affection[1] < 10) { //loner - not with either
        addText("You became a loner, who isn't very capable of going out in public.");
        if (spAffection[0]&&spAffection[1]) addText("You'd rather bait people to try to get them to do what you want. It works, but it's not really friendship.");
        else if (spAffection[0]||spAffection[1]) addText("While you've had some success in the past, you've been unable to replicate the highs of youth.");
        else if (happiness > 15) addText("However, your joys in life involve solitude. You don't really need anyone else to make you happy.");
        else addText("You're not really sure if there's a reason to keep doing what you are. You really need to figure out how to talk to people.");
    } else if (spAffection[0] > 3 && spAffection[1] > 3 && affection[0] > 45 && affection[1] > 45) { //partner with both!
        addText("You end up in a weird state where you love two people, but marrying two people is illegal.");
        addText("What wasn't obvious before was that both Alex and Natalie ended up loving each other too, forming a proper love triangle."); //reddit post - traditional love triangles are angles, not triangles
        addText("Life went about as well as it could be when having three people in a relationship.");
        giveAchievement(8);
    } else if (spAffection[1]+spAffection[0] > 6) addText("You aren't really sure who you want to be with, but you know it's one of those two. It's time to make a choice.")
    else if (spAffection[1]&&spAffection[0]) addText("While you've fucked people before, you're constantly on the path of finding new people for a quick night stand. This method works, as you've never really been able to get a long-term relationship.")
    else if (!spAffection[1] && (spAffection[0] || affection[0]-10 > affection[1])) addText("You're fresh new into your relationship with Alex. Who knows how it'll turn out?");
    else if (spAffection[1] || affection[1]-10 > affection[0]) addText("What's in store for the future? Only time will tell. Write your fanfictions now.");
    else addText("You've managed to take a nearly equal liking to both of them.")
    addText("<br>You finished with "+affection[0]+" points for Alex and "+affection[1]+" points for Natalie. Your game skill with Alex's competition is "+alexGameSkill+" and you won "+specialEvents[3]+" times.");
    addText("You have a streak of "+alexStreak+ "for picking what Alex wants to do next, and a streak of "+clothesStreak+" for picking the right clothes.");
    if (spAffection[0]&&spAffection[1]) addText("You fucked Alex "+spAffection[0]+" times and Natalie "+spAffection[1]+" times.");
    else if (spAffection[0]||spAffection[1]) addText("You fucked "+spAffection[0]? "Alex ":"Natalie "+Math.max(spAffection[0],spAffection[1]) +" times.")
    addText("<hr>To play again and take a different path, refresh the page! The game will save any achievements you've gotten.")
}
function addText(text) {
    if (!text) return false;
    document.getElementById("body").innerHTML += "<br>"+text;
}
document.getElementById("work").onclick = function() {
    money += 2;
    happiness -= 0.05; //missing out on whole days to do work...
    advanceDays(specialEvents[1]===2 ?1:2);
}

///////////////news
const newsRead = [[],[],[],[],[],[],[],[],[],[]];

document.getElementById("newsbtn").onclick = function(force) {
    const msg = getNews();
    if (msg) {
        if (force) advanceDays(1);
        addText(msg);
        if (specialEvents[2] && !force) document.getElementById("newsbtn").onclick(false); //apparently clicking the button returns an object
    } else {
        if (newsRead[9].includes(newsRead[9].length-1)) giveAchievement(0);
        addText("There is no news left for you to read.");
    }
}
let autonews = false;
document.getElementById("autonews").onclick = function() {
    if (year>0 && !confirm("Are you sure you would like to enable auto-news? It will skip a lot of days!")) return;
    autonews=true;
    document.getElementById("autonews").style.display="none";
    autoNews();
    addText("Auto-news has been enabled.");
}
function autoNews(force) {
    let msg = getNews();
    if (msg) {
        addText(msg);
        if (force) {
            advanceDays(1);
            if (specialEvents[2]) autoNews(false);
        }
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
    ["Real news","The achievement name is a reference to <i>Antimatter Dimensions</i> (2017).","Read every news message. Unlocks auto-news, not that you'll need it anymore."],
    ["True idle","Every 60 seconds, one day advances automatically.","Reach the end without passing any days except by idling. Unlocks an advance day button."],
    ["Just plain lucky","You have a 1% chance to get this achievement every time you win.","There's a 0.01% chance to get a secret message when you win!"],
    ["A code diver","This game is open source.","Well now the rest of the achievements are trivial."],
    ["Star Wars party","Three's enough for it to count as a party, right?","Watch Star Wars with both Alex and Natalie together."],
    ["Money sharer","What better to do with money than to share it?","Give out a lot of money to Natalie and her friends."],
    ["Extreme Intimacy","If you do it enough, the novelty goes away and it's more of a routine.","Have sex with either character 5 times."],
    ["Game Master","Just get really good at games.","Beat Alex 10 times in the professional game."],
    ["Love Triangle","Create a proper love triangle.","Get the best ending."]
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
const EVENTS = [ [0,180,function() {
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
}],
[11,0,0] ];//filler to prevent it from breaking

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

document.getElementById("starwars").onclick = function() {
    money -= 2.7; happiness++;
    specialEvents[0] = true;
    if (affection[0]<0 && affection[1]<2) {
        addText("You go to the movie theater. The show was nice, but it'd be better if there was less people.")
        happiness+=0.5;
    } else if (affection[0]>30 && affection[1]>32) {
        addText("You bring both Alex and Natalie to watch Star Wars. They both love it, though Alex critically points out everything bad and Natalie does her best to defend the show because she can't stand someone complaining so much about the minor details of something great (much like she does for clothes).");
        addText("You enjoyed the show, but most of Alex's points make sense. In the end, you're all looking forward to watching more shows.");
        giveAchievement(4); //this is the main reward for actually hanging out with both of them.
        happiness++; affection[0]++; affection[1]++;
    } else if (affection[0]>affection[1]-2) {
        addText("You go watch <i>Star Wars: Return of the Jedi</i> with Alex. After the show, he gives a large amount of criticisms about the show.");
        affection[0]++;
    } else {
        addText("This particular episode of Star Wars was better than the last two. Natalie seems to love it too, and won't take anything bad about it.");
        affection[1]++;
    }
    updateDisplay();
}
document.getElementById("job").onclick = function() {
    document.getElementById("job").style.display = "none";
    addText("You sign up for a new job as a Switchboard Operator.");
    if (Math.random() > happiness/30+0.3) {
        addText("However, you didn't make it. Some of the other applicants were just better.");
        happiness--;
        specialEvents[1]--;
        return;
    }
    addText("This job will provide you with a small amount of extra cash without needing to work overtime.")
    specialEvents[1]++;
}

let alexStreak = 0;
let alexNext = "chat";
function alexAction(choice) {
    let ret = alexNext===choice;
    if (alexNext !== choice) {
        addText("Alex tells you that he wanted to <b>"+alexNext+"</b> instead, but will still go along with your offer.");
        happiness--; affection[0]--;
        alexStreak = 0;
    } else {
        alexStreak++;
        affection[0]+=Math.min(alexStreak,4*alexStreak**0.7)/300; //real nice ^1 scaling so that if you continuously hang out how Alex wants you can actually get somewhere... to an extent.
    }
    unpauseWorld();
    document.getElementById("alexselect").style.display="none";
    alexNext = "chat";
    return ret;
}
document.getElementById("hangalex").onclick = function() {
    affection[0]+=0.05
    pauseWorld()
    document.getElementById("alexselect").style.display="block";
}
document.getElementById("alexchat").onclick = function() {
    advanceDays(4); //shorter than Nat since these are really just here to enable a different action
    alexAction("chat")
    addText("You talk with Alex about games and life.");
    switch (Math.floor(Math.random()*5)) {
        case 0: addText("Alex is criticizing some things in your last games, and helping you improve. He seems to want to just keep talking about random things, and not much really shows up.");
        break; case 1:
        addText("At some point, Alex challenges you to a game. It's a tempting offer.");
        alexNext = "compete";
        break; case 2:
        addText("Alex was looking at advertisements and found something he wants. It could be nice to go out with him.");
        alexNext = "shop";
        break; case 3:
        addText("Alex expresses interest in playing some more board games.");
        alexNext = "play";
        break; case 4:
        if (spAffection[0]) {
            addText("Alex definitely wants to have sex again. He's not even hiding it.");
            alexNext = "fuck";
        } else if (affection[0] > 40) {
            addText("Alex brings up the prospect of having sex. It might actually be a good idea...")
            document.getElementById("alexFuck").style.display = "block";
            alexNext = "fuck";
        } else addText("Things are good.");
    }
    updateDisplay();
}
document.getElementById("alexhome").onclick = function() {
    advanceDays(4);
    alexAction("play");
    switch (Math.floor(Math.random()*3)) {
        case 0:
        addText("You have a chess tournament with Alex. You're both bad.");
        if (happiness < Math.min(year,affection[0])) {
            addText("Alex notices that you're a little out of it, so he makes it quite a bit easier... but you end up still losing.");
            happiness-=3; affection[0]++;
        } else if (Math.random()*40+year > happiness) {
            addText("But Alex seems to have beat you. It was close!");
            happiness--; affection[0]++;
        } else if (Math.random()*50+year > happiness) {
            addText("And you won the tournament, fair and square.");
            happiness++;
        } else {
            addText("Actually, you were doing really well. Or he was out of it. You're not too sure.");
            affection[0]+=2;
        }
        break; case 1:
        addText("You two have a go at your favorite quiz shows. Alex is very good in some categories but is hopeless in everything else.");
        if (Math.random() < 1/3) {
            addText("Many of the questions were in Alex's speciality.");
            if (affection[0] > 60 && affection[0]/2+happiness > 60) {
                addText("But having spent so much time with him, you were able to compete. Still lost, but you're getting there.");
                happiness+=3;
            } else addText("He's really good at this, so you got blown out of the water. Hopefully you get more lucky next time.");
            affection[0]+=2;
        } else if (Math.random() < 0.5) {
            if (affection[1] > 5) addText("Many of the questions seemed like the thing Natalie would be into. If only she were here...");
            else addText("Many of the questions seemed to fit what the girls are into a bit more.");
            if (affection[1] > Math.random()*15 && happiness > Math.random()*15) {
                addText("You didn't do amazingly, but you don't need to do amazingly to beat someone who's more clueless than you are. What you learned from Natalie was really helpful.");
                happiness+=2; affection[1]++;
            } else {
                addText("You both did super terribly, and it was only a stroke of luck that you ended up with a draw. Alex asks for a rematch.");
                happiness-=2;
                alexNext = "play";
            }
        } else {
            addText("The questions were balanced, which led to the challenges being a true test of resolve.");
            affection[0]--;
            if (happiness > Math.random()*60) {
                addText("You managed to win, though. This contest was really tough.")
                happiness++;
            } else if (happiness+5 < Math.random()*(year+5)) {
                addText("Alex realizes that you're fairly out of it and aggressively asks you to get back in.")
                happiness-=3; affection[0]-=3;
            } else {
                addText("Alex barely won. Maybe next time.")
                happiness--;
            }
        }
        break; case 2:
        advanceDays(3+Math.floor(Math.random()*15)) //min 7 days, max 21 :D
        addText("The game is completely about the dice. It's time for a frustrating game of Monopoly with Alex and friends!");
        let nat = false;
        if (affection[1] > 25) {
            addText("You invited Natalie, too.");
            nat = true;
        }
        if (Math.random() < 0.125) {
            addText("You won. That took way too long.")
            happiness++;
        } else if (Math.random() < 1/7) {
            addText("Alex won. Why does Monopoly take so long?");
            happiness-=0.25; affection[0]+=0.5;
        } else if (Math.random() < 1/6) {
            addText("John won. It turns out that John is a sore winner and likes to ruin everyone's experience...");
            happiness--;
            if (nat) affection[1]--;
        } else if (nat && Math.random() < 1/5) {
            addText("Natalie doesn't actually like games like this that much, but she ended up winning...");
            affection[1]++;
        } else addText("The game was pretty boring, though you did manage to make second place.");
    }
    updateDisplay();
}

document.getElementById("alexshop").onclick = function() {
    advanceDays(4);
    alexAction("shop");
    addText("Alex goes to buy something random that he saw was available, mostly ignoring what you need. Which gives you time to buy what you want yourself.");
    if (money-11 < Math.random()*20) {
        addText("Too bad there's not much you want to buy. Why does he always ditch like this?");
        happiness--;
    } else {
        addText("You find things to buy while Alex is doing his own thing. In the end, it costs $5.")
        money-=5;
        if (affection[1] > 10) {
            addText("Later, you give Natalie the present you bought. She likes it!");
            affection[1]+=2.5;
        }
    }
    addText("Later, Alex offers to buy some food before going into the arcade. It's pretty standard, so of course you're going.");
    if (money < 6) {
        addText("Due to your poorness, Alex is willing to cover the costs of what will be your hardcore gaming session.");
        affection[0]-=money/10; happiness-=money/20; money=6;
    }
    addText("It goes the same as normal. You end up using a total of $6 for everything that happens.");
    affection[0]+=2; happiness++; money-=6;
    if (alexGameSkill < 25) alexGameSkill+=(25-alexGameSkill)/25;
    updateDisplay();
}

let alexGameSkill = 0;
document.getElementById("alexcompete").onclick = function() {
    advanceDays(7);
    alexAction("compete");
    addText("You crowd around Alex's TV in order to do some pro challenges.");
    if (alexGameSkill < 10) {
        addText("Alex is amazing at games and you're less so, but you're definitely getting there.");
        addText("You really just don't stand a chance, so instead he uses this opportunity to help you get better at the game.");
        affection[0]++; happiness-=2;
        alexGameSkill+=Math.random()*4;
    } else if (alexGameSkill < 25) {
        addText("You're getting better at the game, so it's harder for Alex to keep training you. You actually manage to win in the little challenges sometimes!");
        affection[0]+=0.5;
        alexGameSkill+=Math.random()*5;
    } else if (alexGameSkill+happiness < 75+specialEvents[3]*3+Math.random()*100) {
        addText("You actually managed to hold your own against Alex, somehow. He doesn't go easy, but now that you won you don't need to get trained any longer~!");
        happiness+=3; affection[0]++;
        if (!specialEvents[3]) {happiness+=3; affection[0]+=3; affection[1]-=3}
        alexGameSkill+=Math.random()*5;
        specialEvents[3]++;
        if (specialEvents[3] > 10) giveAchievement(7);
    } else if (specialEvents[3]) {
        addText("You lost, but Alex just tells you to keep trying until you win again.");
        happiness--; affection[0]++;
        alexGameSkill+=Math.random()*3;
    } else {
        addText("While Alex thinks you should be capable of beating him by now, you still lose and so he teaches you some more tricks.");
        affection[0]+=1.5; happiness-=2;
        alexGameSkill+=Math.random()*5;
    }
    updateDisplay();
}

document.getElementById("alexfuck").onclick = function() {
    if (alexAction("fuck")) {
        addText("It's a bit better than normal since Alex wanted to do it for a while beforehand.")
        affection[0]++; happiness++;
    }
    spAffection[0]++;
    happiness+=2;
    if (spAffection[0]==1) {
        addText("Having sex isn't too foreign of a concept, but it's something that's in the path of things to do.");
        affection[0]+=4; happiness+=4;
        if (spAffection[1]) {
            addText("Natalie's sex doesn't get mentioned here. The longer you can delay them finding out, the better...?");
            affection[1]-=4;
        }
    } else if (spAffection[0] < 5) {
        addText("Sex is basically the same as it always is by now, since you did everything this way the first time too.");
        affection[1]+=2;
    }
    else {
        addText("Just another day.")
        giveAchievement(6)
    }
    updateDisplay();
}

document.getElementById("hangnat").onclick = function() {
    affection[1]+=0.05
    clothesSelect("hang",true)
}
let clothesStreak = 0;
let clothesOccasion;
function clothesSelect(occasion,quit) {
    pauseWorld()
    document.getElementById("natclothes").style.display="block";
    document.getElementById("natquit").style.display=quit?"block":"none";
    clothesOccasion = occasion;
}
function hideClothes(quit) {
    unpauseWorld()
    document.getElementById("natclothes").style.display="none";
    if (quit) return;
    clothesStreak++;
    affection[1]+=0.06+clothesStreak**0.7/250;
    happiness += 0.03+clothesStreak**0.75/250; //streak is critical for gaining happiness in this manner.
}
function clothesFail(msg) { //strict penalties for doing bad. I really want the player to think, especially since I give infinite time.
    if (msg) addText('"'+msg+'"');
    money-=2;
    happiness-=0.4;
    affection[1]--;
    clothesStreak = 0;
}
document.getElementById("natsubmit").onclick = function() {
    let top = document.getElementById("nattop").value;
    let bottom = document.getElementById("natbottom").value;
    if (!top || !bottom) {
        addText("You need to actually select clothes...");
        return;
    }
    switch (clothesOccasion) {
        case "hang":
        if (year < 4) {
            if (top!="sweater"&&top!="croptop") clothesFail("A "+top+" is no good... At least wear fashionable clothes.");
            else if (bottom!="skirt"&&bottom!="tights"&&bottom!="slacks") clothesFail("Your "+bottom+" doesn't really fit in with society right now.");
            else natHang(top,bottom);
        }
        else if (year < 7) {
            if (top!="trenchcoat"&&top!="bustier"&&top!="jumpsuit") clothesFail("That "+top+" is soooooo out of fashion.");
            else if (bottom!="skirt"&&bottom!="miniskirt") clothesFail("A "+bottom+"? I'd rethink that choice; we're going out in <i>public</i> here!");
            else natHang(top,bottom);
        } else {
            if (top!="jacket"&&top!="jumpsuit") clothesFail("I wouldn't use that "+top+" if I were you.");
            else if (bottom!="miniskirt") clothesFail("It's been this long and you still don't know to not use a "+bottom+"...");
            else natHang(top,bottom);
        }
        break; case "prom":
        if (top=="jacket" || top=="sweater") {
            clothesFail("Do you know how hot it'd be in there?")
            updateDisplay();
            return;
        }
        hideClothes();
        let clothesPoints = 0;
        switch (top) {
            case "croptop": clothesPoints++;
            case "bustier": clothesPoints++;
            case "jumpsuit": clothesPoints++;
        }
        switch (bottom) {
            case "dress": clothesPoints++;
            case "skirt": clothesPoints++;
            case "miniskirt": clothesPoints++;
        }
        if (clothesPoints==6) {
            addText("People are really complimenting you on your clothes. You almost feel like you fit in!");
            addText("Natalie admits that she'd be less willing to do stuff if you were wearing something less proper.");
            affection[1]++; happiness++;
        } else if (clothesPoints > 3) {
            addText("After you show up, you see all of the weird outfits people came in and how they're treated slightly differently than the ones that wear expected clothes.");
            addText("You still fit in well enough though, especially as Natalie is here to help keep up appearances.")
            affection[1]+=1.5;
        } else if (clothesPoints > 1) {
            addText("Right when you enter, you realize how much more streamlined the majority of the room's clothes are. Natalie was nice enough to wear the same things you did, though!");
            affection[1]+=2; happiness--;
        } else {
            addText("You look... bad. Being unique is usually celebrated, but it's always better to follow trends than to try to set a new one.");
            happiness--;
        }
        if (Math.random() > 0.5) {
            if (affection[0] > 10) {
                addText("You catch some people (including Alex) spiking the punch. You're not sure if they'll be successful, so you just help them out.");
                affection[0]++;
            } else {
                addText("You catch some people spiking the punch. Oh well; guess you're not having any now.");
                happiness--;
            }
        } else {
            addText("You go get a non-alchholic drink with Natalie, but don't realize that the punch has been spiked. You catch yourself fairly quickly, and just get out.");
            if (affection[1]/10 > 0.5+Math.random()) {
                addText("You pull Natalie out too. She seems to have been taken hard by it... Has she even drunk before?");
                affection[1]+=3; happiness--;
            } else if (Math.random() < 0.4) {
                if (affection[0] > 5) {
                    addText("Alex told you later that Natalie might've gotten seriously hurt in there if he didn't use his influence to stop people.");
                    affection[0]++; affection[1]--; happiness--;
                }
                addText("After, you learned that Natalie was absolutely not okay in there, and that you should've been a better friend.");
                affection[1]-=3; happiness-=3;
            } else {
                addText("You left Natalie alone, but she seems to have not suffered excessive losses. There were better people for the guys to flirt with, anyway.");
                affection[1]-=2;
            }
        }
        break;
    }
    updateDisplay();
}
function natHang(top,bottom) {
    hideClothes();
    const options = ["chat"];
    if (Math.random() < 0.5) {
        if (Math.random()*money > 10) options.push("shop");
        if (day > 140 && day < 270) {
            if (affection[1] > 10) options.push("pool");
            if (Math.random()+1 < money/2) options.push("beach");
        } else if (day < 90) options.push("winter")
        if (affection[1]+spAffection[1]+Math.random()*10 > 45-year && top!="trenchcoat"&&top!="jacket") options.push("fuck");
    }
    let alex=false; //seems to break to have two lets in the same switch so i just won't
    switch (options[Math.floor(Math.random()*options.length)]) {
        case "chat":
        advanceDays(7);
        addText("You chat with Natalie and her other friends for a while.");
        switch (Math.floor(Math.random()*5)) {
            case 0:
            addText("Today was an especially fun day. Why is it that politics isn't normally a thing you're allowed to talk about? Other than the massive disagreements between people, of course...");
            happiness+=0.5; affection[1]-=0.25;
            break; case 1:
            addText("The recent drama around school and work varies between all the people. But in the end, they all have the same kind of theme.");
            happiness++; affection[1]++;
            break; case 2:
            addText("Your throat hurts. Probably shouldn't laugh so much, next time.");
            happiness+=2; affection[1]++;
            break; case 3:
            addText("These people are really bad at some things. That's fine though, since you are too.");
            happiness-=0.25; affection[1]++;
            break; case 4:
            addText("No matter how long you go, it seems like you never run out of conversation topics.");
            affection[1]++;
            advanceDays(7);
        };
        break; case "shop":
        advanceDays(7);
        addText("You go shopping with Natalie and her other friends. There's a lot to buy!");
        switch (Math.floor(Math.random()*5)) {
            case 0:
            if (specialEvents[2]) {
                addText("You didn't find anything of value to buy, so you just went to chat instead.");
                affection[1]+=0.25; return;
            }
            alert("You come upon a $120 laptop while shopping. It would be pretty useful for keeping up with news, though it's a little expensive...")
            if (money >= 120) {
                if (confirm("Would you like to buy it?")) {
                    money -= 120; happiness++; affection[1]--;
                    specialEvents[2] = true;
                } else addText("There isn't much else to buy.");
            } else if (money + affection[0]*2 > 120) {
                if (confirm("But since you're poor, Natalie could supply a bit of money for you to get it.")) {
                    affection[1]-=12-money/5; money=0;
                    specialEvents[2] = true;
                } else addText("There isn't much else to buy.");
            } else addText("However, you can't afford it, and there's nothing else to buy.");
            break; case 1:
            addText("You go clothes shopping. Natalie is as stingy as always with your clothes. In the end, you spend $10 on what seems like good clothes.");
            money-=10; affection[1]+=2;
            break; case 2:
            addText("The food at this mall is good, but Natalie really loves it more than what seems healthy.");
            money-=10; happiness+=2; affection[1]+=2;
            break; case 3:
            addText("Natalie has some weird preferences for things sometimes. She tells you why when you ask, but so many of them are weird enough that they feel like excuses for her to expand her collection.");
            affection[1]+=6;
            break; case 4:
            addText("You accidentally stay for a little too long. These deals are so great, even though you repeatedly tell the group that a 15% sale is really insignificant...");
            if (money > 80) {
                addText("You're sorta rich, and you managed to get everything the group wanted. It costed $80 in total.");
                giveAchievement(5)
                affection[1]+=13; happiness+=8; money-=80; //13 lmao
            } else if (money > 35) {
                addText("You actually spent all of your money though, and even gave away $"+money-35+" to buy what the group wanted, too.");
                affection[1]+=money/5-7; happiness+=7; money=0;
            } else {
                addText("Due to how little money you have, you weren't really able to buy everything you wanted; though it was still fun.");
                happiness+=money/5; money=0;
            }
            advanceDays(7);
        };
        break; case "pool":
        advanceDays(7);
        addText("One of Natalie's friends have a pool. You can use it to play around.");
        if (Math.random()*40 < affection[0]-5) {
            addText("Alex is around too. He's fine with hanging out with the group.");
            affection[0]++; affection[1]--; happiness++;
            alex = true;
        }
        if (Math.random() < 0.5) {
            addText("Today was a little hot, but time spent in the pool is always full of laughing and getting splashed a lot.");
            affection[1]++; happiness+=4;
        } else if (alex) {
            addText("Alex was actually a nice addition to the group. He managed to win a lot of these games, as he takes them extremely seriously.");
            affection[0]++; happiness+=2;
        } else {
            addText("Things worked out around how you'd expect it to. It's easy to accidentally hurt someone!");
            happiness--;
        }
        break; case "beach":
        advanceDays(14); //I need something that lasts longer :/
        money -= 2; happiness+=3;
        addText("Today seems like a good day to go out somewhere farther from home than usual.");
        if (Math.random()*40 < affection[0]-5) {
            addText("Alex is around too. He's fine with hanging out with the group.");
            affection[0]++; happiness++;
            alex = true;
        }
        if (Math.random() < 0.1) {
            addText("More time was spent building an extremely sophisticated sandcastle than anything else.");
            affection[1]+=6; happiness+=3; if (alex) affection[0]+=3;
            advanceDays(7);
        } else if (alex && Math.random() < 0.5) {
            addText("Even though it's the middle of summer, it was pretty cold. Yet with how active you were through that day, it was good that it was.");
            affection[0]+=3; affection[1]+=3;
        } else addText("Today went pretty well. Some of Natalie's friends went out at some point to get some ice cream or something.");
        break; case "winter":
        advanceDays(7);
        addText("Natalie had the idea to play around in the snow. It went the same as always - making shapes in the snow, and sculptures too.");
        happiness++; affection[1]++;
        break; case "fuck":
        advanceDays(3)
        spAffection[1]++;
        happiness+=4;
        if (spAffection[1]==1) {
            addText("Since you're both of age, you wanted to try something very intimate. It's not ideal and it definitely should stay secret, but you're too far in now to ever back out.");
            addText("This is the sort of event that neither of you will really ever forget.");
            if (spAffection[0]) {
                addText("You don't tell her about your affairs with Alex. It'd be easier to ignore them, if anything.");
                happiness-=2; affection[0]-=4;
            } else happiness+=4; affection[1]+=4;
        }
        else if (spAffection[1]<5) addText("You try sex again. It's kind of like last time, but each time you try to add something new, so it ends up being different.");
        else {
            addText("You've been having sex a lot lately. You're glad it's part of your normal hangout repetroir.");
            giveAchievement(6);
        }
    }
    updateDisplay();
}

let partDays = 0;
function overTime() { //automatically advance 1 day every minute. time waits for no one!
    if (++partDays<30) return;
    partDays = 0;
    advanceDays(1,true);
}
let dayInterval = setInterval(overTime,2000);
function pauseWorld() {
    document.getElementById("actions").style.display="none";
    clearInterval(dayInterval);
}
function unpauseWorld() {
    document.getElementById("actions").style.display="block";
    dayInterval = setInterval(overTime,2000);
    updateDisplay();
}

function init() {
    if (achievements[0]) document.getElementById("autonews").style.display = "block"
    if (achievements[1]) document.getElementById("skipday").style.display = "block"
    updateDisplay()
}

/*
[25%] having internet -> 2 news/day
[50%] special event (grad party) - 0,180

done:
star wars release lets you watch movie (costs $$)
get a better job -> + passive income, overtime now only takes 1 day

ALEX - tech stuff like computers; game-y minis
NATALIE - fashion, music, art; trivia-y minis
JONATHAN - shady, gets into the black market and stuff
*/