const express = require('express')
const app = express()
const mysql = require('mysql')
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
                url : 'http://localhost:4000/'
            }
        ]
        
    },
    
    apis : ['D:\\Ki2Nam4\\IOT\\index2.js']
}
app.listen(4000, () => {
    console.log(`Server đang chạy trên cổng 4000`);
});
const swaggerSpec = swaggerJSdoc(options)
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerSpec))
var mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: 'quan1234',
    database: 'iot'
};
var mysqlConnection = mysql.createConnection(mysqlConfig);

// Kết nối đến cơ sở dữ liệu MySQL
mysqlConnection.connect((err) => {
if (err) {
   console.error('Error connecting to MySQL:', err);
   return;
}
console.log('Connected to MySQL database');
});
/**
 * @swagger
 * /data_sensor: 
 *  get: 
 *      summary: This api is used to check if get method 
 *      description: this api used check
 *      tags:
 *         - Data Sensor
 *      responses:
 *          200:
 *              description: To test Get method
 */
// Định nghĩa API để lấy dữ liệu từ cơ sở dữ liệu
app.get('/data_sensor', (req, res) => {
    // Thực hiện truy vấn cơ sở dữ liệu
    mysqlConnection.query('SELECT * FROM sensor_data', (error, results, fields) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
    });
});
/**
 * @swagger
 * /data_sensor/addData: 
 *   post: 
 *      summary: Add new sensor data
 *      description: Add new sensor data to the database
 *      tags:
 *         - Data Sensor
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                temperature:
 *                  type: number
 *                humidity:
 *                  type: number
 *                light:
 *                  type: number
 *      responses:
 *          201:
 *              description: Data added successfully
 *          400:
 *              description: Bad request. Missing required fields or invalid data
 *          500:
 *              description: Internal Server Error
 */

app.post('/data_sensor/addData', (req, res) => {
    const { temperature, humidity, light } = req.body;
    
    if (!temperature || !humidity || !light) {
        return res.status(400).json({ error: 'Temperature, humidity, and light are required' });
    }

    const query = 'INSERT INTO sensor_data (temperature, humidity, light, created_at) VALUES (?, ?, ?, NOW())';
    mysqlConnection.query(query, [temperature, humidity, light], (error, results, fields) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'Data added successfully' });
    });
});
/**
 * @swagger
 * /data_sensor/{id}: 
 *   put: 
 *      summary: Update sensor data by ID
 *      description: Update sensor data in the database by ID
 *      tags:
 *         - Data Sensor
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Numeric ID of the sensor data to update
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                temperature:
 *                  type: number
 *                humidity:
 *                  type: number
 *                light:
 *                  type: number
 *      responses:
 *          200:
 *              description: Data updated successfully
 *          400:
 *              description: Bad request. Missing required fields or invalid data
 *          404:
 *              description: Data not found
 *          500:
 *              description: Internal Server Error
 */
app.put('/data_sensor/:id', (req, res) => {
    const { id } = req.params;
    const { temperature, humidity, light } = req.body;

    if (!temperature && !humidity && !light) {
        return res.status(400).json({ error: 'At least one field (temperature, humidity, light) must be provided for update' });
    }

    const updateFields = {};
    if (temperature) updateFields.temperature = temperature;
    if (humidity) updateFields.humidity = humidity;
    if (light) updateFields.light = light;

    const query = 'UPDATE sensor_data SET ? WHERE id = ?';
    mysqlConnection.query(query, [updateFields, id], (error, results, fields) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }

        res.status(200).json({ message: 'Data updated successfully' });
    });
});
/**
 * @swagger
 * /data_sensor/{id}: 
 *   delete: 
 *      summary: Delete sensor data by ID
 *      description: Delete sensor data from the database by ID
 *      tags:
 *         - Data Sensor
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Numeric ID of the sensor data to delete
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              description: Data deleted successfully
 *          404:
 *              description: Data not found
 *          500:
 *              description: Internal Server Error
 */
app.delete('/data_sensor/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM sensor_data WHERE id = ?';
    mysqlConnection.query(query, id, (error, results, fields) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }

        res.status(200).json({ message: 'Data deleted successfully' });
    });
});

/**
 * @swagger
 * /data_sensor/sort_Temp: 
 *  get: 
 *      summary: Retrieve sensor data sorted by temperature
 *      description: This API endpoint retrieves sensor data from the database and sorts it by temperature in ascending order.
 *      tags:
 *         - Data Sensor
 *      responses:
 *          200:
 *              description: Sensor data sorted by temperature
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                  temperature:
 *                                      type: number
 *                                  humidity:
 *                                      type: number
 *                                  light:
 *                                      type: number
 *                                  created_at:
 *                                      type: string
 */
