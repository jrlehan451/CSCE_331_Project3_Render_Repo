function addDrink(category) {
    var currLocation = window.location.href;
    location.href = currLocation.replace("drink_options", "add_drink?category=") + category;
}

function getDrinkSeries(category) {
    var currLocation = window.location.href;
    if (currLocation.includes("customer_home")) {
        location.href = currLocation.replace("customer_home", "drink_series?category=") + category;
    } else {
        const array = currLocation.split("=");
        location.href = currLocation.replace(array[1], category);
    }
}

function buildDrink() {
    var currLocation = window.location.href;
    const array = currLocation.split("=");
    location.href = currLocation.replace("drink_series?category=" + array[1], "build_drink");
}

function getDrinkSize() {
    const addOns1 = document.getElementById("addOns1");
    if (addOns1.style.display == "block") {
        addOns1.style.display = "none";
    }
    const addOns2 = document.getElementById("addOns2");
    if (addOns2.style.display == "block") {
        addOns2.style.display = "none";
    }
    const quantity = document.getElementById("quantity");
    if (quantity.style.display == "block") {
        quantity.style.display = "none";
    }

    const size = document.getElementById("size");
    size.style.display = "block";
}

function getDrinkAddOn1() {
    const size = document.getElementById("size");
    if (size.style.display == "block") {
        size.style.display = "none";
    }
    const addOns2 = document.getElementById("addOns2");
    if (addOns2.style.display == "block") {
        addOns2.style.display = "none";
    }
    const quantity = document.getElementById("quantity");
    if (quantity.style.display == "block") {
        quantity.style.display = "none";
    }

    const addOns1 = document.getElementById("addOns1");
    addOns1.style.display = "block";

}

function getDrinkAddOn2() {
    const size = document.getElementById("size");
    if (size.style.display == "block") {
        size.style.display = "none";
    }
    const addOns1 = document.getElementById("addOns1");
    if (addOns1.style.display == "block") {
        addOns1.style.display = "none";
    }
    const quantity = document.getElementById("quantity");
    if (quantity.style.display == "block") {
        quantity.style.display = "none";
    }

    const addOns2 = document.getElementById("addOns2");
    addOns2.style.display = "block";
}

function getDrinkQuantity() {
    const size = document.getElementById("size");
    if (size.style.display == "block") {
        size.style.display = "none";
    }
    const addOns1 = document.getElementById("addOns1");
    if (addOns1.style.display == "block") {
        addOns1.style.display = "none";
    }
    const addOns2 = document.getElementById("addOns2");
    if (addOns2.style.display == "block") {
        addOns2.style.display = "none";
    }

    const quantity = document.getElementById("quantity");
    quantity.style.display = "block";

    let count = 0;
    let increment = document.getElementById("increment");
    let decrement = document.getElementById("decrement");
    let disp = document.getElementById("display");
         
    increment.addEventListener("click", function () {
        count++;
        disp.innerHTML = count;
    });
    decrement.addEventListener("click", function () {
        if (count > 0) {
            count--;
        }
        disp.innerHTML = count;
    });
}

function backCustomerHome() {
    var currLocation = window.location.href;
    location.href = currLocation.replace("build_drink", "customer_home");
}

function authenticateUser(employeesJSON) {
    const employees = JSON.parse(employeesJSON); 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    for (const employee of employees) {
        if (employee.first_name === username && employee.password === password) {
            routeFromHome(employee);
            return;
        }
    }

    // Authentication failed
    alert('Authentication failed. Please try again.');
}

function routeFromHome(employee){
    var currLocation = window.location.href;
    if(employee.first_name === "customer" && employee.last_name == "profile"){
        location.href = currLocation.replace("index", "customer_home");
    }
    else if(employee.is_manager){
        location.href = currLocation.replace("index", "manager_home");
    }
    else{
        location.href = currLocation.replace("index", "cashier_home");
    }
    return;
    
}

function navigateToMenuAddons(){
    var currLocation = window.location.href;
    location.href = currLocation.replace("menu", "menu_addons");
}

function returnHome(){
    window.location.href = "/";
}

function drinkToLocal(_id, _name, _cost) {
    drinks = []
    if (sessionStorage.getItem("drinks")) {
        drinks = JSON.parse(sessionStorage.getItem('drinks'));
    }

    newDrink = {
        id: _id,
        name: _name,
        cost: _cost
    };

    drinks.push(newDrink);
    sessionStorage.setItem("drinks", JSON.stringify(drinks));

    add_ons = []
    if (sessionStorage.getItem("add_ons")) {
        add_ons = JSON.parse(sessionStorage.getItem('add_ons'));
    }

    add_ons.push([]);
    sessionStorage.setItem("add_ons", JSON.stringify(add_ons));

    loadTableFromLocal();
}

function add_onToLocal(_id, _name, _cost) {
    add_ons = []
    if (sessionStorage.getItem("add_ons")) {
        add_ons = JSON.parse(sessionStorage.getItem('add_ons'));
    }

    number = document.getElementsByClassName("selected")[0].children[0].innerHTML;

    newAddOn = {
        id: _id,
        name: _name,
        cost: _cost
    };


    add_ons[number - 1].push(newAddOn);
    sessionStorage.setItem("add_ons", JSON.stringify(add_ons));

    loadTableFromLocal();
}

function loadTableFromLocal() {
    var drinks = JSON.parse(sessionStorage.getItem('drinks'));
    var add_ons = JSON.parse(sessionStorage.getItem('add_ons'));

    var tbody = document.getElementById('tbody');

    tbody.innerHTML = "<tr><td>Number</td><td>Drink</td><td>Add-Ons</td><td>Cost</td></tr>"

    for (var i = 0; i < drinks.length; ++i) {
        console.log(i);
        console.log(drinks[i].name);
        var totalCost = parseFloat(drinks[i].cost);

        var tr = "<tr onClick='select(this)'>";
        tr += "<td>" + (i + 1) + "</td>";
        tr += "<td>" + drinks[i].name + "</td>";
        var addOnString = "";
        for (var j = 0; j < add_ons[i].length; ++j) {
            addOnString += add_ons[i][j].name + ", ";
            totalCost += parseFloat(add_ons[i][j].cost);
        }
        console.log(addOnString);
        tr += "<td>" + addOnString + "</td>";
        tr += "<td>" + totalCost + "</td></tr>";

        tbody.innerHTML += tr;
    }
}

function select(element) {
    element.classList.add("selected");
    getSiblings(element).forEach(s => {
        s.classList.remove("selected");
    });
}

function getSiblings(e) {
    // for collecting siblings
    let siblings = []; 
    // if no parent, return no sibling
    if(!e.parentNode) {
        return siblings;
    }
    // first child of the parent node
    let sibling  = e.parentNode.firstChild;
    
    // collecting siblings
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== e) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }
    return siblings;
};


loadTableFromLocal();
