
const db = require('../db/index')
const pb = require('./publics')


exports.getCarModels = (req, res) => {
    // retrive request page and its limit
    // if request from frontend and not support, initialize to one page and 10 data per page
    const page = parseInt(req.query.pagenum) || 1;
    const limit = parseInt(req.query.pagesize) || 10;
    const locationId = req.user.location_id;

    // calculate the data start index, first page is 0
    const offset = (page - 1) * limit;

    const companyName = req.query.company_name || '';
    const modelName = req.query.model_name || '';
    const noRecall = req.query.no_recall || 0;
    const distince = req.query.distince || 0;
    var sortBy = req.query.order_by || '';
    if (sortBy && sortBy.length > 0)
        sortBy = " order by " + sortBy;
    var distanceSql = ''
    if (distince == 0 || distince == 'all')
        distanceSql = ''
    else
        distanceSql = ` where distance <= ${distince}`

    const searchLocationId = req.query.location_id || '';
    var locationSql = ''
    if (searchLocationId)
        locationSql = ' and a.location_id=' + searchLocationId

    var recallSql = ''
    if (noRecall == 0)
        recallSql = ' and r.recallID is null '
    else if (noRecall == 1) //recall
        recallSql = ' and r.recallID is not null '
    // define search page data SQL 
    var sql = `SELECT a.*,DATE_FORMAT(add_time,'%Y-%m-%d') create_date,b.company_name,L.city_name
                ,FLOOR(ST_Distance_Sphere(
                (SELECT point(longitude, latitude) FROM location WHERE locationID = a.location_id),
                (SELECT point(longitude, latitude) FROM location WHERE locationID = ${locationId})
                ) / 1000) AS distance
                ,r.recallID  as recall
   FROM carmodels a
   inner join company b on a.company_id=b.company_id 
   left join recall r on a.CarID=r.CarID 
   left join location L on a.location_id=L.locationID
     where a.status='selling' and  b.company_name like '%${companyName}%' and a.model like '%${modelName}%'  ${recallSql} `
    sql = `select * from (${sql}) as AA  ${distanceSql} `
    sql += ` ${sortBy}`
    var sqlTotal = `select count(*) as total from (${sql}) as BB`
    sql += `   LIMIT ${limit} OFFSET ${offset}`;

    // const sqlTotal = `SELECT COUNT(*) AS total FROM carmodels a 
    // inner join company b on a.company_id=b.company_id
    // left join recall r on a.CarID=r.CarID 
    // where b.company_name like '%${companyName}%' and a.model like '%${modelName}%'  ${recallSql}  ${locationSql}  ${distanceSql}`;





    // run seach for total count of search SQL
    db.query(sqlTotal, (err, results) => {
        if (err) return res.cc(err);
        // total rows
        const total = results[0].total;
        // total page
        const totalPages = Math.ceil(total / limit);

         // run seach for total count of search SQL
        db.query(sql, (err, results) => {
            if (err) return res.cc(err);
            res.send({
                status: 0,
                message: 'Get carmodels success!',
                data: results,
                titles: ["CarID", "Model", "year", "miles", "color", "price", "company_name", "city_name", "distance", "recall", "create_date"], // "location_id"],
                page: page, // current page
                totalPages: totalPages, // total page
                limit: limit, // data per page limit
                total: total // total data

            });
        });
    });
};
exports.addCarModel = (req, res) => {
    var userId = req.user.userid
    const newRecall = req.body;
    var columns = ["model", "miles", "color", "price", "company_id", "location_id", "year"];
    var items = {}
    columns.forEach(key => {
        items[key] = newRecall[key]
    })
    items['userid'] = userId
    items['status'] = 'selling'
    db.query('INSERT INTO carmodels SET ?', items, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'Add car for sale success!',
            data: results
        });
    });
};


exports.updateCarModel = (req, res) => {
    var userId = req.user.userid
    const id = req.query.id

    db.query('CALL update_car_model(?, ?)', [userId, id], (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'buy car  success!',
            data: results
        });


    });
};


// exports.updateCarModelNoProc = (req, res) => {
//     var userId = req.user.userid
//     const id = req.query.id
//     columns = {}
//     columns['status'] = 'saled'
//     // db.query('INSERT INTO carmodel SET ?', items, (err, results) => {
//     db.query('UPDATE carmodels SET ? WHERE carid = ?', [columns, id], (err, result) => {
//         if (err) return res.cc(err);

