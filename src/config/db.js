const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'caja_de_sorpresas'
});

connection.connect((err) => {
    if(err) {
        console.log('El error a conexion a BD es: ' + err);
        return;
    }
    console.log('Conectado exitosamente a la BD');
});

module.exports = connection;