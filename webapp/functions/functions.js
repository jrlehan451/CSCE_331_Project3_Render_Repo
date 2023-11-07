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
    const size = document.getElementById("size");
    size.style.display = "block";
}

function getDrinkReplacements() {

}

function getDrinkAddOn1() {

}

function getDrinkAddOn2() {

}

function getDrinkQuantity() {

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