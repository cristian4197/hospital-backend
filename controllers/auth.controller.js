const { response } = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        //Verificar email
        const userDB = await User.findOne({ email });

        if(!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no valido'
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync( password, userDB.password);

        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no valido'
            });
        }
        //Generar el token
        const token = await generateJWT(userDB.id);

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error inesperado'
        });
    }
};

module.exports = {
    login
}