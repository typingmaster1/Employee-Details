/* ------------------ SAVE & LOAD FUNCTIONS ------------------ */

// Save table data into localStorage
function saveTable(tableID) {
    const table = document.getElementById(tableID);
    let rows = [];

    for (let i = 1; i < table.rows.length; i++) {
        let cells = table.rows[i].querySelectorAll("td");
        let data = [];

        for (let j = 0; j < cells.length - 2; j++) {
            data.push(cells[j].innerText);
        }

        rows.push(data);
    }

    localStorage.setItem(tableID, JSON.stringify(rows));
}

// Load saved data back into tables
function loadTable(tableID) {
    let stored = localStorage.getItem(tableID);
    if (!stored) return;

    const rows = JSON.parse(stored);

    rows.forEach(r => addRow(tableID, r, false));  
}


/* ------------------ ADD ROW + BUTTONS ------------------ */

function addRow(tableID, values, save = true) {
    const table = document.getElementById(tableID);
    const row = table.insertRow();

    values.forEach(val => {
        const cell = row.insertCell();
        cell.innerText = val;
    });

    // Edit button
    const editCell = row.insertCell();
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => {
        editRow(row);
        saveTable(tableID);
    };
    editCell.appendChild(editBtn);

    // Delete button
    const delCell = row.insertCell();
    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => {
        row.remove();
        saveTable(tableID);
    };
    delCell.appendChild(delBtn);

    if (save) saveTable(tableID);
}


/* ------------------ EDIT ROW ------------------ */

function editRow(row) {
    let cells = row.querySelectorAll("td");

    for (let i = 0; i < cells.length - 2; i++) {
        let oldValue = cells[i].innerText;
        let newValue = prompt("Edit value:", oldValue);

        if (newValue !== null && newValue.trim() !== "") {
            cells[i].innerText = newValue;
        }
    }
}


/* ------------------ FORMS ------------------ */

document.getElementById("empForm").addEventListener("submit", function(e) {
    e.preventDefault();
    addRow("empTable", [
        empID.value, empName.value, empDes.value, empPhone.value, empJoin.value
    ]);
    this.reset();
});

document.getElementById("attForm").addEventListener("submit", function(e) {
    e.preventDefault();
    addRow("attTable", [
        attName.value, attDate.value, attIn.value, attOut.value
    ]);
    this.reset();
});

/* ------------------ SALARY AUTO CALCULATION ------------------ */

document.getElementById("salForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = salName.value;
    const month = salMonth.value;
    const basic = Number(salBasic.value);
    const overtimeHours = Number(salOver.value);

    // 1. Auto-calc overtime amount  
    const overtimeRate = 200;  // You can change the rate here
    const overtimeAmount = overtimeHours * overtimeRate;

    // 2. Auto-deduct all advance payments of this employee
    let advanceRows = JSON.parse(localStorage.getItem("advTable")) || [];
    let totalAdvanceTaken = 0;

    advanceRows.forEach(a => {
        if (a[0] === name) {
            totalAdvanceTaken += Number(a[2]); // advanceAmount column
        }
    });

    // 3. Final total salary
    const finalSalary = basic + overtimeAmount - totalAdvanceTaken;

    // Add salary row into table with final salary
    addRow("salTable", [
        name,
        month,
        basic,
        overtimeHours,
        overtimeAmount,
        totalAdvanceTaken,
        finalSalary
    ]);

    this.reset();
});

document.getElementById("advForm").addEventListener("submit", function(e) {
    e.preventDefault();
    addRow("advTable", [
        advName.value, advDate.value, advAmount.value
    ]);
    this.reset();
});

document.getElementById("otForm").addEventListener("submit", function(e) {
    e.preventDefault();
    addRow("otTable", [
        otName.value, otDate.value, otHours.value, otAmount.value
    ]);
    this.reset();
});


/* ------------------ LOAD SAVED DATA ON PAGE START ------------------ */

window.onload = () => {
    loadTable("empTable");
    loadTable("attTable");
    loadTable("salTable");
    loadTable("payTable");
    loadTable("advTable");
    loadTable("otTable");
};
