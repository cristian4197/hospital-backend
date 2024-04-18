/**
 * Doctors
 * Path: '/api/doctors'
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT } = require('../middlewares/validator-jwt');
const { validatorInputs } = require('../middlewares/validator-inputs');
const { getDoctors, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctor.controller');


const router = Router();

router.get('/', validateJWT, getDoctors);

router.post('/', 
    [
        validateJWT,
        check('name','name of doctor is required').not().isEmpty(),
        // Validar que sea un id valido para MongoDb
        check('hospital','hospitalid is not valid').isMongoId(),
        validatorInputs
    ],
    createDoctor
);

router.put('/:id',
   [
   ] ,
   updateDoctor);

router.delete('/:id', deleteDoctor);


module.exports = router;