const { Schema, model } = require('mongoose');

// Definicion de los registros que estaran en una colección(tabla)
const HospitalSchema = Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

HospitalSchema.method('toJSON', function () {
    // this.toObject(), nos devuelve la instancia actual
    const { __v, _id, user, ...object } = this.toObject();
    object.uid = _id;
    object.user = {
        name: user.name,
        img: user.img,
        uid: user._id
    };
    return object;
});
module.exports = model('Hospital', HospitalSchema);