function makeToast(type, message) {
    const types = ["success", "warning", "info", "error"];
    if (!types.includes(type)) {
        type = "none";
    }

    let toast = document.createElement("div");
    toast.classList.add("toast", toastClass[type]);

    let toastRibbon = document.createElement("div");
    toastRibbon.classList.add("toast-ribbon");

    let toastContent = document.createElement("div");
    toastContent.classList.add("toast-content");

    let toastIcon = document.createElement("div");
    toastIcon.classList.add("toast-icon");
    toastIcon.innerHTML = toastIcons[type];

    let toastText = document.createElement("div");
    toastText.classList.add("toast-text");

    let toastTitle = document.createElement("div");
    toastTitle.classList.add("toast-title");

    let toastMessage = document.createElement("div");
    toastMessage.classList.add("toast-message");

    toastTitle.innerHTML = type;
    toastMessage.innerHTML = message;

    toastText.appendChild(toastTitle);
    toastText.appendChild(toastMessage);

    let toastClose = document.createElement("div");
    toastClose.classList.add("toast-close-button");
    toastClose.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 21 21">
                    <path stroke="#BABABA" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"
                        d="M2 19 19 2M2 2l17 17" />
                </svg>
        `;

    toastClose.addEventListener("click", function () {
        toast.style.display = "none";
    });

    toastContent.appendChild(toastIcon);
    toastContent.appendChild(toastText);
    toastContent.appendChild(toastClose);

    toast.appendChild(toastRibbon);
    toast.appendChild(toastContent);

    let toastContainer = document.querySelector(".toast-container");
    toastContainer.appendChild(toast);
};

document.addEventListener("DOMContentLoaded", function () {
    const toastContainer = document.createElement("div");
    toastContainer.classList.add("toast-container", "col-wrapper");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
});

const toastClass = {
    "success": "success-toast",
    "warning": "warning-toast",
    "info": "info-toast",
    "error": "error-toast",
    "none" : "none-toast"
}

const toastIcons = {
    "success":
        `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="none" viewBox="0 0 52 52">
    <path fill="#46D663" stroke="#46D663" stroke-width="2"
        d="M26 45.5c10.77 0 19.5-8.73 19.5-19.5S36.77 6.5 26 6.5 6.5 15.23 6.5 26 15.23 45.5 26 45.5Z" />
    <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="6"
        d="m17.333 26 6.5 6.5 10.834-10.833" />
</svg>`,
    "warning":
        `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="none" viewBox="0 0 52 52">
    <g clip-path="url(#a)">
      <path fill="#FEBF21" stroke="#FEBF21" stroke-width="2" d="M26 45.5c10.77 0 19.5-8.73 19.5-19.5S36.77 6.5 26 6.5 6.5 15.23 6.5 26 15.23 45.5 26 45.5Z"/>
      <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="6.5" d="M25.892 35.75h.216"/>
      <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="6" d="M26 26V15.167"/>
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h52v52H0z"/>
      </clipPath>
    </defs>
  </svg>
  `,
    "info":
        `
    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="none" viewBox="0 0 52 52">
  <path fill="#2F86EA" stroke="#2F86EA" stroke-width="2" d="M26 45.5c10.77 0 19.5-8.73 19.5-19.5S36.77 6.5 26 6.5 6.5 15.23 6.5 26 15.23 45.5 26 45.5Z"/>
  <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="7" d="M26.163 17H26m0 10v9"/>
</svg>
    `,
    "error":
        `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="none" viewBox="0 0 52 52">
    <path fill="#FE345B" stroke="#FE345B" stroke-width="2" d="M26 45.5c10.77 0 19.5-8.73 19.5-19.5S36.77 6.5 26 6.5 6.5 15.23 6.5 26 15.23 45.5 26 45.5Z"/>
    <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m18 35 17-17m-17 0 17 17"/>
  </svg>
` ,
"none": `
<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="none" viewBox="0 0 52 52">
  <path fill="#000" stroke="#000" stroke-width="2" d="M26 45.5c10.77 0 19.5-8.73 19.5-19.5S36.77 6.5 26 6.5 6.5 15.23 6.5 26 15.23 45.5 26 45.5Z"/>
  <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="7" d="M18 26h16"/>
</svg>

`
};
