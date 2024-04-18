const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async (req, res) => {
    // Obtener los queryParams
    // Hacemos una paginación para mostrar desde el registro "from"
    const from = Number(req.query.from) || 0;
    console.log(from);
    // Obtiene todos los usuarios
    // El {} hace que se filtre el get

   const [ users, total ] = await Promise.all([
        User.find({}, 'name email role google img')
            .skip(from)
            .limit(5),

        User.countDocuments()
    ]);


    res.json({
        ok: true,
        users,
        // Este valor del uid lo obtenemos desde el middleware
        // Esto nos retorno el uid del que esta haciendo la petición
        uid: req.uid,
        total
    });
};

const createUser = async(req, res =  response) => {
    const { email, password } = req.body;
  

    try {
        // Buscamos si ya existe el email en BD
        const duplicateEmail = await User.findOne({ email});

        if(duplicateEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe en BD'
            });
        }

        const user = new User(req.body);
        //Encriptar contraseña
        // genSaltSync, genera un numero aleatorio
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
       
        // el await va porque el save() retorna una promesa
        await user.save();

         //Generar el token
         const token = await generateJWT(user.id);
        
    
        res.json({
            ok: true,
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }

 
};

const updateUser = async (req, res = response) => {
    //TODO: Validar token y comprobar si es el usuario correcto 
    const uid = req.params.id;
    
    try {
        const userDb = await User.findById(uid);

        if(!userDb) {
            res.status(404).json({
                ok: false,
                msg: 'No existe usuario con ese id'
            });
        }
        // Actualizar usuario
        const {password, google, email, ...inputs} = req.body;

        if(userDb.email !== req.body.email) {
            const emailExists = await User.findOne({ email });
            if(emailExists) {
                return res.status(400).json({
                    ok: false,
                   msg: 'Ya existe usuario con ese email'
                });
            }
        }

        inputs.email = email;
        // { new: true } esto se pone para que retorne el user actualizado de lo contrario te retorna el anterior
        const userUpdated = await User.findByIdAndUpdate(uid, inputs, { new: true });

        res.json({
            ok: true,
            user: userUpdated
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
           msg: 'Error inesperado'
        });
    }
};

const deleteUser = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const userDb = await User.findById(uid);
        if(!userDb) {
            res.status(404).json({
                ok: false,
                msg: 'No existe usuario con ese id'
            });
        }

        await User.findByIdAndDelete( uid );

    } catch (error) {
        res.status(500).json({
            ok: false,
           msg: 'Error inesperado'
        });
    }

    res.json({
        ok: true,
        msg: 'Usuario Eliminado correctamente'
    });
}

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};