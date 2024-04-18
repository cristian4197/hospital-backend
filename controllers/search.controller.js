const { response } = require('express');
const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Hospital = require('../models/hospital.model');

const searchInAllByFilter = async (req, res =  response) => {
    const { filter } = req.params;

    const regex = new RegExp(filter, 'i');

    const [ users, doctors, hospitals ] = await Promise.all([
        User.find({ name: regex }),
        Doctor.find({ name: regex }),
        Hospital.find({ name: regex })
    ]);


    res.json({
        ok: true,
        users,
        doctors,
        hospitals
    });
};

const searchInSchemaByFilter = async (req, res =  response) => {
    
    const { table } = req.params;

    const { filter } = req.params;

    const regex = new RegExp(filter, 'i');

    let data = [];

    switch (table) {
        case 'users':
            data = await User.find({ name: regex });
            break;
        case 'hospitals':
            data = await Hospital.find({ name: regex })
                                 .populate('user', 'name img');
            break;
        case 'doctors':
            data = await Doctor.find({ name: regex })
                               .populate('user', 'name img')
                               .populate('hospital', 'name img');
            break;
    
        default:
           return res.status(400).json({
            ok: false,
            msg: 'Tabla de busqueda no válida'
           });
    }

    res.json({
        ok: true,
        results: data
    });
}

module.exports = {
    searchInAllByFilter,
    searchInSchemaByFilter
};