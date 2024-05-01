const db = require('../db/index')

exports.getLocation = (req, res) => {
    // Retrieve the page number 'page' and the number of items per page 'limit' from the request
    // Assume they are passed in the query from the frontend; default to the first page and 10 items per page if not provided
    const page = parseInt(req.query.pagenum) || 1;
    const limit = parseInt(req.query.pagesize) || 10;
    const id = req.query.id || '';
    // Calculate the starting index of the data; the start index for the first page is 0
    const offset = (page - 1) * limit;

    const cityName = req.query.city_name || '';
    // Define SQL query for pagination
    const sql = `select a.* from location a 
       where a.city_name like '%${cityName}%'
      ORDER BY a.city_name ASC LIMIT ${limit} OFFSET ${offset}`;

    // Define SQL statement to query the total number of records
    const sqlTotal = `SELECT COUNT(*) AS total from location a 
    where a.city_name like '%${cityName}%'`

    // Execute SQL query to get total records
    db.query(sqlTotal, (err, results) => {
        if (err) return res.cc(err);
        // Total number of records
        const total = results[0].total;
        // Total number of pages
        const totalPages = Math.ceil(total / limit);

        // Execute SQL query for pagination data
        db.query(sql, (err, results) => {
            if (err) return res.cc(err);
            res.send({
                status: 0,
                message: 'Get location success!',
                data: results,
                titles: ["locationID", "city_name", "latitude", "longitude"],//, "consequence_summary", "component"],
                page: page, // Current page number
                totalPages: totalPages, // Total number of pages
                limit: limit, // Number of items per page
                total: total // Total number of items

            });
        });
    });
};

exports.getLocationSimple = (req, res) => {
    // Receive form data
    const cityName = req.query.city_name || ''
    // Define SQL statement
    const sql = `select locationId as id,city_name as title from location where city_name like '%${cityName}%'`
    // Execute SQL statement to retrieve user information based on city name
    db.query(sql, (err, results) => {
        // If executing SQL statement fails
        if (err) return res.cc(err)
        // Respond with Token to the client via res.send()
        res.send({
            status: 0,
            message: 'get location list ok',
            data: results

        })
    })
}

exports.getCompanySimple = (req, res) => {
    // Receive form data
    const companyName = req.query.company_name || ''
    // Define SQL statement
    const sql = `select company_id as id,company_name as title from company where company_name like '%${companyName}%'`
    // Execute SQL statement to retrieve user information based on company name
    db.query(sql, (err, results) => {
        // If executing SQL statement fails
        if (err) return res.cc(err)
        // Respond with Token to the client via res.send()
        res.send({
            status: 0,
            message: 'get company list ok',
            data: results

        })
    })
}

exports.logRequest = async (req, res, next) => {
    try {
        const { path, user, method, ip } = req;
        if(user && req.user.userid)
        await db.query('INSERT INTO user_log (path, userId, method, ip) VALUES (?, ?, ?, ?)', [path, req.user.userid, method, ip]);
        next();
    } catch (error) {
        // Handle error
        console.error('Error logging request:', error);
        //res.status(500).send('Internal Server Error');
        next();
    }
};
