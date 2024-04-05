// Gọi đến trang menu và đặt nó vào #menuContainer
load("menu.html", "menuContainer");

function load(url, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            container.innerHTML = xhr.responseText;
            // Thực hiện các thao tác khác nếu cần
        }
    };

    xhr.send();
}