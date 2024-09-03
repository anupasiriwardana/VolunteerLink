//importing data models
const Admin = require('../models/adminModel');
const Opportunity = require('../models/opportunityModel');
const Organization = require('../models/organizationModel');
const { Recruiter, IndependentRecruiter, OrganizationRepresenter } = require('../models/recruiterUserModel');
const { Volunteer, VolunteerDetails} = require('../models/volunteerUserModel');

//POST / create recruiter-> recruiter signup
const createAdmin = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        //checking if the email is already used by anothr recruiter, volunter, or admin
        const existingRecruiter = await Recruiter.findOne({ email });
        const existingAdmin = await Admin.findOne({email});
        const existingVolunteer = await Volunteer.findOne({email});

        if (existingRecruiter || existingAdmin || existingVolunteer) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        const newAdmin = await Admin.create({
            email,
            password
        });
        res.status(201).json(newAdmin); 
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not create Admin" });
    }
};



//GET profile of admin
const getAdmin = async (req, res) => {
    const { adminId } = req.params;

    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not retrieve admin profile" });
    }
};

//UPDATE profile details of admin
const updateAdmin = async (req, res) => {
    const { adminId } = req.params;
    const { email, password } = req.body;

    try {
        // checking if the email is already used by another admin, volunteer, or recruiter
        if (email) {
            const existingVolunteer = await Volunteer.findOne({ email });
            const existingRecruiter = await Recruiter.findOne({ email });
            const existingAdmin = await Admin.findOne({ email });

            if (
                (existingAdmin && existingAdmin._id.toString() !== adminId) || 
                existingVolunteer || 
                existingRecruiter
            ) {
                return res.status(400).json({ error: "Email is already in use" });
            }
        }

        const updateFields = {};
        if (email) {
            updateFields.email = email;
        }
        if (password) {
            updateFields.password = password; 
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            updateFields,
            { new: true }
        );

        if (!updatedAdmin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not update admin profile" });
    }
};



//CREATE users - recruiter
const createRecruiter = async (req, res) => {
    const { firstName, lastName, email, organizationOrIndependent, password } = req.body;

    try {
        //checking if the email is already used by anothr recruiter, volunter, or admin
        const existingRecruiter = await Recruiter.findOne({ email });
        const existingAdmin = await Admin.findOne({email});
        const existingVolunteer = await Volunteer.findOne({email});

        if (existingRecruiter || existingAdmin || existingVolunteer) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        const newRecruiter = await Recruiter.create({
            firstName,
            lastName,
            email,
            organizationOrIndependent,
            password,
        });
        res.status(201).json(newRecruiter);
    } catch (error) {
        res.status(400).json({ error: "Server Error: Could not create recruiter" });
    }
};

//GET all users - recruiter
const getRecruiters = async (req, res) => {
    try {
        const recruiters = await Recruiter.find();
        if(!recruiters){
            return res.status(404).json({ error: "No recruiters found" });
        }
        res.status(200).json(recruiters);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not retrieve recruiters" });
    }
};

//GET a profile of a user - recruiter
const getRecruiterDetails = async (req, res) => {
    const { recruiterId } = req.params;

    try {
        // getting the recruiter's basic details
        const recruiter = await Recruiter.findById(recruiterId);
        if (!recruiter) {
            return res.status(404).json({ error: "Recruiter not found" });
        }

        if (recruiter.organizationOrIndependent === 'Organization-representer') {
            const organizationRepresenter = await OrganizationRepresenter.findOne({ recruiterId });

            if (organizationRepresenter) {
                const organization = await Organization.findById(organizationRepresenter.organizationId);
                if (!organization) {
                    return res.status(404).json({ error: "Organization not found" });
                }

                return res.status(200).json({
                    recruiter: recruiter._doc,  // Basic recruiter details
                    organization: organization._doc,  // Organization details
                    roleWithinOrganization: organizationRepresenter.roleWithinOrganization // Role within organization
                });
            }
            if(!organizationRepresenter){
                return res.status(404).json({ error: "Organization representer details not found" });
            }

        } else if (recruiter.organizationOrIndependent === 'Independent') {
            //getting personal data of indepent recruiters
            const recruiterDetails = await IndependentRecruiter.findOne({ recruiterId });
            if (!recruiterDetails) {
                return res.status(404).json({ error: "Independent recruiter details not found" });
            }
            return res.status(200).json({
                recruiter: recruiter._doc,
                recruiterDetails: recruiterDetails ? recruiterDetails._doc : null
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not retrieve recruiter profile" });
    }
};



//UPDATE users - recruiter
const updateRecruiter = async (req, res) => {
    const { recruiterId } = req.params;
    const { email, password } = req.body;

    try {
        const updateFields = {}; //to store the fields and values to be updated
        if(email){
            //checking if the updated email is already used by anothr recruiter, volunter, or admin
            const existingRecruiter = await Recruiter.findOne({ email });
            const existingAdmin = await Admin.findOne({email});
            const existingVolunteer = await Volunteer.findOne({email});
            
            if ((existingRecruiter && existingRecruiter._id != recruiterId) || existingAdmin || existingVolunteer) {
                return res.status(400).json({ error: "Email is already in use" });
            }
            updateFields.email = email;
        }
        if(password) updateFields.password = password; //if passsword is present

        const updatedRecruiter = await Recruiter.findByIdAndUpdate(
            recruiterId,
            updateFields,
            { new: true }
        );
        if (!updatedRecruiter) {
            return res.status(404).json({ error: "Recruiter not found" });
        }
        res.status(200).json(updatedRecruiter);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error: Could not update recruiter profile" });
    }
};

//DELETE users - recruiter
const deleteRecruiter = async (req, res) => {
    const { recruiterId } = req.params;

    try {
        const deletedRecruiter = await Recruiter.findByIdAndDelete(recruiterId);
        if (!deletedRecruiter) {
            return res.status(404).json({ error: "Recruiter not found" });
        }
        res.status(200).json(deletedRecruiter);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not delete recruiter" });
    }
};


//CREATE users - volunteer
const createVolunteer = async (req, res) => {
    const { firstName, lastName, email, organizationOrIndependent, password } = req.body;

    try {
        //checking if the email is already used by anothr recruiter, volunter, or admin
        const existingRecruiter = await Recruiter.findOne({ email });
        const existingAdmin = await Admin.findOne({email});
        const existingVolunteer = await Volunteer.findOne({email});

        if (existingRecruiter || existingAdmin || existingVolunteer) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        const newVolunteer = await Volunteer.create({
            firstName,
            lastName,
            email,
            organizationOrIndependent,
            password,
        });
        res.status(201).json(newVolunteer);
    } catch (error) {
        res.status(400).json({ error: "Server Error: Could not create volunteer" });
    }
};

//GET all users - volunteer
const getVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find();
        if(!volunteers){
            return res.status(404).json({ error: "No volunteers found" });
        }
        res.status(200).json(volunteers);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not retrieve volunteers" });
    }
};

//GET a profile of a user - volunteer
const getVolunteerDetails = async (req,res) => {
    const {volunteerId} = req.params;

    try{
        const volunteer = await Volunteer.findById(volunteerId);
        if(!volunteer){
            return res.status(404).json({ error: "Volunteer not found" });
        }
        //geting volunter persnal details
        const volunteerDetails = await VolunteerDetails.findOne({volunteerId});
        if(!volunteerDetails){
            return res.status(404).json({error : "Volunteer details not found"});
        }
        res.status(200).json({volunteer,volunteerDetails});
    }catch(error){
        res.status(500).json({error : "Server Error: Could not retrieve volunteer details"});
    }
};

//UPDATE users - volunteer
const updateVolunteer = async (req, res) => {
    const {volunteerId }= req.params;
    const { email, password } = req.body;

    try{
        const updateFields = {}; //to store the fields and values to be updated
        if(email){
            //checking if the updated email is already used by anothr recruiter, volunter, or admin
            const existingRecruiter = await Recruiter.findOne({ email });
            const existingAdmin = await Admin.findOne({email});
            const existingVolunteer = await Volunteer.findOne({email});
            
            if (existingRecruiter || existingAdmin || (existingVolunteer && existingVolunteer._id != volunteerId)) {
                return res.status(400).json({ error: "Email is already in use" });
            }
            updateFields.email = email;
        }
        if(password) updateFields.password = password; //if passsword is present

        const updatedVolunteer = await Volunteer.findByIdAndUpdate(
            volunteerId,
            updateFields,
            {new: true}
        );
        if(!updatedVolunteer){
            return res.status(404).json({error : "Volunteer not found"});
        }
        res.status(200).json(updatedVolunteer);
    }catch(error){
        res.status(500).json({error : "Server Error: Could not update volunteer details"});
    }
};

//DELETE users - volunteer
const deleteVolunteer = async (req, res) => {
    const {volunteerId} = req.params;

    try{
        const deletedVolunteer = await Volunteer.findByIdAndDelete(volunteerId);
        if(!deletedVolunteer){
            return res.status(404).json({error : "Volunteer not found"});
        }
        res.status(200).json(deletedVolunteer);
    }catch(error){
        res.status(500).json({error : "Server Error: Could not delete volunteer"});
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

//DELETE opportunity
const deleteOpportunity = async(req, res) => {
    const { opportunityId } = req.params;
    try{
        const removedOpportunity = await Opportunity.findOneAndDelete({_id: opportunityId});
        if(!removedOpportunity){
            return res.status(404).json({error: "Volunteering Opportunity not found"});
        }
        res.status(200).json(removedOpportunity);
    }catch(error){
        res.status(400).json({error: "Server Error: Could not delete opportunity"});
    }
};


module.exports = {
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
};
