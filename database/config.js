const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN);

        console.log('DB Online');
    } catch (error) {
        throw new Error('Error a la hora de iniciar la BD ver logs'+ error);
    }
    
}

module.exports = {
    dbConnection
}