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
