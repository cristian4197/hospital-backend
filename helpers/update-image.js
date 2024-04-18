const fs = require('fs');

const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Hospital = require('../models/hospital.model');

const deleteImage = (path) => {
  
    if (fs.existsSync(path)) {
        // Si existe borramos la imagen anterior
        fs.unlinkSync(path);
    }
};


const updateImage = async (type, id, nameFile) => {
    switch (type) {
        case 'doctors':
            const doctor = await Doctor.findById(id);
            if (!doctor) {
                // No es un medico por id
                return false;
            }

            // Evaluamos si el medico ya tiene una imagen asignada
            const oldPathDoctor = `./uploads/doctors/${doctor.img}`;
            // Si existe borramos esa imagen
            deleteImage(oldPathDoctor);

            doctor.img = nameFile;
            await doctor.save();

            return true;

            break;
        case 'hospitals':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                // No es un medico por id
                return false;
            }

            // Evaluamos si el medico ya tiene una imagen asignada
            const oldPathHospital = `./uploads/hospitals/${hospital.img}`;
            // Si existe borramos esa imagen
            deleteImage(oldPathHospital);

            hospital.img = nameFile;
            await hospital.save();

            return true;

            break;
        case 'users':
            const user = await User.findById(id);
            if (!user) {
                // No es un medico por id
                return false;
            }

            // Evaluamos si el medico ya tiene una imagen asignada
            const oldPathUser = `./uploads/users/${user.img}`;
            // Si existe borramos esa imagen
            deleteImage(oldPathUser);

            user.img = nameFile;
            await user.save();

            return true;

            break;

        default:
            break;
    }
};

module.exports = {
    updateImage
}