//         var items = { carid: id, buyer_id: userId }
//         db.query('insert into online_trade set  ?', items, (err, result) => {
//             if (err) return res.cc(err);
//             res.send({
//                 status: 0,
//                 message: 'buy car success!',
//                 data: result
//             });
//         })






//     });
// };


exports.getCarRecalls = (req, res) => {
    // request for page num and limit per page
    // if request comes from frontend, if no, set to first page and ten data per page
    const page = parseInt(req.query.pagenum) || 1;
    const limit = parseInt(req.query.pagesize) || 10;
    const id = req.query.id || '';
    // calculate data from 0
    const offset = (page - 1) * limit;

    const modelName = req.query.model_name || '';
    const reason = req.query.reason || '';
    const companyName=req.query.company_name || ''
    // define search separate page sql
    const sql = `SELECT b.model,c.company_name,a.* FROM recall a
     inner join carmodels b on a.CarID=b.CarID  
    inner join company c on b.company_id=c.company_id
    where c.company_name like '%${companyName}%' and b.model like '%${modelName}%' and a.reason like '%${reason}%' ${id ? ' and a.recallID=' + id : ''} 
      ORDER BY a.CarID ASC LIMIT ${limit} OFFSET ${offset}`;

    // define search for total record sql
    const sqlTotal = `SELECT COUNT(*) AS total from recall a
     inner join carmodels b  on a.CarID=b.CarID 
     inner join company c on b.company_id=c.company_id
     where  c.company_name like '%${companyName}%' and b.model like '%${modelName}%' and a.reason like '%${reason}%' ${id ? ' and a.recallID=' + id : ''} `;

    // run total search sql 
    db.query(sqlTotal, (err, results) => {
        if (err) return res.cc(err);
        // total record
        const total = results[0].total;
        // total page
        const totalPages = Math.ceil(total / limit);

        // run separate sheet searching sql
        db.query(sql, (err, results) => {
            if (err) return res.cc(err);
            res.send({
                status: 0,
                message: 'Get carmodels success!',
                data: results,
                titles: ["model", "company_name","recallID", "reason", "report_received_date", "consequence_summary", "component"],
                page: page, // current page num
                totalPages: totalPages, // total page
                limit: limit, // data per page
                total: total // total data

            });
        });
    });
};











// Retrieve a single recall record by ID
exports.getRecallById = (req, res) => {
    const recallId = req.query.id;
    var sql = `SELECT b.carid,b.color,b.model,c.company_name,a.* FROM recall a
	left join carmodels b on a.carid=b.carid 
	left join company c on b.company_id=c.company_id
       WHERE  recallID= ? `
    db.query(sql, recallId, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Recall record not found' });
        }
        res.send({
            status: 0,
            message: 'get recall  ok',
            data: results[0]

        })
    });
};



// Create a recall record
exports.addRecall = (req, res) => {
    const newRecall = req.body;
    var columns = ["carid", "reason", "report_received_date", "consequence_summary", "component"];
    var items = {}
    columns.forEach(key => {
        items[key] = newRecall[key]
    })
    db.query('INSERT INTO recall SET ?', items, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'Add recall success!',
            data: results
        });
    });
};
// Update a recall record by ID
exports.updateRecallNoProc = (req, res) => {

    const newRecall = req.body;
    var columns = ["carid", "reason", "report_received_date", "consequence_summary", "component"];
    var items = {}
    columns.forEach(key => {
        items[key] = newRecall[key]
    })
    const recallId = newRecall.recall_id;
    db.query('UPDATE recall SET ? WHERE recallID = ?', [items, recallId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Recall record not found' });
        }

        res.send({
            status: 0,
            message: 'Recall record updated successfully',
            data: result
        })
    });
};


exports.updateRecall = (req, res) => {
    const recallId = req.body.recall_id;
    const carId = req.body.carid;
    const reason = req.body.reason;
    const reportReceivedDate = req.body.report_received_date;
    const consequenceSummary = req.body.consequence_summary;
    const component = req.body.component;

    // Call the stored procedure
    db.query('CALL updateRecall(?, ?, ?, ?, ?, ?)', [recallId, carId, reason, reportReceivedDate, consequenceSummary, component], (err, results, fields) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Check if the stored procedure returned any results
        if (results && results.length > 0) {
            const message = results[0][0].message;
            return res.send({
                status: 0,
                message: message,
                data: results
            });
        } else {
            return res.status(404).json({ message: 'Recall record not found' });
        }
    });
};

