const { Schema, model } = require('mongoose');

// Definicion de los registros que estaran en una colección(tabla)
const DoctorSchema = Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    }
});

DoctorSchema.method('toJSON', function() {
    // this.toObject(), nos devuelve la instancia actual
    const {__v, ...object } = this.toObject();
    return object;
});
module.exports = model('Doctor', DoctorSchema);