const buildings = [

{
    id:"lemonade",
    name:"Lemonade Stand",
    cost:0,
    income:1,
    owned:1
},

{
    id:"hotdog",
    name:"Hot Dog Cart",
    cost:100,
    income:5,
    owned:0
},

{
    id:"burger",
    name:"Burger Shack",
    cost:500,
    income:15,
    owned:0
},

{
    id:"pizza",
    name:"Pizzeria",
    cost:2000,
    income:20,
    owned:0
},

{
    id:"grocery",
    name:"Grocery Store",
    cost:10000,
    income:75,
    owned:0
},

{
    id:"fleet",
    name:"Food Truck Fleet",
    cost:250000,
    income:600,
    owned:0
}

];

let foodMultiplier = 1;

let game = {

    food:0,

    ferraris:0,

    reputation:0,

    totalEaten:0,

    totalGenerated:0
};

const achievements = [

{
    name:"Hungry Caleb",
    goal:100,
    reward:1,
    unlocked:false
},

{
    name:"Mega Caleb",
    goal:1000,
    reward:5,
    unlocked:false
},

{
    name:"Food Monster",
    goal:10000,
    reward:25,
    unlocked:false
}

];

function getCost(building){

    return Math.floor(
        building.cost *
        Math.pow(1.15,building.owned)
    );
}

function foodPerSecond(){

    let total = 0;

    let pizzaCount =
        buildings.find(
            b=>b.id==="pizza"
        ).owned;

    let bonus =
        1 + pizzaCount*0.1;

    buildings.forEach(building=>{

        total +=
            building.income *
            building.owned *
            bonus;
    });

    return total *
           foodMultiplier;
}

function updateUI(){

    document.getElementById(
        "food"
    ).textContent =
        Math.floor(game.food);

    document.getElementById(
        "fps"
    ).textContent =
        foodPerSecond().toFixed(1);

    document.getElementById(
        "eaten"
    ).textContent =
        game.totalEaten;

    document.getElementById(
        "ferraris"
    ).textContent =
        game.ferraris;

    document.getElementById(
        "reputation"
    ).textContent =
        game.reputation.toFixed(0);

    let container =
        document.getElementById(
            "buildings"
        );

    container.innerHTML="";

    buildings.forEach(building=>{

        let div =
            document.createElement(
                "div"
            );

        div.className =
            "building";

        div.innerHTML=`

        <h3>${building.name}</h3>

        <p>
        Owned:
        ${building.owned}
        </p>

        <p>
        Produces:
        ${building.income}/sec
        </p>

        <p>
        Cost:
        ${getCost(building)}
        </p>

        <button
        onclick="buyBuilding('${building.id}')">
        Buy
        </button>
        `;

        container.appendChild(div);
    });
}

function buyBuilding(id){

    let building =
        buildings.find(
            b=>b.id===id
        );

    let cost =
        getCost(building);

    if(game.food < cost)
        return;

    game.food -= cost;

    building.owned++;

    updateUI();
}

function buyDoubleFood(){

    if(game.ferraris < 25)
        return;

    game.ferraris -= 25;

    foodMultiplier *= 2;

    updateUI();
}

function checkAchievements(){

    achievements.forEach(a=>{

        if(a.unlocked)
            return;

        if(game.totalEaten >= a.goal){

            a.unlocked = true;

            game.ferraris +=
                a.reward;

            alert(
                a.name +
                "\n+" +
                a.reward +
                " Ferraris"
            );
        }
    });
}

document
.getElementById("eatBtn")
.addEventListener("click",()=>{

    if(game.food >= 1){

        game.food--;

        game.totalEaten++;

        game.reputation += 1;

        checkAchievements();

        updateUI();
    }
});

function saveGame(){

    localStorage.setItem(
        "calebSaveV2",
        JSON.stringify({

            game,

            buildings,

            achievements,

            foodMultiplier,

            saveTime:Date.now()
        })
    );
}

function loadGame(){

    let save =
        localStorage.getItem(
            "calebSaveV2"
        );

    if(!save)
        return;

    let data =
        JSON.parse(save);

    game =
        data.game;

    foodMultiplier =
        data.foodMultiplier || 1;

    data.buildings.forEach(saved=>{

        let building =
            buildings.find(
                b=>b.id===saved.id
            );

        if(building)
            building.owned =
                saved.owned;
    });

    if(data.achievements){

        data.achievements.forEach(
            (saved,index)=>{

            achievements[index]
                .unlocked =
                    saved.unlocked;
        });
    }

    let offlineSeconds =
        (
        Date.now() -
        data.saveTime
        ) / 1000;

    game.food +=
        foodPerSecond() *
        offlineSeconds;
}

setInterval(()=>{

    let gain =
        foodPerSecond();

    game.food += gain;

    game.totalGenerated += gain;

    updateUI();

},1000);

setInterval(
    saveGame,
    5000
);

window.buyBuilding =
    buyBuilding;

window.buyDoubleFood =
    buyDoubleFood;

loadGame();

updateUI();
