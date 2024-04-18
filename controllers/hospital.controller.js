const { response } = require("express");
const Hospital = require('../models/hospital.model');

const getHospitals = async (req, res = response) => {
    const hospitals = await Hospital.find()
                             .populate('user', 'name img');
    res.json({
        ok: true,
        hospitals
    });
}

const createHospital = async (req, res = response) => {
    const { uid } = req;
    const hospital = new Hospital({
        user: uid,
        ...req.body
    });

    try {

       const hospitalDB = await hospital.save();
        
        res.json({
            ok: true,
            hospital: hospitalDB
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }


}

const updateHospital = (req, res = response) => {
    const { id } = req.params;
    res.json({
        ok: true,
        msg: `Actualización de Hospital exitosa con ${ id }`
    });
}

const deleteHospital = (req, res = response) => {
    const { id } = req.params;
    res.json({
        ok: true,
        msg: `Eliminación de hospital exitosa con ${ id }`
    });
}

module.exports = {
    getHospitals,
    createHospital,
    updateHospital,
    deleteHospital
}