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
            msg: 'Unexpected error... check logs'
        });
    }


}

const updateHospital = async (req, res = response) => {
    const { id } = req.params;
    const uid = req.uid;

    try {
        const hospitalDB = await Hospital.findById(id);

        if(!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital not found'
            });
        }

        const changesHospital = {
            ...req.body,
            user: uid
        };

        const hospitalUpdate = await Hospital.findByIdAndUpdate(id, changesHospital, { new: true });

        res.json({
            ok: true,
            msg: `Successful Hospital Update with ${ id }`,
            hospital: hospitalUpdate
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error... check logs'
        });
    }
    
}

const deleteHospital = async (req, res = response) => {
    const { id } = req.params;

    try {
        const hospitalDB = await Hospital.findById(id);
        if(!hospitalDB) {
            res.status(404).json({
                ok: false,
                msg: 'hospital not found'
            });
        }

        await Hospital.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Hospital removed correctly'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
           msg: 'Unexpected error... check logs'
        });
    }
    
}

module.exports = {
    getHospitals,
    createHospital,
    updateHospital,
    deleteHospital
}