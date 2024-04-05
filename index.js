// var mqtt = require('mqtt');
// var mysql = require('mysql');

// var mqttOptions = {
//     host: '192.168.100.224',
//     port: 3000,
//     protocol: 'mqtt',
//     username: 'quan1234',
//     password: 'quan1234'
// };

// var mysqlConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: 'quan1234',
//     database: 'iot'
// };

// // Initialize MQTT client
// var mqttClient = mqtt.connect(mqttOptions);

// // Initialize MySQL connection
// var mysqlConnection = mysql.createConnection(mysqlConfig);

// // MQTT connect event
// mqttClient.on('connect', function () {
//     console.log('Connected to MQTT broker');
//     // Subscribe to the topic where sensor data is published
//     mqttClient.subscribe('sensor');
// });

// mqttClient.on('message', (topic, message) => {
//     console.log('Nhận được dữ liệu từ topic:', topic);
//     console.log('Nội dung:', message.toString());

//     try {
//         const data = JSON.parse(message); // Chuyển đổi chuỗi JSON thành đối tượng JavaScript

//         // Lưu dữ liệu vào cơ sở dữ liệu MySQL
//         const query = 'INSERT INTO sensor_data (temperature, humidity, light, created_at) VALUES (?, ?, ?, NOW())';
//         const values = [data.temperature, data.humidity, data.light];

//         mysqlConnection.query(query, values, (err, results, fields) => {
//             if (err) {
//                 console.error('Lỗi khi thêm dữ liệu vào MySQL:', err);
//                 return;
//             }
//             console.log('Dữ liệu đã được lưu vào MySQL');
//         });
//     } catch (error) {
//         console.error('Lỗi khi xử lý dữ liệu:', error);
//     }
// });

// mqttClient.on('connect', function () {
//     console.log('Connected to MQTT broker');
//     // Subscribe to the topics for controlling the devices
//     mqttClient.subscribe('led');
//     mqttClient.subscribe('fan');
// });

// mqttClient.on('message', (topic, message) => {
//     console.log('Received message from topic:', topic);
//     console.log('Content:', message.toString());

//     var device;
//     if (topic === 'led') {
//         device = 'LED';
//     } else if (topic === 'fan') {
//         device = 'FAN';
//     } else {
//         console.log('Unknown topic:', topic);
//         return;
//     }

//     var action = message.toString();
//     saveDeviceAction(device, action);
// });
// function saveDeviceAction(device, action) {
//     // Save device action to MySQL database
//     var query = 'INSERT INTO device_actions (Device, action) VALUES (?, ?)';
//     var values = [device, action];

//     mysqlConnection.query(query, values, (err, results, fields) => {
//         if (err) {
//             console.error('Error saving device action to MySQL:', err);
//             return;
//         }
//         console.log('Device action saved to MySQL');
//     });
// }
// // MySQL connect event
// mysqlConnection.connect(function (error) {
//     if (error) {
//         console.error('Error connecting to MySQL:', error);
//     } else {
//         console.log('Connected to MySQL database');
//     }
// });
const express = require('express')
const app = express()

const swaggerJSdoc  = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')



app.use(express.json())
var database 

const options = {
    definition:{
        openapi : '3.0.0',
        info : {
            title: 'Node JS API project',
            version: '1.0.0'
        },
        servers: [
            {
                api : 'http://localhost:3000/'
            }
        ]
    },
    apis : ['back-end\\index.js']
}

const swaggerSpec = swaggerJSdoc(options)
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerSpec))


app.listen(3000, () => {
    console.log(`Server đang chạy trên cổng 3000`);
});