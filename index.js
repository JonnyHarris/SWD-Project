function doSomething() {
    console.log("DOM loaded");
};

if (document.readyState === "loading"){

document.addEventListner('DOMContentLoaded', function () {
    
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
       
}, false);
} else {
    doSomething();
};

const addBtn = document.querySelector('#add-name-btn');

document.querySelector('table tbody').addEventListener('click', function(event) {
    // console.log(event.target);
    if (event.target.ClassName === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }
    if(event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

serarchBtn.onclick = function() {
    const searchValue = document.querySelector('#search-input').value;
    fetch('http://localhost:5000/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    loadHTMLTable([]);
}

function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
    
}

function handleEdirRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#udate-row-btn').dataset.id = id;
};

updateBtn.onclick = function() {
    const updatedNameInput = document.querySelector('#update-name-input');
    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: updatedNameInput.dataset.id,
            name: updatedNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
}

addBtn.onclick = function () {
    console.log('clicked');
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInputvalue = "";

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name: name})
    })
    .then(response)
    .then(data => insertRowIntoTable(data['data']))
    .catch(err => console.log(err));
}

function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        if(data.hasOwnProperty(key)) {
            if (key === "dateAdded") {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }
    tableHtml += `<td><button class="delete-row-btn" data-id ${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id ${data.id}>Edit</td>`;
    tableHtml += "</tr>";
    if (isTableData) {
        table.innerHtml = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    };
};

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');
    
    if (data.length === 0) {
        insertRowIntoTable.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";

        data.forEach(function ({id, first_name, register_date}) {
            tableHtml += "<tr>";
            // String interpolation 
            tableHtml += `<td>${id}</td>`;
            tableHtml += `<td>${first_name}</td>`;
            tableHtml += `<td>${new Date(register_date).toLocaleString()}</td>`;
            tableHtml += `<td><button class="delete-row-btn" data-id ${id}>Delete</td>`;
            tableHtml += `<td><button class="edit-row-btn" data-id ${id}>Edit</td>`;
            tableHtml += `</tr>`;
        });
        table.innerHTML = tableHtml;
    }
}