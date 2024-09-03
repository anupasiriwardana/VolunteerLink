const express = require('express');
const router = express.Router();

//importinig controller funcs
const {
    createAdmin,
    getAdmin,
    updateAdmin,
    createRecruiter,
    getRecruiters,
    getRecruiterDetails,
    updateRecruiter,
    deleteRecruiter,
    createVolunteer,
    getVolunteers,
    getVolunteerDetails,
    updateVolunteer,
    deleteVolunteer,
    getAllOpportunities,
    getOpportunity,
    deleteOpportunity
} = require('../controllers/adminController');

//create admin
router.post('/profile',createAdmin);

//GET profile of admin
router.get('/profile/:adminId',getAdmin);

//UPDATE profile details of admin
router.patch('/profile/:adminId',updateAdmin);


//CREATE users - recruiter
router.post('/users/recruiters',createRecruiter);

//GET all users - recruiter
router.get('/users/recruiters',getRecruiters);

//GET a profile of a user - recruiter
router.get('/users/recruiters/:recruiterId',getRecruiterDetails);

//UPDATE users - recruiter
router.patch('/users/recruiters/:recruiterId',updateRecruiter);

//DELETE users - recruiter
router.delete('/users/recruiters/:recruiterId',deleteRecruiter);


//CREATE users - volunteer
router.post('/users/volunteers',createVolunteer);

//GET all users - volunteer
router.get('/users/volunteers',getVolunteers);

//GET a profile of a user - volunteer
router.get('/users/volunteers/:volunteerId',getVolunteerDetails);

//UPDATE users - volunteer
router.patch('/users/volunteers/:volunteerId',updateVolunteer);

//DELETE users - volunteer
router.delete('/users/volunteers/:volunteerId',deleteVolunteer);


//GET all opportunities
router.get('/opportunities',getAllOpportunities);

//GET a single opportunity
router.get('/opportunities/:opportunityId',getOpportunity);

//DELETE opportunity
router.delete('/opportunities/:opportunityId',deleteOpportunity);

module.exports = router;
