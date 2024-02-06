// Highlight the active page in the navigation bar
document.addEventListener('DOMContentLoaded', function () {
    var menuItems = document.querySelectorAll('.menu a');
    var currentPage = window.location.pathname;
    menuItems.forEach(function (menuItem) {
        if (menuItem.getAttribute('href') === currentPage) {
            menuItem.classList.add('active');
            menuItem.ariaCurrent = 'page';
        }
    });
});