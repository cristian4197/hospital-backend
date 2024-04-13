const { response } = require('express');
const { validationResult } = require('express-validator');

const validatorInputs = (req, res = response, next ) => {
    // Obtenemos los errores obtenidos en el middleware
    // En caso de capturar error en el request respondemos un 400
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    // Si no hay errores ejecutamos la función
    next();
};

module.exports = {
    validatorInputs
}