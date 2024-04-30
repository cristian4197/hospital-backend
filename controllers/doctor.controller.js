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
            msg: 'Unexpected error... check logs'
        });
    }
    
}

const updateDoctor = async (req, res = response) => {
    const { id } = req.params;
    const uid = req.uid;

    try {
        const doctorDB = await Doctor.findById(id);

        if(!doctorDB) {
            res.status(404).json({
                ok: false,
                msg: 'Doctor is not found'
            });
        }
    
        const changesDoctor = {
            ...req.body,
                user: uid
        };

        const doctorUpdate = await Doctor.findByIdAndUpdate(id, changesDoctor, { new: true });

        res.json({
            ok: true,
            msg: `Successful doctor update with ${ id }`,
            doctor: doctorUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error... check logs'
        });
    }

}

const deleteDoctor = async (req, res = response) => {
    const { id } = req.params;

    try {
        const doctorDB = await Doctor.findById(id);

        if(!doctorDB) {
            res.status(404).json({
                ok: false,
                msg: 'Doctor is not found'
            });
        }

        await Doctor.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: `Doctor removed correctly`
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
           msg: 'Unexpected error... check logs'
        });
    }
    
}

module.exports = {
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
}