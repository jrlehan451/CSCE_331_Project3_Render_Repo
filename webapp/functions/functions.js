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

function buildDrink(drinkName) {
    var currLocation = window.location.href;
    const array = currLocation.split("=");
    location.href = currLocation.replace("drink_series?category=" + array[1], "build_drink");
         
    sessionStorage.setItem("customer_selected_drink", drinkName);
}

function getSelectedDrink() {
    const selectedDrink = sessionStorage.getItem("customer_selected_drink");
    const drinkName = document.getElementById("drinkSelected");
    drinkName.textContent = "Selected Drink: " + selectedDrink;
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
