const express = require('express');
const router = express.Router();

//importing controller funcs
const {
    getOpportunities,
    getOpportunity,
    createOpportunity,
    deleteOpportunity,
    updateOpportunity,
    getApplications,
    updateApplicationStatus,
    deleteApplication,
    getOrganization,
    createOrganization,
    updateOrganization,
    createRecruiter,
    saveIndependentRecruiterDetails,
    getRecruiter,
    updateRecruiter
} = require('../controllers/recruiterController');

//recruiter signup - CREATE recruiter
router.post('/signup',createRecruiter);

//POST personal details of independent recruiter
router.post('/profile/:id',saveIndependentRecruiterDetails);

//GET Personal details of recruiter (independent or organization-represnter)
router.get('/profile',getRecruiter);

//UPDATE Personal details of recruiter (independent or organization-representer)
router.patch('/profile/:id',updateRecruiter);


//POST/CREATE organization details
router.post('/organization/:recruiterId',createOrganization);

//GET organization details
router.get('/organization',getOrganization);

//PATCH/UPDATE organization details
router.patch('/organization/:recruiterId',updateOrganization);


//POST a new volunteering opportunity
router.post('/opportunities/create/:recruiterId',createOpportunity);

//GET all volunteering opportunities created by the recruiter
router.get('/opportunities',getOpportunities);

//GET a single volunteering opprotunity 
router.get('/opportunities/:opportunityId',getOpportunity);

//UPDATE a volunteering opportunity
router.patch('/opportunities/:opportunityId',updateOpportunity);

//DELETE a volunteering opportunity
router.delete('/opportunities',deleteOpportunity);


//GET all volunteer applications
router.get('/applications',getApplications);

//UPDTAE/PATCH volunteer application
router.patch('/applications/:id',updateApplicationStatus);

//DELETE a volunteer application
router.delete('/applications/:id',deleteApplication);


//GET a volunteer profile
router.get('/applications/volunteer/:id');





module.exports = router;