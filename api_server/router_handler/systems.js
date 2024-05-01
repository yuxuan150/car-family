// This is the route handler module

// Import the database operation module
const db = require('../db/index')
const bcrypt = require('bcryptjs')
const pb = require('./publics')

exports.listCompanySimple = (req, res) => {
    pb.getCompanySimple(req, res)
};

/** User CRUD Begin .............................. */
// Get user list
exports.listUsers = (req, res) => {
    const userId = req.query.userId || ''

    const sql = `SELECT a.*,b.city_name FROM ev_users a left join location b on a.location_id=b.locationID 
        where 1=1 and a.userId like '%${userId}%'
    `;

    db.query(sql, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'Get users list success!',
            titles: ['userid', 'username', 'city_name', 'role'],
            data: results
        });
    });
};

// Get single user information
exports.getUser = (req, res) => {
    const userId = req.query.id || '';
    const sql = `SELECT a.userid,a.username,a.location_id,a.role FROM ev_users a WHERE a.userid = ?`;
    db.query(sql, userId, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'Get user info success!',
            data: results[0]
        });
    });
};

// Add user information
exports.addUser = (req, res) => {
    const newUser = req.body;
    var password = bcrypt.hashSync(newUser.password, 10)
    var columns = { password: password }
    const titles = ['userid', 'username', 'location_id', 'role']
    titles.forEach(key => {
        columns[key] = newUser[key]
    })

    const sql = `INSERT INTO ev_users SET ?`;
    db.query(sql, columns, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'Add user success!',
            data: results
        });
    });
};

// Update user information
exports.updateUser = (req, res) => {
    const userId = req.query.id;
    const updatedUser = req.body;

    var columns = {}
    if (updatedUser.password.length > 0) {
        var password = bcrypt.hashSync(updatedUser.password, 10)
        columns['password'] = password
    }
    const titles = ['username', 'location_id', 'role']
    titles.forEach(key => {
        columns[key] = updatedUser[key]
    })
    const sql = `UPDATE ev_users SET ? WHERE userid = ?`;
    db.query(sql, [columns, userId], (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'Update user success!',
            data: results
        });
    });
};

// Delete user information
exports.deleteUser = (req, res) => {
    const userId = req.query.id;
    const sql = `DELETE FROM ev_users WHERE userid = ?`;
    db.query(sql, userId, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'Delete user success!',
            data: results
        });
    });
};

/** User CRUD End ................................................................ */

exports.listLocations = (req, res) => {
    pb.getLocation(req, res)
};

exports.getLocation = (req, res) => {
    // Receive form data
    const locationID = req.query.id || ''
    // Define SQL statement
    const sql = `SELECT * from location where locationID = ${locationID}`
    // Execute SQL statement to retrieve user information based on username
    db.query(sql, (err, results) => {
        // If executing SQL statement fails
        if (err) return res.cc(err)
        // Respond with Token to the client via res.send()
        res.send({
            status: 0,
            message: 'Get location list ok',
            data: results[0]
        })
    })
};

// Add location information
exports.addLocation = (req, res) => {
    // Get the data for the new location
    const newLocation = req.body;

    // Execute the SQL statement to insert data
    const sql = `INSERT INTO location SET ?`;
    var columns = ["city_name", "latitude", "longitude"]
    var items = {}
    columns.forEach(x => {
        items[x] = newLocation[x]
    })
    db.query(sql, items, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'Add location success!',
            data: results
        });
    });
};

// Update location information
exports.updateLocation = (req, res) => {
    // Get the ID of the location to be updated
    const id = req.query.id;
    // Get the data for the updated location
    const updatedLocation = req.body;

    // Execute the SQL statement to update data
    const sql = `UPDATE location SET ? WHERE locationID = ?`;
    var columns = ["locationID", "city_name", "latitude", "longitude"]
    var items = {}
    columns.forEach(x => {
        items[x] = updatedLocation[x]
    })
    db.query(sql, [items, id], (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'Update location success!',
            data: results
        });
    });
};

// Delete location information
exports.deleteLocation = (req, res) => {
    // Get the ID of the location to be deleted
    const id = req.query.id

    // Execute the SQL statement to delete data
    const sql = `DELETE FROM location WHERE locationID = ?`;

    db.query(sql, id, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'Delete location success!',
            data: results
        });
    });
};

exports.getLogs = (req, res) => {
    // Receive form data
    const userid = req.query.user_id || ''
    // Define SQL statement
    const sql = `SELECT a.id, a.userId, a.method, a.path, a.ip, a.update_time FROM user_log a WHERE a.userid LIKE '%${userid}%' ORDER BY a.update_time DESC`
    // Execute SQL statement to retrieve user information based on user ID
    db.query(sql, (err, results) => {
        // If executing SQL statement fails
        if (err) return res.cc(err)
        // Respond with log data to the client via res.send()
        res.send({
            status: 0,
            message: 'Get log list ok',
            data: results,
            titles: ['id', 'userId', 'method', 'path', 'ip', 'update_time']
        })
    })
};
