async function getAllPelayanFirman() {
    let pelayanFirmanList = [];

    try {
        const response = await fetch('/pelayan-firman/json');
        const data = await response.json();

        if (data.status === 200) {
            pelayanFirmanList = data.data;
        } else {
            makeToast('error', data.message);
        }
    }
    catch (error) {
        console.error('Error fetching pelayan firman data:', error);
    }

    return pelayanFirmanList;
}

async function getPelayanFirman(id) {
    let pelayanFirman = {};

    try {
        const response = await fetch('/pelayan-firman/json/' + id
        );
        const data = await response.json();

        if (data.status === 200) {
            pelayanFirman = data.data
        }
        else {
            makeToast('error', data.message);
        }
    }
    catch (error) {
        console.error('Error fetching pelayan firman data:', error);
    }

    return pelayanFirman;
}

async function updatePelayanFirmanGrid(showToast = false) {
    const pelayanFirman = await getAllPelayanFirman();
    console.log("Updating Pelayan Firman Grid")
    pelayanFirmanGrid.innerHTML = '';

    if (pelayanFirman.length === 0) {
        let emptyDataDiv = document.createElement('div');
        emptyDataDiv.classList.add('no-data');
        emptyDataDiv.innerHTML = 'Tidak ada pelayan firman';
        pelayanFirmanGrid.appendChild(emptyDataDiv);
    } else {
        let cardGrid = document.createElement('div');
        cardGrid.classList.add('card-grid');
        pelayanFirman.forEach(function (pelayanFirman) {
            const id = pelayanFirman.pelayan_firman_id;

            let cardItem = document.createElement('div');
            cardItem.classList.add('card-item', 'col-wrapper');
            let namaPelayanFirman = document.createElement('h2');
            namaPelayanFirman.innerHTML = pelayanFirman.nama;
            let asalPelayanFirman = document.createElement('p');
            asalPelayanFirman.innerHTML = "Asal " + pelayanFirman.asal;

            let cardButton = document.createElement('div');
            cardButton.classList.add('card-button, row-wrapper');

            let editButton = document.createElement('button');
            editButton.classList.add('edit-button', 'button-17');
            editButton.innerHTML = 'Edit';
            editButton.onclick = function () {
                editPelayanFirman(id);
            }

            let deleteButton = document.createElement('button');
            deleteButton.classList.add('btn-warning', 'button-17');
            deleteButton.innerHTML = 'Hapus';
            deleteButton.onclick = function () {
                deletePelayanFirman(id);
            }

            cardButton.appendChild(editButton);
            cardButton.appendChild(deleteButton);

            cardItem.appendChild(namaPelayanFirman);
            cardItem.appendChild(asalPelayanFirman);
            cardItem.appendChild(cardButton);

            cardGrid.appendChild(cardItem);
        });

        pelayanFirmanGrid.appendChild(cardGrid);
    }
    if (showToast) {
        makeToast('success', 'Pelayan Firman berhasil dihapus');
    }
}

function deletePelayanFirman(id) {
    if (confirm('Apakah Anda yakin ingin menghapus pelayan firman ini?')) {
        fetch('/pelayan-firman/delete/' + id, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    updatePelayanFirmanGrid(true);
                } else {
                    makeToast('error', data.message);
                }
            })
            .catch(error => {
                makeToast('error', error);
            });
    }
}

