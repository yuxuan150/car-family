// Import express
const express = require('express')
// Create an instance of the server
const app = express()
const joi = require('@hapi/joi')
const bodyParser = require('body-parser');
const pb =require('./router_handler/publics')

// Import and configure the cors middleware
const cors = require('cors')
app.use(cors())

// Configure middleware to parse form data, note: this middleware can only parse form data in application/x-www-form-urlencoded format
app.use(express.urlencoded({ extended: false }))

// Host static resource files
app.use('/uploads', express.static('./uploads'))

// Must encapsulate the res.cc function before routing
app.use((req, res, next) => {
    // Default status is 1, indicating failure
    // The value of err could be an error object or an error description string
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})

// Must configure the Token parsing middleware before routing
const expressJWT = require('express-jwt')
// Contains the secret key
const config = require('./config')
// Register a global middleware, specifying the encryption decryption value, excluding interfaces that do not require authentication
app.use(expressJWT({ secret: config.jwtSecretKey }).unless((req) => {

    // Check if the request path starts with `/api` but is not `/api/cars`
    if (req.path.startsWith('/api') && !req.path.startsWith('/api/cars')) {
        return true; // Return true to skip JWT validation
    }
    // Perform JWT validation on all other requests
    return false;
}));  //.unless({ path: [/^\/api/] }))

app.use(pb.logRequest)


app.use(bodyParser.json());

//1. Import and use the user router module
const userRouter = require('./router/user')
app.use('/api', userRouter)

const carsRouter = require('./router/cars')
app.use('/api/cars', carsRouter)

const sysRouter = require('./router/systems')
app.use('/api/systems', sysRouter)

const dasRouter = require('./router/dashboard')
app.use('/api/dashboard', dasRouter)

//2. Import and use the user information router module
const userinfoRouter = require('./router/userinfo')
// Register the router
app.use('/my', userinfoRouter)
 

// Define error-level middleware
app.use((err, req, res, next) => {

    // Errors caused by validation failure
    if (err instanceof joi.ValidationError) return res.cc(err)
    // Errors after identity authentication failure
    if (err.name === 'UnauthorizedError') return res.cc('Identity authentication failed!')
    // Unknown errors
    res.cc(err)
})

// Start the server
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})
