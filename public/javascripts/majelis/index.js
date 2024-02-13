async function getAllMajelis() {
    let majelisList = [];

    try {
        const response = await fetch('/majelis/json');
        const majelisListData = await response.json();

        if (majelisListData.status === 200) {
            majelisList = majelisListData.data;
        } else {
            makeToast('error', majelisListData.message);
        }
    } catch (error) {
        console.error('Error fetching majelis data:', error);
    }

    return majelisList;
}

async function getMajelis(id) {
    let majelis = {};

    try {
        const response = await fetch('/majelis/json/' + id);
        const majelisData = await response.json();

        if (majelisData.status === 200) {
            majelis = majelisData.data;
        } else {
            makeToast('error', majelisData.message);
        }
    } catch (error) {
        console.error('Error fetching majelis data:', error);
    }

    return majelis;
}

async function updateMajelisGrid(showToast = false) {
    const majelis = await getAllMajelis();
    console.log("Updating Majelis Grid")
    majelisGrid.innerHTML = '';

    if (majelis.length === 0) {
        let emptyDataDiv = document.createElement('div');
        emptyDataDiv.classList.add('no-data');
        emptyDataDiv.innerHTML = 'Tidak ada majelis';
        majelisGrid.appendChild(emptyDataDiv);
    } else {
        let cardGrid = document.createElement('div');
        cardGrid.classList.add('card-grid');
        majelis.forEach(function (majelis) {
            const id = majelis.majelis_id;

            let cardItem = document.createElement('div');
            cardItem.classList.add('card-item', 'col-wrapper');
            let namaMajelis = document.createElement('h2');
            namaMajelis.innerHTML = gelarAbbr[majelis.gelar] + " " + majelis.nama;
            let wilayahMajelis = document.createElement('p');
            wilayahMajelis.innerHTML = "Wilayah " + majelis.wilayah;

            let cardButton = document.createElement('div');
            cardButton.classList.add('card-button', 'row-wrapper');

            let editButton = document.createElement('button');
            editButton.classList.add('edit-button', 'button-17');
            editButton.innerHTML = 'Edit';
            editButton.onclick = function () {
                editMajelis(id);
            }

            let deleteButton = document.createElement('button');
            deleteButton.classList.add('btn-warning', 'button-17');
            deleteButton.innerHTML = 'Hapus';
            deleteButton.onclick = function () {
                deleteMajelis(id);
            }

            cardButton.appendChild(editButton);
            cardButton.appendChild(deleteButton);

            cardItem.appendChild(namaMajelis);
            cardItem.appendChild(wilayahMajelis);
            cardItem.appendChild(cardButton);

            cardGrid.appendChild(cardItem);
        }
        )
        majelisGrid.appendChild(cardGrid);
    }
    if (showToast) {
        makeToast('info', 'Majelis grid updated');
    }
}

function deleteMajelis(id) {
    let deletePermission = confirm('Apakah anda yakin ingin menghapus majelis ini?');
    if (deletePermission) {
        fetch('/majelis/delete/' + id, {
            method: 'DELETE'
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.status === 200) {
                    makeToast('success', data.message);
                    updateMajelisGrid();
                } else {
                    makeToast('error', data.message);
                }
            })
            .catch(error => {
                makeToast('error', error);
            });
    }
}

async function createMajelis() {

    let majelis = {};

    // Set the submit button to update
    let submitButton = document.getElementById('modal-majelis-submit');

    submitButton.innerHTML = 'Create';

    submitButton.onclick = function () {
        console.log('Creating Majelis')
        majelisForm.querySelectorAll('.form-group').forEach(function (formDiv) {
            formDiv.querySelectorAll('.input-div').forEach(function (inputDiv) {
                let input = inputDiv.querySelector('input');
                if (input === null) {
                    return;
                }
                let helperText = inputDiv.querySelector('.helper-text');

                if (input.value.length === 0) {
                    helperText.innerHTML = 'Input ini diperlukan';
                }
                else {
                    helperText.innerHTML = '';
                }
                majelis[input.name] = input.value;
            })
            formDiv.querySelectorAll('select').forEach(function (select) {
                majelis[select.name] = select.value;
            })
        });

        fetch('/majelis/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(majelis)
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.status === 200) {
                    makeToast('success', data.message);
                    updateMajelisGrid();
                    resetForm(majelisForm, true);
                    hideModal();
                } else {
                    makeToast('warning', data.message);
                }

                // If there is a 'majelis' property in the response, you can access it
                if (data.majelis) {
                    console.log(data.majelis);
                }
            })
            .catch(error => {
                makeToast('error', error);
            });
    }
    showModal();

}


async function editMajelis(id) {
    let majelis = await getMajelis(id);

    // Set the form values
    majelisForm.querySelectorAll('.form-group').forEach(function (formDiv) {
        formDiv.querySelectorAll('input').forEach(function (input) {
            input.value = majelis[input.name];
        })
        formDiv.querySelectorAll('select').forEach(function (select) {
            select.value = majelis[select.name];
        })
    });

    // Set the submit button to update
    let submitButton = document.getElementById('modal-majelis-submit');

    submitButton.innerHTML = 'Update';

    submitButton.onclick = function () {
        majelisForm.querySelectorAll('.form-group').forEach(function (formDiv) {
            formDiv.querySelectorAll('.input-div').forEach(function (inputDiv) {
                let input = inputDiv.querySelector('input');
                if (input === null) {
                    return;
                }
                let helperText = inputDiv.querySelector('.helper-text');

                if (input.value.length === 0) {
                    helperText.innerHTML = 'Input ini diperlukan';
                }
                else {
                    helperText.innerHTML = '';
                }
                majelis[input.name] = input.value;
            })
            formDiv.querySelectorAll('select').forEach(function (select) {
                majelis[select.name] = select.value;
            })
        });

        console.log('Updating majelis');
        fetch('/majelis/update/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(majelis)
        })
            .then(response => {
                // Use response.json() to parse the JSON in the response
                return response.json();
            })
            .then(data => {
                if (data.status === 200) {
                    makeToast('success', data.message);
                    updateMajelisGrid();
                    resetForm(majelisForm, true);
                    hideModal();
                } else {
                    makeToast('warning', data.message);
                }

                // If there is a 'majelis' property in the response, you can access it
                if (data.majelis) {
                    console.log(data.majelis);
                }
            })
            .catch(error => {
                makeToast('error', error);
            });
    }

    // Show the modal
    showModal();
}


const majelisGrid = document.getElementById('majelis-grid');
const majelisForm = document.getElementById('majelis-form');

const gelarAbbr = {
    "Penatua": "Pnt",
    "Diaken": "Dkn"
}

const wilayahGereja = [
    "Paseltan",
    "Pasutra",
    "Pandur",
    "Teruri",
    "Pulobalimentas"
]

document.addEventListener('DOMContentLoaded', function () {
    updateMajelisGrid();
});