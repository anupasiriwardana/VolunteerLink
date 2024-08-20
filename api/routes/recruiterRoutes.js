const express = require('express');
const router = express.Router();

//importing controller funcs
const {
    getOpportunities,
    getOpportunity,
    createOpportunity,
    deleteOpportunity,
    updateOpportunity} = require('../controllers/recruiterController');

//GET all volunteering opportunities created by the recruiter
router.get('/opportunities',getOpportunities);

//GET a single volunteering opprotunity 
router.get('/opportunities/:id',getOpportunity);

//POST a new volunteering opportunity
router.post('/opportunities/create',createOpportunity);

//DELETE a volunteering opportunity
router.delete('/opportunities/:id',deleteOpportunity);

//UPDATE a volunteering opportunity
router.patch('/opportunities/:id',updateOpportunity);

//GET all volunteer applications


//UPDTAE/PATCH volunteer application

//GET a volunteer profile

//GET organization details

//POST/CREATE organization details

//PATCH/UPDATE organization details

//GET Personal details

//POST personal details

//UPDATE Personal details


module.exports = router;