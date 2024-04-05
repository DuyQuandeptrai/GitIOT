const chart = new Chart("chartInformation", {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Temperature",
          borderColor: "red",
          backgroundColor: "red",
          lineTension: 0,
          data: [],
          fill: false,
        },
        {
          label: "Humidity",
          borderColor: "blue",
          backgroundColor: "blue",
          lineTension: 0,
          data: [],
          fill: false,
        },
        {
          label: "Light",
          borderColor: "orange",
          backgroundColor: "orange",
          lineTension: 0,
          data: [],
          fill: false,
        },
      ],
    },
    options: {
      onClick: function (event, elements) {
        if (elements.length > 0) {
          const datasetIndex = elements[0].datasetIndex;
          const meta = chart.getDatasetMeta(datasetIndex);
  
          meta.hidden = !meta.hidden;
  
          chart.update();
        }
      },
  
      scales: {
        x: {
          title: {
            display: true,
            text: "Time",
            color:"blue",
          },
        },
      },
  
      onHover(event) {
        event.target.style.cursor = "default";
      },
  
      // hover: {
      //     onHover: (event) => {
      //     event.target.style.cursor  = 'pointer';
      // }
      // },
    },
  });


function updateChart() {
    const temp = Math.floor(Math.random() * 101);
    const humid = Math.floor(Math.random() * 101);
    const light = Math.floor(Math.random() * 101);

    if (chart.data.labels.length > 10) {
        chart.data.datasets.forEach(dataset => {
            dataset.data.shift();
        });
        chart.data.labels.shift();
    }

    chart.data.datasets[0].data.push(temp);
    chart.data.datasets[1].data.push(humid);
    chart.data.datasets[2].data.push(light);
    chart.data.labels.push(new Date().toLocaleTimeString());

    document.getElementById("temperatureValue").innerText =  temp;
    document.getElementById("humidityValue").innerText = "Humidity: " + humid +' %';
    document.getElementById("lightValue").innerText = "Light: " + light + ' lux';

    chart.update();

}
setInterval(updateChart, 1000);
document.addEventListener('DOMContentLoaded', function () {
  // Lấy tất cả các nút ON/OFF
  const onButtons = document.querySelectorAll('.on-btn');
  const offButtons = document.querySelectorAll('.off-btn');

  // Đặt sự kiện cho nút ON
  onButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      // Xóa lớp 'active' từ tất cả các nút OFF
      offButtons.forEach(function (offButton) {
        offButton.classList.remove('active');
      });

      // Thêm lớp 'active' vào nút ON được click
      button.classList.add('active');
    });
  });

  // Đặt sự kiện cho nút OFF
  offButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      // Xóa lớp 'active' từ tất cả các nút ON
      onButtons.forEach(function (onButton) {
        onButton.classList.remove('active');
      });

      // Thêm lớp 'active' vào nút OFF được click
      button.classList.add('active');
    });
  });
  
});