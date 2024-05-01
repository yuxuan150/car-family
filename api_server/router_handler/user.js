// Import database operation module
const db = require('../db/index')
// Import bcryptjs package for password validation
const bcrypt = require('bcryptjs')
// Import package for generating Token
const jwt = require('jsonwebtoken')
// Import global configuration file including the secret key
const config = require('../config')
const pub = require('./publics')

// Handler function for registering new users
exports.regUser = (req, res) => {
    // Retrieve user information submitted to the server by the client
    const userinfo = req.body
    // Validate the data in the form for legality
    // if (!userinfo.userid || !userinfo.password) {
    //   return res.send({ status: 1, message: 'Username or password invalid!' })
    // }

    // Define SQL statement to check if the username is already in use
    const sqlStr = 'select * from ev_users where userid=?'
    db.query(sqlStr, userinfo.userid, (err, results) => {
        // SQL statement execution failed
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        // Check if the username is already in use
        if (results.length > 0) {
            // return res.send({ status: 1, message: 'Username in use, please choose another username!' })
            return res.cc('user name exists!')
        }
        // Use bcrypt.hashSync() to encrypt the password
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // Define SQL statement to insert new user
        const sql = 'insert into ev_users set ?'
        // Execute SQL statement
        db.query(sql, { userid: userinfo.userid, username: userinfo.username, password: userinfo.password, location_id: userinfo.location, role:'USER' }, (err, results) => {
            // Check if the SQL statement executed successfully
            // if (err) return res.send({ status: 1, message: err.message })
            if (err) return res.cc(err)
            // Check if the number of affected rows is 1
            // if (results.affectedRows !== 1) return res.send({ status: 1, message: 'Registering user failed, please try again later!' })
            if (results.affectedRows !== 1) return res.cc('register failed!')
            // User registered successfully
            // res.send({ status: 0, message: 'Registration successful!' })
            res.cc('register success!', 0)
        })
    })
}

// Login handler function
exports.login = (req, res) => {
    // Receive form data
    const userinfo = req.body
    // Define SQL statement
    const sql = `select * from ev_users where userid=?`
    // Execute SQL statement to query user information by username
    db.query(sql, userinfo.userid, (err, results) => {

        // SQL statement execution failed
        if (err) return res.cc(err)
        // SQL statement executed successfully, but the number of retrieved records is not 1
        if (results.length !== 1) return res.cc('Login failed!')

        // TODO: Verify if the password is correct
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.cc('Login failed!')

        // TODO: Generate a Token string on the server side,
        // Clear user password and profile picture values, replace with spaces
        const user = { ...results[0], password: '', user_pic: '' }
        // Encrypt user information to generate a Token string, using the encryption secret from config.jwtSecretKey, and expiration time expiresIn
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        // req.session.user = userinfo.userid
        // Call res.send() to respond with the Token to the client
        res.send({
            status: 0,
            message: 'Login successful!',
            // Add prefix and space
            token: 'Bearer ' + tokenStr,
        })
    })
}

exports.getLocation = (req, res) => {
    pub.getLocationSimple(req, res)
}
