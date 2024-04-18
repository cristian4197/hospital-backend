const { response } = require("express");
const Doctor = require('../models/doctor.model');

const getDoctors = async (req, res = response) => {
    const doctors = await Doctor.find()
                          .populate('user', 'name img')
                          .populate('hospital', 'name img');
    res.json({
        ok: true,
        doctors
    });
}

const createDoctor = async (req, res = response) => {
    const { uid } = req;

    const doctor = new Doctor({
        user: uid,
        ...req.body
    });

    try {
        const doctorDB = await doctor.save();

        res.json({
            ok: true,
            doctor: doctorDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
    
}

const updateDoctor = (req, res = response) => {
    const { id } = req.params;
    res.json({
        ok: true,
        msg: `Actualización de médico exitosa con ${ id }`
    });
}

const deleteDoctor = (req, res = response) => {
    const { id } = req.params;
    res.json({
        ok: true,
        msg: `Eliminación de médico exitosa con ${ id }`
    });
}

module.exports = {
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
}