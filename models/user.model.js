const { Schema, model } = require('mongoose');

// Definicion de los registros que estaran en una colección(tabla)
const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    }
});

UserSchema.method('toJSON', function() {
    // this.toObject(), nos devuelve la instancia actual
    const {__v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});
module.exports = model('User', UserSchema);