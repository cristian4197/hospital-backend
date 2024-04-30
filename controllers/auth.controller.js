const { response } = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error inesperado'
        });
    }
};

const googleSignIng = async (req, res = response) => {
    try {
        const { email, name, picture }  = await googleVerify(req.body.token);

        const userDB = await User.findOne({email});
        let user;

        if(!userDB) {
            user = new User({
                name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            user = userDB;
            user.google = true;
        }

        // Guardar usuario
        await user.save();

         //Generar el token
         const token = await generateJWT(user.id);

        res.json({
            ok: true,
            email,
            name,
            picture,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Token de google no es correcto'
        });
    }
    
}

const renewToken = async (req, res = response) => {
    const uid = req.uid;
    //Generar el token
    const token = await generateJWT(uid);
    res.json({
        ok: true,
        token
    });
};

module.exports = {
    login,
    googleSignIng,
    renewToken
}