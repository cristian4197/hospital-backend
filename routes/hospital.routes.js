/** 
 * Hospitales
 * Path: '/api/hospitals'
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { getHospitals, createHospital, updateHospital, deleteHospital } = require('../controllers/hospital.controller');
const { validateJWT } = require('../middlewares/validator-jwt');
const { validatorInputs } = require('../middlewares/validator-inputs');

const router = Router();

router.get('/', validateJWT, getHospitals);

router.post('/', 
    [
        validateJWT,
        check('name','name of hospital is required').not().isEmpty(),
        validatorInputs
    ],
    createHospital
);

router.put('/:id',
   [    
        validateJWT,
        check('name','name of hospital is required').not().isEmpty(),
   ] ,
    updateHospital);

router.delete('/:id', validateJWT ,deleteHospital);


module.exports = router;