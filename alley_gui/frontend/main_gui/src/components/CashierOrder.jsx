function select(element) {
    if (element.classList.contains("selected")) {
        element.classList.remove("selected");

        let deleteButton = document.getElementById("delete");
        deleteButton.classList.add("grayed-button");
    } else {
        element.classList.add("selected");
        getSiblings(element).forEach(s => {
            s.classList.remove("selected");
        }); 

        let deleteButton = document.getElementById("delete");
        deleteButton.classList.remove("grayed-button");
    }
}

function redirect(event) {
    select(event.target.parentNode);
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

function CashierOrder({drinks, add_ons}) {
    const getTableContent = drinks => {
        let rows = [];

        let header = <tr key="header" class="table-header order-row"><td>Number</td><td>Drink</td><td>Add-Ons</td><td>Cost</td></tr>
        rows.push(header);

        for (let i = 0; i < drinks.length; i++) {
            let totalCost = parseFloat(drinks[i].cost);

            var tr = "<tr>";
            tr += "<td>" + (i + 1) + "</td>";
            tr += "<td>" + drinks[i].name + "</td>";
            var addOnString = "";
            if (add_ons[i].length > 0) {
                addOnString += add_ons[i][0].name;
                totalCost += parseFloat(add_ons[i][0].cost);
            }
            for (var j = 1; j < add_ons[i].length; ++j) {
                addOnString += ", " + add_ons[i][j].name;
                totalCost += parseFloat(add_ons[i][j].cost);
            }
            tr += "<td>" + addOnString + "</td>";
            tr += "<td>" + totalCost.toFixed(2) + "</td></tr>";

            rows.push(<tr key={i} class="order-row" onClick={redirect} dangerouslySetInnerHTML={{__html: tr}}></tr>);
        } 
        rows.push(<div key="filler" class="filler-rows"></div>);
        return rows;
    }

    return (
        <tbody>{getTableContent(drinks)}</tbody>
    )
}

export default CashierOrder;