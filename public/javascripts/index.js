async function showModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    const modalBackground = document.getElementById("container");
    modalBackground.classList.add("container-blur");
    const modalClose = document.getElementById("modal-close-button");
    modalClose.addEventListener("click", hideModal);
}

async function hideModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    const modalBackground = document.getElementById("container");
    modalBackground.classList.remove("container-blur");
}

const modalForm = document.getElementById("modal-form");
const modalResetButton = document.getElementById("modal-reset-button");
modalResetButton.addEventListener("click", function () {
    resetForm(getModalForm());
});


async function resetForm(form, bypass = false) {
    console.log("resetting form with bypass = " + bypass)
    if (!bypass) {
        let resetPermission = confirm('Apakah anda yakin ingin mereset form?');
        if (!resetPermission) {
            return;
        }
    }
    form.querySelectorAll('.form-group').forEach(function (formDiv) {
        formDiv.querySelectorAll('input').forEach(function (input) {
            input.value = '';
        })
    });
}