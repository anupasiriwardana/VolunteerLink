const express = require('express');
const router = express.Router();

//importing controller funcs
const {
    createVolunteer,
    saveVolunteerDetails,
    getVolunteerDetails,
    updateVolunteerDetails,
    getAllOpportunities,
    createApplication,
    getAllApplications,
    updateApplication,
    deleteApplication,
    getOpportunity,
    getApplication
} = require('../controllers/volunteerController');


//volunteer signup - create POST volunteer
router.post('/signup',createVolunteer);

//save - POST volunteer details
router.post('/profile/:volunteerId',saveVolunteerDetails);

//GET volunteer details
router.get('/profile/:volunteerId',getVolunteerDetails);

//PATCH volunteer details
router.patch('/profile/:volunteerId',updateVolunteerDetails);


//GET all opportunities
router.get('/opportunities',getAllOpportunities);

//GET a single opportunity
router.get('/opportunities/:opportunityId',getOpportunity);


//POST application
router.post('/opportunities/:opportunityId',createApplication);

//GET all applications
router.get('/applications/:volunteerId',getAllApplications);

router.get('/applicationinfo/:applicationId',getApplication)

//PATCH application
router.patch('/applications/:applicationId',updateApplication);

//DELETE application
router.delete('/applications/:applicationId',deleteApplication);

module.exports = router;