//Primary game values
var game = {
    paws: 0,
    totalPaws: 0,
    totalClicks: 0,
    clickValue: 1,
    //Calculate total pawss
    pawAmount: function(amount){

        this.paws += amount;
        this.totalPaws += amount;
        gameDisplay.updatepaws();
    },
    //Calculate pawss per second
    getpawsPerSecond: function(){
        var pawsPerSecond = 0;
        for (var i = 0; i < pawsUpgrade.name.length; i++) {
            pawsPerSecond += pawsUpgrade.income[i] * pawsUpgrade.count[i]
        }
        return pawsPerSecond;
    }
};
//Upgrades to paws accumulation
var pawsUpgrade = {
    name: ["Kitten", "White Cat", "Spyhnx"],
    image: ["kitten.jpg", "white-cat.jpg", "sphynx.jpg"],
    count: [0, 0, 0, 0],
    income: [1, 5, 25],
    cost: [10, 100, 1000],
    buy: function(index) {
        if (game.paws >= this.cost[index]) {
            game.paws -= this.cost[index];
            this.count[index]++;
            
            // Update the cost
            this.cost[index] = Math.ceil(this.cost[index] * 1.10);
            
            // Trigger an update of game.pawsPerSecond to reflect the new income
            gameDisplay.updatepaws();
            gameDisplay.updateUpgrades();
        }
    }
};
//Update game overlay
var gameDisplay = {
    //Title and paws display
        // ...
         updatepaws: function() {
            document.getElementById("paws").innerHTML = game.paws;
            
            // Calculate the total paws per second considering all upgrades
            var totalPawsPerSecond = game.clickValue;
            for (var i = 0; i < pawsUpgrade.name.length; i++) {
                totalPawsPerSecond += pawsUpgrade.income[i] * pawsUpgrade.count[i];
            }
            
            document.getElementById("pawsPersecond").innerHTML = totalPawsPerSecond;
            document.title = " Cat Clicker: " + game.paws;
        },
    //Display for upgrades
    updateUpgrades: function() {
        var shopElement = document.getElementById("shop");
        shopElement.innerHTML = ""; // Clear the shop content first
    
        for (i = 0; i < pawsUpgrade.name.length; i++) {
            var table = document.createElement("table");
            table.className = "shopButton unselectable";
            table.setAttribute("onclick", "pawsUpgrade.buy(" + i + ")");
            table.innerHTML = `
                <tr>
                    <td id="image"><img src="clickerimages/${pawsUpgrade.image[i]}"></td>
                    <td id="nameAndCost">
                        <p>${pawsUpgrade.name[i]}</p>
                        <p><span>${pawsUpgrade.cost[i]}</span> pawss</p>
                    </td>
                    <td id="amount"><span>${pawsUpgrade.count[i]}</span></td>
                </tr>
            `;
    
            shopElement.appendChild(table);
        }
    },
    // Display for boosters
};
//Displaying an element on users click
function gameDisplayOnClick(event){
    // Grab the clicker
    let clicker = document.getElementById("clicker");

    //Grab the position on where the clicker was clicked
    let clickerOffset = clicker.getBoundingClientRect();
    let position = {
        x: event.pageX - clickerOffset.left,
        y: event.pageY - clickerOffset.top
    };
    //Create the number
    let element = document.createElement("div");
    element.textContent = "+" + game.clickValue;
    element.classList.add("number", "unselectable");
    element.style.left = position.x +"px";
    element.style.top = position.y + "px";
    //Add number to clicker
    clicker.appendChild(element);

    //Removing element from screen
    let movementInterval = window.setInterval(function(){
        if(typeof element == "undefined" && element == null) clearInterval(movementInterval);
        position.y--;
        element.style.top = position.y + "px";
    }, 10)

    //Fade out element from screen
    fadeOut(element, 3000, 0.5, function(){
        element.remove();
    });
}
//Fade out element from screen
function fadeOut(element, duration, finalOpacity, callback) {
    opacity = 1;
    let elementFadingInterval = window.setInterval(function(){
        opacity -= 50 / duration;

        if (opacity <= finalOpacity){
            clearInterval(elementFadingInterval);
            callback();
        }
        element.style.opacity = opacity;
    }, 50);
}

// Save the game
function saveGame(){
    var gameSave = {
        paws: game.paws,
        totalPaws: game.totalPaws,
        totalClicks: game.totalClicks,
        clickValue: game.clickValue,
        pawsUpgradeCount: pawsUpgrade.count,
        pawsUpgradeIncome: pawsUpgrade.income,
        pawsUpgradeCost: pawsUpgrade.cost,
    };
    localStorage.setItem("gameSave", JSON.stringify(gameSave));
}

//Load the game
function loadGame(){
    var savedGame = JSON.parse(localStorage.getItem("gameSave"));
    if(localStorage.getItem("gameSave") !== null){
        if (typeof savedGame.paws !== "undefined") game.paws = savedGame.paws;
        if (typeof savedGame.totalPaws !== "undefined") game.totalPaws = savedGame.totalPaws;
        if (typeof savedGame.totalClicks !== "undefined") game.totalClicks = savedGame.totalClicks;
        if (typeof savedGame.clickValue !== "undefined") game.clickValue = savedGame.clickValue;
        if (typeof savedGame.pawsUpgradeCount !== "undefined") {
            for (i=0; i <savedGame.pawsUpgradeCount.length; i++){
                pawsUpgrade.count[i] = savedGame.pawsUpgradeCount[i];
            }
        }
        if (typeof savedGame.pawsUpgradeIncome !== "undefined") {
            for (i=0; i <savedGame.pawsUpgradeIncome.length; i++){
                pawsUpgrade.income[i] = savedGame.pawsUpgradeIncome[i];
            }
        }
        if (typeof savedGame.pawsUpgradeCost !== "undefined") {
            for (i=0; i <savedGame.pawsUpgradeCost.length; i++){
                pawsUpgrade.cost[i] = savedGame.pawsUpgradeCost[i];
            }
        }
    }
}

//Reset the game
function resetGame() {
    if (confirm("Are you sure you want to reset your game")) {
        var gameSave = {};
        localStorage.setItem("gameSave", JSON.stringify(gameSave));

        // Reset styles for the "bottom" div
        var bottomDiv = document.querySelector(".bottom");
        bottomDiv.style.position = "relative";
        bottomDiv.style.bottom = "-500px";
        bottomDiv.style.left = "20%";
        bottomDiv.style.right = "0";
        bottomDiv.style.transform = "translateX(-50%)";

        location.reload();
    }
}

//Every second update game
setInterval(function(){
game.paws += game.getpawsPerSecond();
game.totalPaws += game.getpawsPerSecond();
gameDisplay.updatepaws();
},1000);

//Save game every 30 seconds
setInterval(function() {
saveGame();
}, 30000);

//On reload
window.onload = function(){
    loadGame();
    gameDisplay.updatepaws();
    gameDisplay.updateUpgrades();

    document.getElementById("clicker").addEventListener("click", function(event){
        game.totalClicks++;
        game.pawAmount(game.clickValue);
        gameDisplayOnClick(event);
    }, false);
};