app.get('/data_sensor/sort_Temp', (req, res) => {
    // Thực hiện truy vấn cơ sở dữ liệu và sắp xếp theo nhiệt độ
    mysqlConnection.query('SELECT * FROM sensor_data ORDER BY temperature ASC', (error, results, fields) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
    });
});

/**
 * @swagger
 * /data_sensor/search_by_id: 
 *  get: 
 *      summary: Retrieve sensor data by ID
 *      description: This API endpoint retrieves sensor data from the database based on the provided ID.
 *      tags:
 *         - Data Sensor
 *      parameters:
 *        - in: query
 *          name: id
 *          required: true
 *          description: Numeric ID of the sensor data to retrieve
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              description: Sensor data retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              temperature:
 *                                  type: number
 *                              humidity:
 *                                  type: number
 *                              light:
 *                                  type: number
 *                              created_at:
 *                                  type: string
 *          404:
 *              description: Data not found
 *          500:
 *              description: Internal Server Error
 */
app.get('/data_sensor/search_by_id', (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'ID parameter is required' });
    }

    // Thực hiện truy vấn cơ sở dữ liệu để tìm kiếm dữ liệu theo ID
    mysqlConnection.query('SELECT * FROM sensor_data WHERE id = ?', [id], (error, results, fields) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }

        // Trả về kết quả dưới dạng JSON
        res.json(results[0]);
    });
});





/**
 * @swagger
 * /action_history: 
 *  get: 
 *      summary: This api is used to check if get method 
 *      description: this api used check
 *      tags:
 *         - Action History
 *      responses:
 *          200:
 *              description: To test Get method
 */
// Định nghĩa API để lấy dữ liệu từ cơ sở dữ liệu
app.get('/action_history', (req, res) => {
    // Thực hiện truy vấn cơ sở dữ liệu
    mysqlConnection.query('SELECT * FROM device_actions', (error, results, fields) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
    });
});
/**
 * @swagger
 * /action_history/addData: 
 *   post: 
 *      summary: Add new sensor data
 *      description: Add new sensor data to the database
 *      tags:
 *         - Action History
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                Device:
 *                  type: string
 *                action:
 *                  type: string
 *               
 *      responses:
 *          201:
 *              description: Data added successfully
 *          400:
 *              description: Bad request. Missing required fields or invalid data
 *          500:
 *              description: Internal Server Error
 */

app.post('/action_history/addData', (req, res) => {
    const { Device, action } = req.body;
    
    if (!Device || !action) {
        return res.status(400).json({ error: 'Device, action are required' });
    }

    const query = 'INSERT INTO device_actions (Device, action,created_at) VALUES (?, ?, NOW())';
    mysqlConnection.query(query, [Device, action], (error, results, fields) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        res.status(201).json({ message: 'Data added successfully' });
    });
});

/**
 * @swagger
 * /action_history/{id}: 
 *   put: 
 *      summary: Update sensor data by ID
 *      description: Update sensor data in the database by ID
 *      tags:
 *         - Action History
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Numeric ID of the sensor data to update
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                Device:
 *                  type: string
 *                action:
 *                  type: string
 *      responses:
 *          200:
 *              description: Data updated successfully
 *          400:
 *              description: Bad request. Missing required fields or invalid data
 *          404:
 *              description: Data not found
 *          500:
 *              description: Internal Server Error
 */
app.put('/action_history/:id', (req, res) => {
    const { id } = req.params;
    const { Device, action } = req.body;

    if (!Device && !action ) {
        return res.status(400).json({ error: 'At least one field (Device, action) must be provided for update' });
    }

    const updateFields = {};
    if (Device) updateFields.Device = Device;
    if (action) updateFields.action = action;

    const query = 'UPDATE device_actions SET ? WHERE id = ?';
    mysqlConnection.query(query, [updateFields, id], (error, results, fields) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }

        res.status(200).json({ message: 'Data updated successfully' });
    });
});

/**
 * @swagger
 * /action_history/{id}: 
 *   delete: 
 *      summary: Delete sensor data by ID
 *      description: Delete sensor data from the database by ID
 *      tags:
 *         - Action History
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Numeric ID of the sensor data to delete
 *          schema:
 *            type: integer
 *      responses:
 *          200:
 *              description: Data deleted successfully
 *          404:
 *              description: Data not found
 *          500:
 *              description: Internal Server Error
 */
app.delete('/action_history/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM device_actions WHERE id = ?';
    mysqlConnection.query(query, id, (error, results, fields) => {
        if (error) {
            console.error('Error querying database:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }

        res.status(200).json({ message: 'Data deleted successfully' });
    });
});