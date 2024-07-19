const { response } = require("express");
const Hospital = require('../models/hospital.model');

const getHospitals = async (req, res = response) => {
  // Obtener los queryParams
  // Hacemos una paginación para mostrar desde el registro "from"
  const from = Number(req.query.from) || 0;
  const limit = Number(req.query.limit) || 5;
  try {

    const [hospitals, total] = await Promise.all([
      Hospital.find()
        // Para limitar el numero de registros a mostrar
        .skip(from)
        .limit(limit)
        .populate('user', 'name img'),

      Hospital.countDocuments()
    ]);


    return res.json({
      ok: true,
      hospitals,
      total
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: `Error inesperado`
    });
  }
}



const getHospitalById = async (req, res) => {
  const id = req.query.id;

  try {
    const hospital = await Hospital.findById(id)
                            // para obtener el nombre e imagen del usuario
                            .populate('user', 'name img');
    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe hospital con ese id'
      });
    }
    return res.json({
      ok: true,
      hospital
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: `Error inesperado`
    });
  }


};

const createHospital = async (req, res = response) => {
  const { uid } = req;
  const hospital = new Hospital({
    user: uid,
    ...req.body
  });

  try {

    const hospitalDB = await hospital.save();

    return res.json({
      ok: true,
      hospital: hospitalDB
    });
  } catch (error) {
    return res.status(500).json({
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

    if (!hospitalDB) {
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
      msg: `Successful Hospital Update with ${id}`,
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
    if (!hospitalDB) {
      res.status(404).json({
        ok: false,
        msg: 'hospital not found'
      });
    }

    await Hospital.findByIdAndDelete(id);

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
  deleteHospital,
  getHospitalById
}