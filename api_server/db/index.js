const mysql = require('mysql')

const db = mysql.createPool({
    host: '43.139.42.100',
    user: 'test',
    password: 'nfc@889.',
    database: 'cars',
    port: 3337
})

module.exports = db