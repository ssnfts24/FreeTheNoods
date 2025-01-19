// Game Logic for 'Free The Noods'

// Player Data Structure
let player = {
    username: "",
    noods: [], // Team of Noods
    gold: 0,
    level: 1,
    exp: 0,
    maxExp: 100,
    inventory: [],
    completedStages: 0, // Tracks progression
    activeQuests: [],
    reputation: 0, // Tracks faction alignment
    guild: null, // Guild membership
};

// Nood Templates
const noodTemplates = {
    Fire: { name: "Fire Nood", type: "Fire", health: 120, energy: 80, attack: 25, defense: 15, abilities: ["Flame Strike", "Inferno Blast"] },
    Water: { name: "Water Nood", type: "Water", health: 100, energy: 100, attack: 20, defense: 20, abilities: ["Aqua Shield", "Tsunami"] },
    Shadow: { name: "Shadow Nood", type: "Shadow", health: 110, energy: 90, attack: 30, defense: 10, abilities: ["Shadow Slice", "Dark Pulse"] },
    Wind: { name: "Air Nood", type: "Wind", health: 90, energy: 110, attack: 20, defense: 20, abilities: ["Gale Force", "Whirlwind"] },
    Earth: { name: "Earth Nood", type: "Earth", health: 130, energy: 70, attack: 25, defense: 25, abilities: ["Rock Throw", "Earthquake"] },
    Light: { name: "Light Nood", type: "Light", health: 100, energy: 90, attack: 20, defense: 15, abilities: ["Healing Light", "Radiant Beam"] },
};

// Enemy Template
function generateEnemy(stage) {
    const enemyTypes = ["Scarling", "Darkling", "Flamelord", "Icebeast", "Shadow Fiend", "Wind Wraith"];
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    return {
        name: type,
        health: 100 + stage * 20,
        attack: 15 + stage * 5,
        defense: 10 + stage * 3,
        rewardGold: Math.floor(Math.random() * 30) + 20,
        expReward: 50 + stage * 10,
    };
}

// Start Battle
function startBattle() {
    currentEnemy = generateEnemy(player.completedStages + 1);
    document.getElementById("battle-text").textContent = `Stage ${player.completedStages + 1}: A wild ${currentEnemy.name} appeared!`;
    updateEnemyStats();
    showBattleOptions();
}

// Show Battle Options
function showBattleOptions() {
    const actionsDiv = document.getElementById("actions");
    actionsDiv.innerHTML = player.noods.map((nood, index) => `
        <button onclick="attack(${index})">${nood.name} Attack</button>
        <button onclick="useAbility(${index})">${nood.name} Use Ability</button>
    `).join(" ") + '<button onclick="flee()">Flee</button>';
}

// Attack Function
function attack(noodIndex) {
    const nood = player.noods[noodIndex];
    const damage = Math.max(0, nood.attack - currentEnemy.defense);
    currentEnemy.health -= damage;
    logMessage(`${nood.name} dealt ${damage} damage to ${currentEnemy.name}!`);
    if (currentEnemy.health <= 0) {
        victory();
    } else {
        enemyTurn();
    }
    updateEnemyStats();
}

// Victory Function
function victory() {
    player.gold += currentEnemy.rewardGold;
    player.exp += currentEnemy.expReward;
    player.completedStages++;
    logMessage(`You defeated ${currentEnemy.name}! Gained ${currentEnemy.rewardGold} gold and ${currentEnemy.expReward} EXP.`);
    if (player.exp >= player.maxExp) {
        levelUp();
    }
    setTimeout(startBattle, 2000);
}

// Enemy Turn
function enemyTurn() {
    const damage = Math.max(0, currentEnemy.attack - 10); // Example player defense
    player.noods[0].health -= damage; // Attacks the first Nood in the team
    logMessage(`${currentEnemy.name} dealt ${damage} damage to ${player.noods[0].name}!`);
    if (player.noods[0].health <= 0) {
        logMessage(`${player.noods[0].name} has been defeated!`);
        player.noods.shift();
        if (player.noods.length === 0) {
            gameOver();
        }
    }
}

// Game Over
function gameOver() {
    logMessage("Game Over. Refresh the page to try again.");
    document.getElementById("actions").innerHTML = "";
}

// Level Up
function levelUp() {
    player.level++;
    player.exp = 0;
    player.maxExp += 50;
    logMessage(`Level up! You are now level ${player.level}.`);
}

// Utility: Update Enemy Stats
function updateEnemyStats() {
    document.getElementById("enemy-details").textContent = `Enemy: ${currentEnemy.name}, Health: ${currentEnemy.health}`;
}

// Utility: Update Player Stats
function updatePlayerStats() {
    const statsDiv = document.getElementById("player-stats");
    statsDiv.innerHTML = `
        <p>Gold: ${player.gold}</p>
        <p>Level: ${player.level}</p>
        <p>EXP: ${player.exp}/${player.maxExp}</p>
        <p>Reputation: ${player.reputation}</p>
    `;
}

// Utility: Update Team Display
function updateTeamDisplay() {
    const teamDiv = document.getElementById("team-container");
    teamDiv.innerHTML = player.noods.map((nood, index) => `
        <div class="nood-card">
            <p>${nood.name}</p>
            <p>Type: ${nood.type}</p>
            <p>Health: ${nood.health}</p>
            <p>Energy: ${nood.energy}</p>
        </div>
    `).join("");
}

// Utility: Log Messages
function logMessage(message) {
    const log = document.getElementById("battle-log");
    const logItem = document.createElement("li");
    logItem.textContent = message;
    log.appendChild(logItem);
    if (log.children.length > 50) {
        log.removeChild(log.firstChild);
    }
}
