/**
 * Path: /api/login
 */

const { Router } = require('express');
const { login, googleSignIng } = require('../controllers/auth.controller');
const { check } = require('express-validator');
const { validatorInputs } = require('../middlewares/validator-inputs');

const router = Router();

router.post('/',
    [
        check('email', 'email is required').not().isEmpty(),
        check('email', 'format of email is not valid').isEmail(),
        check('password', 'password is required').not().isEmpty(),
        validatorInputs
    ],
    login
);

router.post('/google',
    [
        check('token', 'Token of Google is required ').not().isEmpty(),
        validatorInputs
    ],
    googleSignIng
);


module.exports = router;