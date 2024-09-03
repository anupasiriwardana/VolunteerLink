//importing data models
const { Volunteer , VolunteerDetails } = require('../models/volunteerUserModel');
const  Opportunity  = require('../models/opportunityModel');
const  Application  = require('../models/applicationModel');
const { Recruiter } = require('../models/recruiterUserModel');
const Admin = require('../models/adminModel');


//volunteer signup - create POST volunteer
const createVolunteer = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;  

    try {
        //checking if the email is already used by anothr recruiter, volunter, or admin
        const existingVolunteer = await Volunteer.findOne({email});
        const existingRecruiter = await Recruiter.findOne({ email });
        const existingAdmin = await Admin.findOne({email});

        if (existingRecruiter || existingAdmin || existingVolunteer) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        // Creating a new volunteer if the email is not in use
        const newVolunteer = await Volunteer.create({ firstName, lastName, email, password });
        res.status(201).json(newVolunteer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error: Could not create volunteer" });
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
    const { volunteerId } = req.params; 

    try {
        const volunteer = await Volunteer.findById(volunteerId);
        const volunteerDetails = await VolunteerDetails.findOne({ volunteerId });

        // if (!volunteer || !volunteerDetails) {
        //     return res.status(404).json({ error: "Volunteer or volunteer details not found" });
        // }
        res.status(200).json({volunteer,volunteerDetails});
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not retrieve volunteer details" });
    }
};


//PATCH -update volunteer profile or details
const updateVolunteerDetails = async (req, res) => {
    const { volunteerId } = req.params;

    try {
        // remivg volunteerId from request body if present, and extraxting email
        const { volunteerId: _omit, email, ...updateFields } = req.body;

        if (email) {
            // checking if the email is already used by another recruiter volunteer admin
            const existingVolunteer = await Volunteer.findOne({ email });
            const existingRecruiter = await Recruiter.findOne({ email });
            const existingAdmin = await Admin.findOne({ email });

            if (existingRecruiter || existingAdmin || (existingVolunteer && existingVolunteer._id.toString() !== volunteerId)) {
                return res.status(400).json({ error: "Email is already in use" });
            }

            updateFields.email = email; //inclusing email in upate fields
        }

        const updatedVolunteer = await Volunteer.findByIdAndUpdate(
            volunteerId,
            { ...updateFields },
            { new: true }
        );

        const updatedVolunteerDetails = await VolunteerDetails.findOneAndUpdate(
            { volunteerId },
            { ...updateFields },
            { new: true }
        );

        return res.status(200).json({ updatedVolunteer, updatedVolunteerDetails });
    } catch (error) {
        console.error(error);
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

//GET a single opportunity
const getOpportunity = async(req, res) => {
    const { opportunityId } = req.params;
    try{
        const opportunity = await Opportunity.findById({_id : opportunityId});
        if(!opportunity) {
            return res.status(404).json({error: "Volunteering Opportunity not found"});
        }
        res.status(200).json(opportunity);
    }catch(error){
        res.status(500).json({error: "Server Error: Could not retrieve opportunity"});
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
            return res.status(400).json({ error: "You already have applied for this opportunity" });
        }
        
        const newApplication = await Application.create({
            volunteerId,
            opportunityId,
            statementOfInterest,
            status: 'Pending'
        });
        res.status(201).json(newApplication);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server Error: Could not submit application" });
    }
};


//GET all applications 
//here we hv to update when an opportunity is deleted -> application should return as an error msg
const getAllApplications = async (req, res) => {
    const { volunteerId } = req.params; 

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

const getApplication = async(req,res) => {
    const { applicationId } = req.params;
    try{
        const application = await Application.findById(applicationId);
        if(!application){
            return res.status(404).json({ error: "Application not found" });
        }
        res.status(200).json(application);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Server Error: Could not retrieve application" });
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

        if (existingApplication.status === 'Accepted' || existingApplication.status === 'Rejected') {
            return res.status(400).json({ error: "Cannot update application that has been accepted or rejected" });
        }

        // removing status field from request body if sent
        const { status: _omit, ...updateFields } = req.body;

        const updatedApplication = await Application.findByIdAndUpdate(
            applicationId,
            { ...updateFields }, 
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
        // if (existingApplication.status === 'Accepted' || existingApplication.status === 'Rejected') {
        //     return res.status(400).json({ error: "Cannot delete application that has been accepted or rejected" });
        // }

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
    deleteApplication,
    getOpportunity,
    getApplication
};