// Delete a recall record by ID
exports.deleteRecall = (req, res) => {
    const recallId = req.query.id;
    db.query('SELECT * FROM carmodels WHERE CarID IN (SELECT CarID FROM recall WHERE recallID = ?)', recallId, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        // if exist related data, if not delete it
        if (result.length > 0) {
            return res.status(400).json({ message: 'Cannot delete recall record because associated carmodels data exists' });
        }
        db.query('DELETE FROM recall WHERE recallID = ?', recallId, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Recall record not found' });
            }
            res.send({
                status: 0,
                message: 'Recall record delete successfully',
                data: result
            })
        });
    });
};











































exports.getLocation = (req, res) => {
    pb.getLocation(req, res)
};








/**
 * onlineTrade******************************************************************
 */



// get trading record
exports.getTrade = (req, res) => {
    const page = parseInt(req.query.pagenum) || 1;
    const limit = parseInt(req.query.pagesize) || 10;
    const offset = (page - 1) * limit;

    // use trad_id to search for single record or search on separate page
    const model_name = req.query.model_name || '';
    var sqlCondition = " "//where a.status='selling'";// trade_id ? ` WHERE a.trade_id = ${trade_id}` : '';
    if (!req.user || !req.user.role  || req.user.role != 'ADMIN')
        sqlCondition = ` where a.buyer_id='${req.user.userid}'`
    if (model_name.length > 0)
        sqlCondition += ` and b.model like '%${model_name}%'`
    const sql = `SELECT b.model,c.company_name,a.buyer_id,a.trade_id,a.add_time,b.color,b.price FROM online_trade a
                    inner join  carmodels b on a.carid=b.carid
                    inner join company c on c.company_id=b.company_id 
                 ${sqlCondition}
                 ORDER BY a.update_time DESC LIMIT ${limit} OFFSET ${offset}`;
    const sqlTotal = `SELECT COUNT(*) AS total FROM online_trade a 
    inner join  carmodels b on a.carid=b.carid
    inner join company c on c.company_id=b.company_id 
    ${sqlCondition}`;

    db.query(sqlTotal, (err, results) => {
        if (err) return res.cc(err);
        const total = results[0].total;
        const totalPages = Math.ceil(total / limit);

        db.query(sql, (err, results) => {
            if (err) return res.cc(err);
            res.send({
                status: 0,
                message: 'Get list success!',
                titles: ['trade_id', 'model', 'color', 'price', 'buyer_id', 'add_time'],
                data: results,
                page: page,
                totalPages: totalPages,
                limit: limit,
                total: total
            });
        });
    });
};

exports.addTrade = (req, res) => {
    const newTrade = req.body;
    const userId = req.user.userid;
    const flag = 1//newTrade.flag;
    const price = newTrade.price;
    const carid = newTrade.carid;

    // use the create procedure
    const sql = 'CALL addOrUpdateTradeWithTransaction(?, ?, ?, ?, 0)';
    db.query(sql, [flag, userId, price, carid], (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'Add new car for sale success!',
            data: results
        });
    });
};

// add the trade record
exports.addTradeWithNoProc = (req, res) => {
    const newTrade = req.body;
    var flag = newTrade.flag
    var userId = req.user.userid
    var columns = ["price", "carid"]
    const sql = `INSERT INTO online_trade SET ?`;

    var items = {}
    columns.forEach(x => {
        items[x] = newTrade[x]
    })
    items['status'] = 'selling'
    items["seller_id"] = userId

    db.query(sql, items, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'Add new car for sale success!',
            data: results
        });
    });
};

// modify the trade record
exports.updateTradeNoTrade = (req, res) => {
    const id = req.query.id;
    // const updatedTrade = req.body;
    const userId = req.user.userid
    var updatedTrade = { "seller_id": userId, "status": 'saled' }
    const sql = `UPDATE online_trade SET ? WHERE trade_id = ?`;
    db.query(sql, [updatedTrade, id], (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'buyer car   success!',
            data: results
        });
    });


};


exports.updateTrade = (req, res) => {
    const id = req.query.id;
    const userId = req.user.userid;
    const flag = 0; // flag 0 means update trade info
    const updatedTrade = { "seller_id": userId }; 

    // call create procedure
    const sql = 'CALL addOrUpdateTradeWithTransaction(?, ?, NULL, NULL, ?)';
    db.query(sql, [flag, userId, id], (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'buy car success!',
            data: results
        });
    });
};

// delete trade record
exports.deleteTrade = (req, res) => {
    const id = req.query.id;
    const sql = `DELETE FROM online_trade WHERE trade_id = ?`;
    db.query(sql, id, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: 'Delete trade success!',
            data: results
        });
    });
};


