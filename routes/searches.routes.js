/**Searches
 * 
 * Path: /api/all
 */

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validator-jwt');
const { searchInAllByFilter, searchInSchemaByFilter } = require('../controllers/search.controller');

const router = Router();

router.get('/:filter', validateJWT ,searchInAllByFilter);
router.get('/schema/:table/:filter', validateJWT ,searchInSchemaByFilter);

module.exports = router;