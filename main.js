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
}
];

let game = {
    food: 0,
    totalEaten: 0,
    lastSave: Date.now()
};

function buildingCost(building) {
    return Math.floor(
        building.baseCost *
        Math.pow(1.15, building.owned)
    );
}

function foodPerSecond() {

    let total = 0;

    let pizzaBonus = 1;

    const pizzerias =
        buildings.find(b => b.id === "pizza").owned;

    pizzaBonus += pizzerias * 0.1;

    buildings.forEach(b => {
        total += b.income * b.owned * pizzaBonus;
    });

    return total;
}

function updateUI() {

    document.getElementById("food").textContent =
        Math.floor(game.food);

    document.getElementById("fps").textContent =
        foodPerSecond().toFixed(1);

    document.getElementById("eaten").textContent =
        Math.floor(game.totalEaten);

    const container =
        document.getElementById("buildings");

    container.innerHTML = "";

    buildings.forEach(building => {

        const div = document.createElement("div");
        div.className = "building";

        const cost = buildingCost(building);

        div.innerHTML = `
            <h3>${building.name}</h3>
            <p>Owned: ${building.owned}</p>
            <p>Income: ${building.income}/sec</p>
            <p>Cost: ${cost}</p>
            <button onclick="buyBuilding('${building.id}')">
                Buy
            </button>
        `;

        container.appendChild(div);
    });
}

function buyBuilding(id) {

    const building =
        buildings.find(b => b.id === id);

    const cost = buildingCost(building);

    if (game.food >= cost) {

        game.food -= cost;
        building.owned++;

        updateUI();
    }
}

function saveGame() {

    localStorage.setItem(
        "calebEatingSave",
        JSON.stringify({
            game,
            buildings,
            timestamp: Date.now()
        })
    );
}

function loadGame() {

    const save =
        localStorage.getItem("calebEatingSave");

    if (!save) return;

    const data = JSON.parse(save);

    game = data.game;

    data.buildings.forEach(saved => {

        const building =
            buildings.find(
                b => b.id === saved.id
            );

        if (building)
            building.owned = saved.owned;
    });

    const offlineSeconds =
        (Date.now() - data.timestamp) / 1000;

    const earnings =
        foodPerSecond() * offlineSeconds;

    game.food += earnings;
}

document
.getElementById("eatBtn")
.addEventListener("click", () => {

    if (game.food >= 1) {
        game.food--;
        game.totalEaten++;
    }

    updateUI();
});

setInterval(() => {

    game.food += foodPerSecond();

    updateUI();

}, 1000);

setInterval(saveGame, 5000);

loadGame();
updateUI();

window.buyBuilding = buyBuilding;
