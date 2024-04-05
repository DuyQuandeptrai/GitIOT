document.addEventListener('DOMContentLoaded', function() {
    // Gửi yêu cầu AJAX để lấy dữ liệu từ API
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/data_sensor', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            // Hiển thị dữ liệu lên trang web
            displayData(data);
        } else {
            console.error('Error fetching data:', xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error('Request failed');
    };
    xhr.send();
});

// Hàm để hiển thị dữ liệu lên trang web
function displayData(data) {
    var tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; // Xóa nội dung hiện tại của bảng

    data.forEach(function(row) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + row.ID + '</td>' +
                       '<td>' + row.Temperature + '</td>' +
                       '<td>' + row.Humidity + '</td>' +
                       '<td>' + row.Light + '</td>' +
                       '<td>' + row.Date + '</td>';
        tableBody.appendChild(tr);
    });
}
