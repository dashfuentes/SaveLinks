const mysql = require('mysql');
const {database} =  require('./keys.js');
const {promisify} = require('util');

//crear conexion a la bd
const pool = mysql.createPool(database);
pool.getConnection((err,connection) =>{
    if(err){
        if(err === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
        if(connection) connection.release();
        console.log('BD is connected!');
        return;
});

//cada vez que hagamos una consulta se utilizaran promesas para resolverlas
pool.query = promisify(pool.query);

module.exports =  pool;

