/**
 * Path: /api/users
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { validatorInputs } = require('../middlewares/validator-inputs');
const { getUsers, createUser, updateUser, deleteUser, getUserById } = require('../controllers/user.controller');
const { validateJWT } = require('../middlewares/validator-jwt');

const router = Router();

router.get('/', validateJWT ,getUsers);

router.get('/detail', validateJWT ,getUserById);

router.post('/', 
    [
        check('name','name is required').not().isEmpty(),
        check('password', 'password is required').not().isEmpty(),
        check('email', 'email is required').not().isEmpty(),
        check('email', 'format of email is not valid').isEmail(),
        // Aqui ponemos nuestro middleware personalizado
        // Siempre van al final
        validatorInputs
    ],
    createUser
);

router.put('/:id',
   [
    validateJWT,
    check('name','name is required').not().isEmpty(),
    check('role','role is required').not().isEmpty(),
    check('email', 'email is required').not().isEmpty(),
    check('email', 'format of email is not valid').isEmail(),
    validatorInputs
   ] ,
    updateUser);

router.delete('/:id', validateJWT ,deleteUser);


module.exports = router;