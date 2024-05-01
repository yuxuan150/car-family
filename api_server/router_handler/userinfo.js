// Import the database operation module
const db = require('../db/index')
// Import the module for handling passwords
const bcrypt = require('bcryptjs')

// 1. Handler function for getting basic user information
exports.getUserInfo = (req, res) => {
    // Define the SQL statement to query user information, excluding password for security reasons; '?' is a placeholder
    const sql = `select userid, username, email, user_pic, role from ev_users where userid=?`
    // Call db.query() to execute the SQL statement; the 'user' attribute on the req object is mounted by the express-jwt middleware upon successful Token parsing and contains the user ID
    db.query(sql, req.user.userid, (err, results) => {
        // SQL statement execution failed
        if (err) return res.cc(err)
        // SQL statement executed successfully, but the query result may be empty
        if (results.length !== 1) return res.cc('Failed to retrieve user information!')

        // Respond to the client, user information retrieval successful
        res.send({
            status: 0,
            message: 'User information retrieved successfully!',
            data: results[0],
        })
    })
}

// 2. Handler function for updating basic user information
exports.updateUserInfo = (req, res) => {
    // Define the SQL statement to update information of the specified ID
    const sql = `update ev_users set ? where userid=?`
    // Call db.query() to execute the SQL statement and pass parameters, results is an object containing the affectedRows attribute
    db.query(sql, [req.body, req.body.userid], (err, results) => {
        // SQL statement execution failed
        if (err) return res.cc(err)
        // SQL statement executed successfully, but the affected rows are not equal to 1
        if (results.affectedRows !== 1) return res.cc('Failed to update basic user information!')
        // Success, status is 0
        res.cc('User information updated successfully!', 0)
    })
}

// 3. Handler function for updating user password
exports.updatePassword = (req, res) => {
    // Query user information by id
    const sql = `select * from ev_users where userid=?`
    // Execute the SQL statement to query user information by id
    db.query(sql, req.user.userid, (err, results) => {
        // SQL statement execution failed
        if (err) return res.cc(err)
        // Check if the result exists
        if (results.length !== 1) return res.cc('User does not exist!')

        // Check if the old password is correct by comparing the submitted old password with the password in the database
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('Old password incorrect!')

        // Define the SQL statement to update the password, updating the password by ID
        const sql = `update ev_users set password=? where userid=?`
        // Encrypt the new password
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // Call db.query() to execute the SQL statement, passing values via an array
        db.query(sql, [newPwd, req.user.userid], (err, results) => {
            // SQL statement execution failed
            if (err) return res.cc(err)
            // Check the affected rows
            if (results.affectedRows !== 1) return res.cc('Password update failed!')
            // Success
            res.cc('Password updated successfully', 0)
        })
    })
}

// 4. Handler function for updating user avatar
exports.updateAvatar = (req, res) => {
    // 1. Define the SQL statement to update the avatar
    const sql = `update ev_users set user_pic=? where userid=?`
    // 2. Call db.query() to execute the SQL statement
    db.query(sql, [req.body.avatar, req.user.userid], (err, results) => {
        // SQL statement execution failed
        if (err) return res.cc(err)
        // Check if the affected rows are equal to 1
        if (results.affectedRows !== 1) return res.cc('Avatar change failed!')
        // Success
        res.cc('Avatar updated successfully!', 0)
    })
}
