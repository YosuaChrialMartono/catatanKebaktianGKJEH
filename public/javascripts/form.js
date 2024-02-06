// Ayat Script

// Update the pasal options based on the selected kitab
async function updatePasalOptions() {
    const kitabSelect = document.getElementById('kitab');
    const pasalSelect = document.getElementById('pasal');

    pasalSelect.innerHTML = '<option value="" selected disabled>--</option>';

    const selectedKitab = kitabSelect.value;

    try {
        // Fetch the list_pasal data from the server
        const mainUrl = window.location.origin;
        const response = await fetch(mainUrl + '/helper/pasal');
        const listPasalData = await response.json();

        const selectedKitabItem = listPasalData.data.data.find(item => item.no === parseInt(selectedKitab));

        if (selectedKitabItem) {
            for (let i = 1; i <= selectedKitabItem.chapter + 1; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                pasalSelect.appendChild(option);
            }
        }
    } catch (error) {
        console.error('Error fetching list_pasal data:', error);
    }
}

// Update the ayat options based on the selected pasal
async function updateAyatOptions() {
    const kitabSelect = document.getElementById('kitab');
    const pasalSelect = document.getElementById('pasal');
    const ayatAwalSelect = document.getElementById('ayat-awal');
    const ayatAkhirSelect = document.getElementById('ayat-akhir');

    ayatAwalSelect.innerHTML = '<option value="" selected disabled>--</option>';
    ayatAkhirSelect.innerHTML = '<option value="" selected disabled>--</option>';

    const selectedKitab = kitabSelect.value;
    const selectedPasal = pasalSelect.value;

    try {
        // Fetch the list_pasal data from the server
        const mainUrl = window.location.origin;
        const response = await fetch(mainUrl + '/helper/ayat');
        const listAyatData = await response.json();

        if (selectedKitab && selectedPasal) {
            const ayatCount = listAyatData.data[selectedKitab - 1].chapters[selectedPasal - 1].verses;

            if (ayatCount) {
                for (let i = 1; i <= parseInt(ayatCount); i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    ayatAwalSelect.appendChild(option);
                }

                for (let i = 1; i <= parseInt(ayatCount); i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    ayatAkhirSelect.appendChild(option);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching ayat data:', error);
    }
}

// Persembahan Script

async function getTotalPersembahan() {
    const persembahanForm = document.getElementById('persembahan-form');
    const persembahanFields = persembahanForm.querySelectorAll('input:not([name="amplop"])');
    let total = 0;

    persembahanFields.forEach(function (field) {
        if (field.value) {
            total += parseInt(field.value);
        }
    });

    let separatedTotal = total.toString().split('').reverse().join('').match(/.{1,3}/g).join('.').split('').reverse().join('');

    return separatedTotal;
}

async function updateTotalPersembahan() {
    const totalPersembahan = await getTotalPersembahan();
    const totalPersembahanField = document.getElementById('total-persembahan');
    totalPersembahanField.textContent = totalPersembahan;
}

// Jemaat Script

async function getTotalKehadiran() {
    const kehadiranPria = document.getElementsByName('jemaat_pria');
    let totalPria = 0;

    kehadiranPria.forEach(function (field) {
        if (field.value) {
            totalPria += parseInt(field.value);
        }
    });

    const kehadiranWanita = document.getElementsByName('jemaat_wanita');
    let totalWanita = 0;

    kehadiranWanita.forEach(function (field) {
        if (field.value) {
            totalWanita += parseInt(field.value);
        }
    });

    return [totalPria, totalWanita];
}

async function updateKehadiranJemaat() {
    const totalKehadiran = await getTotalKehadiran();
    const totalKehadiranPriaField = document.getElementById('total-kehadiran-pria');
    const totalKehadiranWanitaField = document.getElementById('total-kehadiran-wanita');

    totalKehadiranPriaField.textContent = totalKehadiran[0].toString();
    totalKehadiranWanitaField.textContent = totalKehadiran[1].toString();
}

// Majelis Bertugas Script

async function getAllMajelis() {
    let majelisList = [];

    try {
        const response = await fetch(mainUrl + '/majelis/json');
        const listMajelisData = await response.json();
        majelisList = listMajelisData.data;
    } catch (error) {
        console.error('Error fetching majelis data:', error);
    }

    return majelisList;
}

async function addMajelisBertugas() {
    listMajelis = await getAllMajelis();
    const majelisBertugasForm = document.getElementById('majelis-tugas-form');

    const majelisTugasInputDiv = document.createElement('div');
    majelisTugasInputDiv.classList.add('row-wrapper', 'form-group-child');

    const majelisInputDiv = document.createElement('div');
    majelisInputDiv.classList.add('row-wrapper', 'majelis-tugas-input');
    majelisInputDiv.id = 'majelis-input';

    const majelistLabel = document.createElement('label');
    majelistLabel.textContent = 'Majelis';
    majelisInputDiv.appendChild(majelistLabel);

    const majelisSelect = document.createElement('select');
    majelisInputDiv.appendChild(majelisSelect);

    majelisSelect.innerHTML = '<option value="" selected disabled>Pilih Majelis</option>';

    listMajelis.forEach(function (majelis) {
        const option = document.createElement('option');
        option.value = majelis.id;
        option.textContent = majelis.nama;
        majelisSelect.appendChild(option);
    });

    const tugasInputDiv = document.createElement('div');
    tugasInputDiv.classList.add('row-wrapper', 'majelis-tugas-input');
    tugasInputDiv.id = 'tugas-input';

    const tugasLabel = document.createElement('label');
    tugasLabel.textContent = 'Tugas (Opsional)';
    tugasInputDiv.appendChild(tugasLabel);

    const tugasInput = document.createElement('input');
    tugasInput.setAttribute('type', 'text');
    tugasInput.setAttribute('name', 'tugas');
    tugasInput.setAttribute('placeholder', 'Masukkan tugas majelis');
    tugasInputDiv.appendChild(tugasInput);

    majelisTugasInputDiv.appendChild(majelisInputDiv);
    majelisTugasInputDiv.appendChild(tugasInputDiv);

    majelisBertugasForm.appendChild(majelisTugasInputDiv);
}

// Update majelis selections
async function updateMajelisOptions() {
    listMajelis = await getAllMajelis();
    
    const picIbadahSelect = document.getElementById('pic-ibadah-selection');
    const majelisPembuatSelect = document.getElementById('majelis-pembuat-selection');

    picIbadahSelect.innerHTML = '<option value="" selected disabled>Pilih Majelis</option>';
    majelisPembuatSelect.innerHTML = '<option value="" selected disabled>Pilih Majelis</option>';

    listMajelis.forEach(function (majelis) {
        const option = document.createElement('option');
        option.value = majelis.id;
        option.textContent = majelis.nama;
        picIbadahSelect.appendChild(option);
        majelisPembuatSelect.appendChild(option.cloneNode(true));
    });
}

async function submitForm() {
    const form = document.getElementById('catatan-form');
    const action = form.getAttribute('action');
    const method = form.getAttribute('method');

    // Check if the form is valid
    console.log(form.elements)
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].value === '' && form.elements[i].hasAttribute('required')) {
            alert('Tolong isi semua field yang bertanda *');
            return;
        }
    }
}

