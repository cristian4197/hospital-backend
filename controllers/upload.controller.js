
const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require('../helpers/update-image');

const fileUpload = async (req, res = response) => {
    const { type, id } = req.params;
    const typesAllowed = ['hospitals', 'users', 'doctors'];

    if (!typesAllowed.includes(type)) {
        return res.status(400).json({
            ok: false,
            msg: 'The type is not valid for search'
        });
    }

    // Validamos que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    // Procesar la imagen...

    // obtener archivo
    const file = req.files.image;
    // Separaramos el name del archivo para obtener la extension
    const cutName = file.name.split('.'); // wolwerine.1.3.jpg

    // Obtener Extension
    const extensionFile = cutName[cutName.length - 1];

    //Validar extensión
    const extensionAllowed = ['jpg', 'png', 'jpeg', 'gif'];

    if (!extensionAllowed.includes(extensionFile)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    // Generar el nombre del archivo
    const nameFile = `${uuidv4()}.${extensionFile}`;

    // Path para guardar la imagen
    const path = `./uploads/${type}/${nameFile}`;

    // Mover el archivo
    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover imagen'
            });
        }

        //Actualizar imagen en base de datos
        updateImage(type, id, nameFile);

        res.json({
            ok: true,
            msg: 'Archivo subido correctamente',
            nameFile
        });
    });


};

const getImage = (req, res = response) => {
    const { type, photo } = req.params;
    // __dirname, me obtiene la ruta actual en donde se encuentra la aplicacion
    const pathImg = path.join(__dirname, `../uploads/${type}/${photo}`);

    // imagen por defecto
    if(fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }

    
   
};


module.exports = {
    fileUpload,
    getImage
}