const achievements = [
{
    id: "eat100",
    unlocked: false,
    reward: 1,
    condition: () => game.totalEaten >= 100
},
{
    id: "eat1000",
    unlocked: false,
    reward: 5,
    condition: () => game.totalEaten >= 1000
},
{
    id: "eat10000",
    unlocked: false,
    reward: 25,
    condition: () => game.totalEaten >= 10000
}
];
const buildings = [
{
    id: "lemonade",
    name: "Lemonade Stand",
    baseCost: 0,
    income: 1,
    owned: 1
},
{
    id: "hotdog",
    name: "Hot Dog Cart",
    baseCost: 100,
    income: 5,
    owned: 0
},
{
    id: "burger",
    name: "Burger Shack",
    baseCost: 500,
    income: 15,
    owned: 0
},
{
    id: "pizza",
    name: "Pizzeria",
    baseCost: 2000,
    income: 20,
    owned: 0
},
{
    id: "grocery",
    name: "Grocery Store",
    baseCost: 10000,
    income: 75,
    owned: 0
},
{
    id: "fleet",
    name: "Food Truck Fleet",
    baseCost: 250000,
    income: 600,
    owned: 0
}
];

let game = {
    food: 0,
    ferraris: 0,
    reputation: 0,
    debt: 0,
    totalEaten: 0,
    totalGenerated: 0
};

function buildingCost(building) {
    return Math.floor(
        building.baseCost *
        Math.pow(1.15, building.owned)
    );
}

function foodPerSecond() {

    let total = 0;

    const pizzaCount =
        buildings.find(
            b => b.id === "pizza"
        ).owned;

    const bonus = 1 + pizzaCount * 0.1;

    buildings.forEach(building => {
        total +=
            building.income *
            building.owned *
            bonus;
    });

    return total;
}

function updateUI() {

    document.getElementById("food").textContent =
        Math.floor(game.food);

    document.getElementById("fps").textContent =
        foodPerSecond().toFixed(1);

    document.getElementById("eaten").textContent =
        game.totalEaten;
    document.getElementById("ferraris").textContent =
    game.ferraris;

    const container =
        document.getElementById("buildings");

    container.innerHTML = "";

    buildings.forEach(building => {

        const div =
            document.createElement("div");

        div.className = "building";

        div.innerHTML = `
            <h3>${building.name}</h3>
            <p>Owned: ${building.owned}</p>
            <p>Produces ${building.income}/sec</p>
            <p>Cost: ${buildingCost(building)}</p>
            <button onclick="buyBuilding('${building.id}')">
                Buy
            </button>
        `;

        container.appendChild(div);
    });
}

function buyBuilding(id) {

    const building =
        buildings.find(
            b => b.id === id
        );

    const cost =
        buildingCost(building);

    if(game.food >= cost) {

        game.food -= cost;
        building.owned++;

        updateUI();
    }
}

window.buyBuilding = buyBuilding;

document
.getElementById("eatBtn")
.addEventListener("click", () => {

    if(game.food >= 1) {

        game.food--;
        game.totalEaten++;
        game.reputation += 0.01;

        checkAchievements();
updateUI();;
    }
});

setInterval(() => {

    game.food += foodPerSecond();

    updateUI();

}, 1000);

updateUI();
function saveGame() {

    localStorage.setItem(
        "calebSave",
        JSON.stringify({
            game,
            buildings
        })
    );
}
function checkAchievements() {

    achievements.forEach(a => {

        if(a.unlocked) return;

        if(a.condition()) {

            a.unlocked = true;

            game.ferraris += a.reward;

            alert(
                "Achievement Unlocked!\n+" +
                a.reward +
                " Ferraris"
            );
        }
    });
}
function loadGame() {

    const save =
        localStorage.getItem("calebSave");

    if(!save) return;

    const data =
        JSON.parse(save);

    game = data.game;

    data.buildings.forEach(saved => {

        const building =
            buildings.find(
                b => b.id === saved.id
            );

        if(building)
            building.owned =
                saved.owned;
    });
}

loadGame();

setInterval(saveGame, 5000);