// Main Script
const mainUrl = window.location.origin;

document.addEventListener('DOMContentLoaded', function () {
    // Perikop Selection Script
    const kitabSelect = document.getElementById('kitab');
    kitabSelect.addEventListener('change', updatePasalOptions);

    const pasalSelect = document.getElementById('pasal');
    pasalSelect.addEventListener('change', updateAyatOptions);

    updatePasalOptions();
    updateAyatOptions();
    updateMajelisOptions();

    // Persembahan Script
    updateTotalPersembahan();

    const persembahanForm = document.getElementById('persembahan-form');
    persembahanForm.addEventListener('input', function () {
        updateTotalPersembahan();
    });

    // Kehadiran Jemaat Script
    updateKehadiranJemaat();

    const kehadiranForm = document.getElementById('kehadiran-jemaat-form');
    kehadiranForm.addEventListener('input', function () {
        updateKehadiranJemaat();
    });

    // Reset Form Script
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', function () {
        console.log('resetting form');

        // Reset Persembahan Count
        const totalPersembahan = document.getElementById('total-persembahan');
        totalPersembahan.textContent = '0';

        // Reset Kehadiran Jemaat Count
        const totalKehadiranPriaField = document.getElementById('total-kehadiran-pria');
        const totalKehadiranWanitaField = document.getElementById('total-kehadiran-wanita');

        totalKehadiranPriaField.textContent = '0';
        totalKehadiranWanitaField.textContent = '0';

        updateMajelisOptions();
    });
});
