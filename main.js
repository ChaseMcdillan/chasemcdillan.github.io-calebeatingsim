// ===== CALEB EATING SIM V0.3 =====

const SAVE_KEY = "calebEatingSimV03";

let game = {
    food: 0,
    ferraris: 0,
    reputation: 0,
    totalEaten: 0,
    totalGenerated: 0,
    debt: 0,
    prestiges: 0,
    foodMultiplier: 1
};

const buildings = [
{
    id:"lemonade",
    name:"Lemonade Stand",
    image:"assets/lemonade.png",
    cost:0,
    income:1,
    owned:1
},
{
    id:"hotdog",
    name:"Hot Dog Cart",
    image:"assets/hotdog.png",
    cost:100,
    income:5,
    owned:0
},
{
    id:"burger",
    name:"Burger Shack",
    image:"assets/burger.png",
    cost:500,
    income:15,
    owned:0
},
{
    id:"pizzeria",
    name:"Pizzeria",
    image:"assets/pizzeria.png",
    cost:2000,
    income:20,
    owned:0
},
{
    id:"garden",
    name:"Garden",
    image:"assets/garden.png",
    cost:5000,
    income:35,
    owned:0
},
{
    id:"walmart",
    name:"Walmart",
    image:"assets/walmart.png",
    cost:50000,
    income:120,
    owned:0
},
{
    id:"fleet",
    name:"Food Truck Fleet",
    image:"assets/fleet.png",
    cost:250000,
    income:600,
    owned:0
}
];

function showNotification(text){

    const area =
    document.getElementById(
        "notificationArea"
    );

    const div =
    document.createElement("div");

    div.className =
    "notification";

    div.textContent =
    text;

    area.appendChild(div);

    setTimeout(()=>{
        div.remove();
    },4000);
}

function showTab(tabId){

    document
    .querySelectorAll(".tab-content")
    .forEach(tab=>{

        tab.classList.remove(
            "active-tab"
        );

    });

    document
    .getElementById(tabId)
    .classList.add(
        "active-tab"
    );
}

window.showTab = showTab;

function getCost(building){

    return Math.floor(
        building.cost *
        Math.pow(
            1.15,
            building.owned
        )
    );
}

function foodPerSecond(){

    let total = 0;

    buildings.forEach(b=>{

        total +=
        b.income *
        b.owned;

    });

    return total *
    game.foodMultiplier;
}

function buyBuilding(id){

    const building =
    buildings.find(
        b=>b.id===id
    );

    const cost =
    getCost(building);

    if(game.food < cost){

        showNotification(
            "Not enough food!"
        );

        return;
    }

    game.food -= cost;

    building.owned++;

    showNotification(
        "Bought " +
        building.name
    );

    renderBuildings();

    updateUI();
}

window.buyBuilding =
buyBuilding;

function renderBuildings(){

    const container =
    document.getElementById(
        "buildingContainer"
    );

    container.innerHTML = "";

    buildings.forEach(building=>{

        const card =
        document.createElement(
            "div"
        );

        card.className =
        "building-card";

        card.innerHTML = `
        <img src="${building.image}">
        <h3>${building.name}</h3>

        <p>
        Owned:
        ${building.owned}
        </p>

        <p>
        +${building.income}
        Food/sec
        </p>

        <p>
        Cost:
        ${getCost(building)}
        </p>

        <button
        class="buy-btn"
        onclick="buyBuilding('${building.id}')">
        BUY
        </button>
        `;

        container.appendChild(
            card
        );
    });
}

function updateUI(){

    document.getElementById(
        "food"
    ).textContent =
    Math.floor(game.food);

    document.getElementById(
        "fps"
    ).textContent =
    foodPerSecond()
    .toFixed(1);

    document.getElementById(
        "ferraris"
    ).textContent =
    game.ferraris;

    document.getElementById(
        "reputation"
    ).textContent =
    Math.floor(
        game.reputation
    );

    document.getElementById(
        "totalEaten"
    ).textContent =
    Math.floor(
        game.totalEaten
    );

    document.getElementById(
        "totalGenerated"
    ).textContent =
    Math.floor(
        game.totalGenerated
    );

    document.getElementById(
        "debt"
    ).textContent =
    Math.floor(
        game.debt
    );

    document.getElementById(
        "prestiges"
    ).textContent =
    game.prestiges;
}

document
.getElementById("eatBtn")
.addEventListener(
"click",
()=>{

    if(game.food >= 1){

        game.food--;

        game.totalEaten++;

        game.reputation++;

        updateUI();
    }

});

function saveGame(){

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({

            game,
            buildings,
            saveTime:
            Date.now()

        })
    );
}

function loadGame(){

    const save =
    localStorage.getItem(
        SAVE_KEY
    );

    if(!save) return;

    const data =
    JSON.parse(save);

    game =
    data.game;

    data.buildings.forEach(
        saved=>{

        const building =
        buildings.find(
        b=>b.id===saved.id
        );

        if(building){

            building.owned =
            saved.owned;

        }

    });

    const offline =
    (
    Date.now() -
    data.saveTime
    ) / 1000;

    game.food +=
    foodPerSecond() *
    offline;

    showNotification(
        "Offline earnings collected!"
    );
}

setInterval(()=>{

    const gain =
    foodPerSecond();

    game.food += gain;

    game.totalGenerated += gain;

    updateUI();

},1000);

setInterval(
saveGame,
5000
);

loadGame();
renderBuildings();
updateUI();
