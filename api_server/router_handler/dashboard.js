
const db = require('../db/index')

// get the qty with  status with  "saled" 
exports.getDashBoard = ((req, res) => {
    db.query('CALL GetStatistics()', (err, results) => {
        if (err) return res.status(500).send(err);
        const brief = results[0][0]
        var myResult = { brief: brief }//, logs: results }
        // var sql = `SELECT b.username, COUNT(*) AS times FROM
        //             user_log a  INNER JOIN ev_users b ON a.userid = b.userid 
        //             GROUP BY a.userId  ORDER BY times DESC`;

        db.query('CALL GetUserLogCounts()', (err, results) => {
            if (err) return res.status(500).send(err);
            myResult['logs'] = results[0]
            sql = `select count(model) iCount,model from carmodels where status='selling' group by model  order by iCount desc limit 5`
            db.query(sql, (err, results) => {
                if (err) return res.status(500).send(err);
                myResult['models'] = results

                // sql = `SELECT
                //             COUNT(a.carid) iCount,
                //             DATE_FORMAT(a.add_time, '%Y-%M-%d') AS sale_date,
                //             SUM(b.price) iAmount
                //         FROM
                //             online_trade a
                //             INNER JOIN carmodels b ON a.carid = b.CarID 
                //         WHERE
                //             b.status = 'saled' 
                //             AND a.add_time >= DATE_SUB(NOW(), INTERVAL 1 MONTH) 
                //         GROUP BY sale_date`

                db.query('CALL GetTradeSummary(?)',['saled'], (err, results) => {
                    if (err) return res.status(500).send(err);
                    myResult['sales'] = results[0]
                   
                    res.send({
                        status: 0,
                        message: 'call   Statistics ok to get data for dashboard!',
                        data: myResult,

                    });
                });
            });


        });
    });
});




// exports.getDashBoard = async (req, res) => {
//     try {
//         db.beginTransaction(err=>{
//             console.log('jjj')
//         });
//         // call GetStatistics
//         const statistics = await new Promise((resolve, reject) => {
//             db.beginTransaction(err => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 db.query('CALL GetStatistics()', (error, results, fields) => {
//                     if (error) {
//                         return db.rollback(() => {
//                             reject(error);
//                         });
//                     }
//                     db.commit((err) => {
//                         if (err) {
//                             return db.rollback(() => {
//                                 reject(err);
//                             });
//                         }
//                         resolve(
//                             results[0][0]

//                         );
//                     });
//                 });
//             });
//         });


//         const userLogs = await new Promise((resolve, reject) => {
//             const sql = `SELECT userId, COUNT(*) AS times
//                          FROM user_log
//                          GROUP BY userId
//                          ORDER BY times DESC`;

//             db.beginTransaction(err => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 db.query(sql, (error, results) => {
//                     if (error) {
//                         return db.rollback(() => {
//                             reject(error);
//                         });
//                     }
//                     db.commit((err) => {
//                         if (err) {
//                             return db.rollback(() => {
//                                 reject(err);
//                             });
//                         }
//                         resolve(results);
//                     });
//                 });
//             });
//         });

//         res.send({
//             status: 0,
//             message: 'Statistics and user logs retrieved successfully',
//             brief: statistics,
//             logs: userLogs
//         });

//     } catch (error) {
//         res.status(500).send({ status: 'error', message: error.message });
//     }
// };