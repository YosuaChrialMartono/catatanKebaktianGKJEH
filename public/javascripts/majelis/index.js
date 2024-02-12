async function getAllMajelis() {
    let majelisList = [];

    try {
        const response = await fetch('/majelis/json');
        const majelisListData = await response.json();
        majelisList = majelisListData.data;
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
        majelis = majelisData.data;
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

            let cardItem = document.createElement('div');
            cardItem.classList.add('card-item', 'col-wrapper');
            let namaMajelis = document.createElement('h2');
            namaMajelis.innerHTML = majelis.nama;
            let wilayahMajelis = document.createElement('p');
            wilayahMajelis.innerHTML = majelis.wilayah;
            let gelarMajelis = document.createElement('p');
            gelarMajelis.innerHTML = majelis.gelar;

            let cardButton = document.createElement('div');
            cardButton.classList.add('card-button', 'row-wrapper');

            let editButton = document.createElement('button');
            editButton.classList.add('edit-button', 'button-17');
            editButton.innerHTML = 'Edit';
            editButton.onclick = function () {
                editMajelis(majelis.majelis_id);
            }

            let deleteButton = document.createElement('button');
            deleteButton.classList.add('btn-warning', 'button-17');
            deleteButton.innerHTML = 'Hapus';
            deleteButton.onclick = function () {
                let deletePermission = confirm('Apakah anda yakin ingin menghapus majelis ini?');
                if (deletePermission) {
                    fetch('/majelis/delete/' + majelis.majelis_id, {
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
                                makeToast('warning', data.message);
                            }
                        })
                        .catch(error => {
                            makeToast('error', error);
                        });
                }
            }

            cardButton.appendChild(editButton);
            cardButton.appendChild(deleteButton);

            cardItem.appendChild(namaMajelis);
            cardItem.appendChild(wilayahMajelis);
            cardItem.appendChild(gelarMajelis);
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

async function resetForm(bypass = false) {
    if (!bypass) {
        let resetPermission = confirm('Apakah anda yakin ingin mereset form?');
        if (!resetPermission) {
            return;
        }
    }
    majelisForm.querySelectorAll('.form-group').forEach(function (formDiv) {
        formDiv.querySelectorAll('input').forEach(function (input) {
            input.value = '';
        })
    });
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
                let helperText = inputDiv.querySelector('.helper-text');

                if (input.value.length === 0) {
                    helperText.innerHTML = 'Input ini diperlukan';
                }
                else {
                    helperText.innerHTML = '';
                }
                majelis[input.name] = input.value;
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
                    resetForm(true);
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
    });

    // Set the submit button to update
    let submitButton = document.getElementById('modal-majelis-submit');

    submitButton.innerHTML = 'Update';

    submitButton.onclick = function () {
        majelisForm.querySelectorAll('.form-group').forEach(function (formDiv) {
            formDiv.querySelectorAll('.input-div').forEach(function (inputDiv) {
                let input = inputDiv.querySelector('input');
                let helperText = inputDiv.querySelector('.helper-text');

                if (input.value.length === 0) {
                    helperText.innerHTML = 'Input ini diperlukan';
                }
                else {
                    helperText.innerHTML = '';
                }
                majelis[input.name] = input.value;
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
                    resetForm(true);
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

document.addEventListener('DOMContentLoaded', function () {
    updateMajelisGrid();
});