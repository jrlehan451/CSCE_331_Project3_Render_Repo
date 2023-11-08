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

function buildDrink(drinkName, drinkId) {
    var currLocation = window.location.href;
    const array = currLocation.split("=");
    location.href = currLocation.replace("drink_series?category=" + array[1], "build_drink");
         
    sessionStorage.setItem("customer_drink_name", drinkName);
    sessionStorage.setItem("customer_drink_id", drinkId);
}

function getSelectedDrink() {
    const selectedDrink = sessionStorage.getItem("customer_drink_name");
    const drinkName = document.getElementById("drinkSelected");
    drinkName.textContent = "Selected Drink: " + selectedDrink;
}

function getAddOn1(addOn1Name, addOn1IngredientId) {
    sessionStorage.setItem("customer_addOn1_name", addOn1Name);
    sessionStorage.setItem("customer_addOn1_id", addOn1IngredientId);
    const addOn1 = document.getElementById("drinkSelectedAddOn1");
    addOn1.textContent = "Add-On #1: " + addOn1Name;
}

function getAddOn2(addOn1Name, addOn1IngredientId) {
    sessionStorage.setItem("customer_addOn2_name", addOn1Name);
    sessionStorage.setItem("customer_addOn2_id", addOn1IngredientId);
    const addOn2 = document.getElementById("drinkSelectedAddOn2");
    addOn2.textContent = "Add-On #2: " + addOn1Name;
}

function getSize(size) {
    sessionStorage.setItem("customer_drink_size", size);
    const drinkSize = document.getElementById("drinkSelectedSize");
    drinkSize.textContent = "Size: " + size;
}

function getQuantity() {
    quantity = sessionStorage.getItem("customer_drink_quantity");
    const drinkQuantity = document.getElementById("drinkSelectedQuantity");
    drinkQuantity.textContent = "Quantity: " + quantity;
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
        sessionStorage.setItem("customer_drink_quantity", count);
    });
    decrement.addEventListener("click", function () {
        if (count > 0) {
            count--;
        }
        disp.innerHTML = count;
        sessionStorage.setItem("customer_drink_quantity", count);
    });
}

function backCustomerHome() {
    var currLocation = window.location.href;
    location.href = currLocation.replace("build_drink", "customer_home");
}

function backCustomerHome() {
    var currLocation = window.location.href;
    location.href = currLocation.replace("build_drink", "customer_home");
}

function viewCart() {
    var currLocation = window.location.href;
    location.href = currLocation.replace("build_drink", "view_cart");
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