var mysql = require("mysql");
const util = require('util');

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cointab",
    dateStrings:true
});

conn.connect((err) => {
    if (!err) {
        console.log("database connected");
    }
    else {
        console.log(err);
    }
});

var execute = util.promisify(conn.query).bind(conn);
module.exports = execute;
