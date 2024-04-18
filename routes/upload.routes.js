/**Searches
 * 
 * Path: /api/upload
 */

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validator-jwt');
const expressFileUpload = require('express-fileupload');
const { fileUpload, getImage } = require('../controllers/upload.controller');

const router = Router();

// default options
router.use(expressFileUpload());

router.put('/:type/:id', validateJWT ,fileUpload);
router.get('/:type/:photo', validateJWT ,getImage);

module.exports = router;