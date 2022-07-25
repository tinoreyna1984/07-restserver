const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true,
            //useFindAndModify: false,
        });
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.log('Connection error: ', error.message);
    }
}

module.exports = {
    dbConnection,
};