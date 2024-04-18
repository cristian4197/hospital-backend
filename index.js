require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');


// Crear el servidor de express
const app = express();

// Configurar cors
app.use(cors());

// Carpeta publica
app.use(express.static('public'));

//Lectura y parseo de Body
// Se coloca antes de las rutas
app.use(express.json());

// Base de datos
dbConnection();

//Rutas

// Esto es un middleware, que se encarga de enviar las peticiones de una 
// determinada ruta a su archivo router para ser respondida
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/hospitals', require('./routes/hospital.routes'));
app.use('/api/doctors', require('./routes/doctors.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/searches', require('./routes/searches.routes'));
app.use('/api/upload', require('./routes/upload.routes'));



app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});