//importing data models
const { Volunteer , VolunteerDetails } = require('../models/volunteerUserModel');
const  Opportunity  = require('../models/opportunityModel');
const  Application  = require('../models/applicationModel');


//volunteer signup - create POST volunteer
const createVolunteer = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;  

    try {
        const newVolunteer = await Volunteer.create({ firstName, lastName, email, password });
        res.status(201).json(newVolunteer);
    } catch (error) {
        res.status(400).json({ error: "Server Error: Could not create volunteer" });
    }
};

//save - POST volunteer details
const saveVolunteerDetails = async (req, res) => {
    const { volunteerId } = req.params;
    const { phoneNo, nic, city, country, address, dob, gender, bio, skills } = req.body;

    try {
        const newVolunteerDetails = await VolunteerDetails.create({
            volunteerId,
            phoneNo,
            nic,
            city,
            country,
            address,
            dob,
            gender,
            bio,
            skills
        });
        res.status(201).json(newVolunteerDetails);
    } catch (error) {
        res.status(400).json({ error: "Server Error: Could not save volunteer details" });
    }
};

//GET volunteer details
const getVolunteerDetails = async (req, res) => {
    const { volunteerId } = req.body; 

    try {
        const volunteer = await Volunteer.findById(volunteerId);
        const volunteerDetails = await VolunteerDetails.findOne({ volunteerId });

        if (!volunteer || !volunteerDetails) {
            return res.status(404).json({ error: "Volunteer or volunteer details not found" });
        }
        res.status(200).json({volunteer,volunteerDetails});
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not retrieve volunteer details" });
    }
};


//PATCH volunteer details
const updateVolunteerDetails = async (req, res) => {
    const { volunteerId } = req.params;

    try {
        // Updating Volunteer model
        const updatedVolunteer = await Volunteer.findByIdAndUpdate(
            volunteerId,
            { ...req.body },
            { new: true }
        );
        if(!updatedVolunteer){
            return res.status(404).json({ error: "Volunteer not found" });
        }

        // Updating VolunteerDetails model
        const updatedVolunteerDetails = await VolunteerDetails.findOneAndUpdate(
            { volunteerId },
            { ...req.body },
            { new: true }
        );
        if (!updatedVolunteerDetails) {
            return res.status(404).json({ error: "Volunteer details not found" });
        }

        // Return the updated data
        return res.status(200).json({ updatedVolunteer, updatedVolunteerDetails });
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not update volunteer details" });
    }
};



//GET all opportunities
const getAllOpportunities = async (req, res) => {
    try {
        const opportunities = await Opportunity.find().sort({createdAt : -1});
        if(!opportunities){
            return res.status(404).json({ error: "No opportunities found" });
        }
        res.status(200).json(opportunities);
    } catch (error) {
        console.error("Error retrieving opportunities:", error);
        res.status(500).json({ error: "Server Error: Could not retrieve opportunities" });
    }
};


//POST application
const createApplication = async (req, res) => {
    const { opportunityId } = req.params;
    const { volunteerId, statementOfInterest } = req.body;

    try {
        // Checking if volunteer has already applied for same opportunity
        const existingApplication = await Application.findOne({ volunteerId, opportunityId });
        if (existingApplication) {
            return res.status(400).json({ error: "You have already applied for this opportunity" });
        }
        
        const newApplication = await Application.create({
            volunteerId,
            opportunityId,
            statementOfInterest,
            status: 'Pending'
        });
        res.status(201).json(newApplication);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not submit application" });
    }
};


//GET all applications
const getAllApplications = async (req, res) => {
    const { volunteerId } = req.body; 

    try {
        const applications = await Application.find({ volunteerId });
        res.status(200).json(applications);
        
        if(!applications){
            return res.status(404).json({ error: "No applications found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not retrieve applications" });
    }
};

//PATCH application
const updateApplication = async (req, res) => {
    const { applicationId } = req.params;

    try {
        const existingApplication = await Application.findById(applicationId);
        if (!existingApplication) {
            return res.status(404).json({ error: "Application not found" });
        }

        // Checking if the application status is accepted or rejected
        if (existingApplication.status === 'Accepted' || existingApplication.status === 'Rejected') {
            return res.status(400).json({ error: "Cannot update application that has been accepted or rejected" });
        }

        //updatin application
        const updatedApplication = await Application.findByIdAndUpdate(
            applicationId,
            { ...req.body },
            { new: true } 
        );
        res.status(200).json(updatedApplication);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not update application" });
    }
};


//DELETE application
const deleteApplication = async (req, res) => {
    const { applicationId } = req.params;

    try {
        const existingApplication = await Application.findById(applicationId);
        if (!existingApplication) {
            return res.status(404).json({ error: "Application not found" });
        }

        // Checking if the application status is accepted or rejected
        if (existingApplication.status === 'Accepted' || existingApplication.status === 'Rejected') {
            return res.status(400).json({ error: "Cannot delete application that has been accepted or rejected" });
        }

        // deleting application
        const deletedApplication = await Application.findByIdAndDelete(applicationId);
        res.status(200).json(deletedApplication);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not delete application" });
    }
};


module.exports = {
    createVolunteer,
    saveVolunteerDetails,
    getVolunteerDetails,
    updateVolunteerDetails,
    getAllOpportunities,
    createApplication,
    getAllApplications,
    updateApplication,
    deleteApplication
};