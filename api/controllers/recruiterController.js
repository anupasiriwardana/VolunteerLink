//importing data models
const Opportunity = require('../models/opportunityModel');
const Application = require('../models/applicationModel');
const Organization = require('../models/organizationModel');
const { Recruiter, IndependentRecruiter, OrganizationRepresenter } = require('../models/recruiterUserModel');
const { Volunteer, VolunteerDetails} = require('../models/volunteerUserModel');
const Admin = require('../models/adminModel');
const { hashPassword } = require('./passwordHandler');

//POST / create recruiter-> recruiter signup
const createRecruiter = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        organizationOrIndependent,
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

        const hashedPassword = await hashPassword(password); //hasing the pwsd using the imported funnc

        const newRecruiter = await Recruiter.create({
            firstName,
            lastName,
            email,
            organizationOrIndependent,
            password : hashedPassword
        });
        res.status(201).json({message : "recruiter created succesfully"}); // Changed status code to 201 for resource creation
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not create recruiter" });
    }
};

//DELETE recruiter
const deleteRecruiter = async (req, res) => {
    const recruiterId = req.params.id;

    try {
        const deletedRecruiter = await Recruiter.findByIdAndDelete(recruiterId);
        if (!deletedRecruiter) {
            return res.status(404).json({ error: "Recruiter not found" });
        }
        //deleting the projects created by recruiter
        const projects = await Opportunity.deleteMany({ recruiterId : recruiterId });
        
        //checking if recruiter is organization or indepedent and deleteig relevnt recrod
        if(deletedRecruiter.organizationOrIndependent == 'Independent'){
            const deletedIndRecDetails = await IndependentRecruiter.findOneAndDelete({recruiterId : recruiterId});
            res.status(200).json({deletedRecruiter,deletedIndRecDetails});
        }else{//organizationn  representer -> deleting the organization represnter record
            const orgRepresenter = await OrganizationRepresenter.findOneAndDelete({recruiterId : recruiterId});
            //finding whether there exisits more representers for the same organizationn
            const otherOrgRepresenters = await OrganizationRepresenter.find({organizationId : orgRepresenter.organizationId});
            //delete the organization if there's no any other repseresnet
            if(otherOrgRepresenters.length == 0){
                const deletedOrg = await Organization.findByIdAndDelete(orgRepresenter.organizationId);
                return res.status(200).json({deletedRecruiter,orgRepresenter,deletedOrg});
            }
            return res.status(200).json({deletedRecruiter,orgRepresenter});
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not delete recruiter" });
    }
};

//POST personal details of independent recruiter -DONT CHANGE THIS
const saveIndependentRecruiterDetails = async(req, res) => {
    const { id } = req.params;  
    console.log(id)
    const {
        nicNo,
        phoneNo,
        country,
        city,
        address,
        linkedInProfile,
        website,
        bio,
        services
    } = req.body;

    try {
        // Add doc to db
        const newIndependentRecruiterDetails = await IndependentRecruiter.create({
            recruiterId: id,  // Using recruiter ID from params
            nicNo,
            phoneNo,
            country,
            city,
            address,
            linkedInProfile,
            website,
            bio,
            services
        });
        res.status(200).json(newIndependentRecruiterDetails);
    } catch (error) {
        res.status(400).json({ error: "Server Error: Could not save independent recruiter details" });
    }
};

//GET profile details of  recruiter - independent or organization representer
const getRecruiter = async (req, res) => {
    const recruiterId  = req.params.id;

    try {
        const recruiterDetails = await Recruiter.findById(recruiterId);
        const recruiterObj = recruiterDetails.toObject()

        if (!recruiterDetails) {
            return res.status(404).json({ error: "Recruiter not found" });
        }
        const independentRecruiterDetails = await IndependentRecruiter.findOne({ recruiterId: recruiterId });   // added by nuran
        let indObj = null;
        if(independentRecruiterDetails){
            indObj = independentRecruiterDetails.toObject()
        }

        //if (recruiterDetails.organizationOrIndependent === 'Independent') {   <- anupa's
        if (independentRecruiterDetails && recruiterDetails.organizationOrIndependent === 'Independent') {
            //const independentRecruiterDetails = await IndependentRecruiter.findOne({ recruiterId: recruiterId }); <anupa's
            
            // if (!independentRecruiterDetails) {
            //     return res.status(404).json({ error: "Recruiter details not found" }); <- anupa's
            // }
            //const mergedObject = Object.assign({}, recruiterDetails, independentRecruiterDetails);
            
            return res.status(200).json({...recruiterObj , ...indObj});
        } else {
            console.log(recruiterDetails)
            return res.status(200).json(recruiterDetails);
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server Error: Could not retrieve recruiter details" });
    }
};

const updateRecruiter = async (req, res) => {
    const { id } = req.params;

    try {
        const recruiterDetails = await Recruiter.findById(id);
        if (!recruiterDetails) {
            return res.status(404).json({ error: "Recruiter not found" });
        }

        // extracting emal and pswd 
        const { email, password, ...updateFields } = req.body;
        // checking if the email is already used by another admin, volunteer, or recruiter
        if (email) {
            const existingVolunteer = await Volunteer.findOne({ email });
            const existingRecruiter = await Recruiter.findOne({ email });
            const existingAdmin = await Admin.findOne({ email });

            if (existingAdmin || existingVolunteer || (existingRecruiter && existingRecruiter._id.toString() != id)) {
                return res.status(400).json({ error: "Email is already in use" });
            }
        }
        updateFields.email = email;

        if(password && password != ''){
            const hashedPassword = await hashPassword(password); //hashing paswd using imported func
            updateFields.password = hashedPassword;
        }

        const updatedRecruiter = await Recruiter.findByIdAndUpdate(id, {
            $set: {
                firstName : updateFields.fname,
                lastName : updateFields.lname,
                email : updateFields.email,
                password: updateFields.password,
            }
        }, {new:true});

        if (recruiterDetails.organizationOrIndependent === 'Independent') {
            const updatedIndependentRecruiter = await IndependentRecruiter.findOneAndUpdate(
                { recruiterId: id },
                updateFields,
                { new: true }
            );
            if (!updatedIndependentRecruiter) {
                return res.status(404).json({ error: "Recruiter details not found" });
            }
            return res.status(200).json({ updatedRecruiter, updatedIndependentRecruiter });
        } else {
            return res.status(200).json(updatedRecruiter);
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not update recruiter details" });
    }
};


//POST/CREATE organization details- DON'T CHANGE
const createOrganization = async (req, res) => {
    const { recruiterId } = req.params;
    const {
        orgId,
        name,
        type,
        website,
        description,
        email,
        country,
        city,
        address,
        roleWithinOrganization 
    } = req.body;

    try {
        //checking if recruiter exists
        const recruiter = await Recruiter.findById(recruiterId);
        if (!recruiter) {
            return res.status(404).json({ error: "Recruiter not found" });
        }

        // checking if recruiter is an organization-representer
        if (recruiter.organizationOrIndependent != 'Organization-representer') {
            return res.status(403).json({ error: "Recruiter is not an organization-representer" });
        }

        //reprsenter of an exisiting organization
        if(orgId){
            const existingOrg = await Organization.findById(orgId);
            if(existingOrg){
                //create organization representer record
                const newOrganizationRepresenter = await OrganizationRepresenter.create({
                    recruiterId: recruiter._id,
                    organizationId: orgId,
                    roleWithinOrganization
                });
                return res.status(201).json(newOrganizationRepresenter);
            }
        }

        // Creating the a new organization, if the organization is not exisiting
        const newOrganization = await Organization.create({
            name,
            type,
            website,
            description,
            email,
            country,
            city,
            address
        });

        // Creating the organization-representer record
        const newOrganizationRepresenter = await OrganizationRepresenter.create({
            recruiterId: recruiter._id,
            organizationId: newOrganization._id,
            roleWithinOrganization
        });

        res.status(200).json({newOrganization,newOrganizationRepresenter});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error: Could not create organization" });
    }
};

//GET organization details using recruiterId- DON'T CHANGE
const getOrganization = async (req, res) => {
    const { recruiterId } = req.params;

    try {
        // Checking if the recruiter exists
        const recruiter = await Recruiter.findById(recruiterId);
        if (!recruiter) {
            return res.status(404).json({ error: "Recruiter not found" });
        }

        // checking if recruiter is an organization-representer
        if (recruiter.organizationOrIndependent !== 'Organization-representer') {
            return res.status(403).json({ error: "Recruiter is not an organization-representer" });
        }

        // Finding the organization-representer record 
        const organizationRepresenter = await OrganizationRepresenter.findOne({ recruiterId: recruiterId });
        if (!organizationRepresenter) {
            return res.status(404).json({ error: "Organization-representer details not found" });
        }
        // finding the organization using the organizationId from the organization-representer record
        const organization = await Organization.findById(organizationRepresenter.organizationId);
        if (!organization) {
            return res.status(404).json({ error: "Organization not found" });
        }
        res.status(200).json({
            ...organization.toObject(),
            roleWithinOrganization : organizationRepresenter.roleWithinOrganization
        });
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not retrieve organization details" });
    }
};

//PATCH/UPDATE organization details -DON'T CHANGE
const updateOrganization = async (req, res) => {
    const { recruiterId } = req.params; 
    try {
        // Find the organization-representer record using the recruiterId
        const organizationRepresenter = await OrganizationRepresenter.findOne({ recruiterId: recruiterId });
        if (!organizationRepresenter) {
            return res.status(404).json({ error: "Organization-representer details not found" });
        }

        // Update the organization using the organizationId from the organization-representer record
        const updatedOrganization = await Organization.findByIdAndUpdate(
            organizationRepresenter.organizationId, 
            { ...req.body },
            { new: true } // Return the updated document
        );

        //if roleWithinorganization is present
        const updatedOrganizationRepresenter = await OrganizationRepresenter.findByIdAndUpdate(
            organizationRepresenter._id,
            { roleWithinOrganization: req.body.roleWithinOrganization },
            { new: true }
        );

        if (!updatedOrganization) {
            return res.status(404).json({ error: "Organization not found" });
        }

        res.status(200).json({updatedOrganization,updatedOrganizationRepresenter});
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not update organization" });
    }
};



//POST a new volunteering opportunity - DON'T CHANGE
const createOpportunity = async (req, res) => {
    const { recruiterId } = req.params; 
    const {
        title,
        description,
        categories,
        skillsRequired,
        virtualOrInPerson,
        location,
        startDate,
        endDate,
        applicationDeadline,
        orientationTraining
    } = req.body;

    try {
        // Find the recruiter
        const recruiter = await Recruiter.findById(recruiterId);
        if (!recruiter) {
            return res.status(404).json({ error: "Recruiter not found" });
        }

        let organizationId = null;

        // If the recruiter is an organization-representer, get the organizationId
        if (recruiter.organizationOrIndependent === 'Organization-representer') {
            const organizationRepresenter = await OrganizationRepresenter.findOne({ recruiterId: recruiterId });
            if (!organizationRepresenter) {
                //means hasn't creaatedd an organization yet
                return res.status(404).json({ error: "You are required to provide Your Organization Details through Profile Section first" });
            }
            organizationId = organizationRepresenter.organizationId;
        }else{
            //recruiter is independent
            const reccruiterDetails = await IndependentRecruiter.findOne({ recruiterId: recruiterId})
            if(!reccruiterDetails){
                //means hasn't entered personal details yet
                return res.status(404).json({ error: "Please Enter Your Personal Details through Profile Section first"});
            }
        }

        // Add the new opportunity to the database
        const newOpportunity = await Opportunity.create({
            recruiterId,
            organizationId,
            title,
            description,
            categories,
            skillsRequired,
            virtualOrInPerson,
            location: virtualOrInPerson === 'In-Person' ? location : null,
            startDate,
            endDate,
            applicationDeadline,
            orientationTraining
        });

        res.status(200).json(newOpportunity);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not create opportunity" });
    }
};

//GET all volunteering opportunities created by the recruiter - DON'T CHANGE
const getOpportunities = async(req, res)=> {
    const { recruiterId } =req.params;
    try{
        const opportunities = await Opportunity.find({ recruiterId: recruiterId }).sort({createdAt : -1});
        if(!opportunities){
            return res.status(404).json({error: "No opportunities found"});
        }
        res.status(200).json(opportunities);
    }catch(error){
        res.status(500).json({error: "Server Error: Could not retrieve opportunities"});
    }
}

//GET a single volunteering opprotunity -DON'T CHANGE
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

//UPDATE a volunteering opportunity - DON'T CHANGE
const updateOpportunity = async (req, res) => {
    const { opportunityId } = req.params;
    const { virtualOrInPerson,recruiterId, organizationId, ...updateFields } = req.body;

    try {
        // If virtualOrInPerson is "Virtual", set location to null
        if (virtualOrInPerson === 'Virtual') {
            updateFields.location = null;
        }

        const updatedOpportunity = await Opportunity.findOneAndUpdate(
            { _id: opportunityId },
            { ...updateFields, virtualOrInPerson }, // Spread the rest of the fields along with virtualOrInPerson
            { new: true }
        );

        if (!updatedOpportunity) {
            return res.status(404).json({ error: "Volunteering Opportunity not found" });
        }
        res.status(200).json(updatedOpportunity);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not update opportunity" });
    }
};

//DELETE a volunteering opportunity - DON'T CHANGE
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


//GET all volunteer applications based on reccruiter Id - DON'T CHANGE
const getApplications = async (req, res) => {
    const { recruiterId } = req.params;

    try {
        // Finding opportunities associated with the recruiterId
        const opportunities = await Opportunity.find({ recruiterId });

        if (!opportunities || opportunities.length === 0) {
            return res.status(404).json({ error: "No opportunities found for this recruiter" });
        }

        // Extracting opportunityIds from the found opportunities
        const opportunityIds = opportunities.map(opportunity => opportunity._id);

        // Finding all applications associated with the found opportunityIds
        const applications = await Application.find({ opportunityId: { $in: opportunityIds } });
        if (!applications || applications.length === 0) {
            return res.status(404).json({ error: "No applications found for this opportunity" });
        }

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not retrieve applications" });
    }
};


//UPDTAE/PATCH volunteer application - DON'T CHANGE
const updateApplicationStatus = async(req, res) => {
    const { applicationId } = req.params; 
    const { status } = req.body; 

    const validStatuses = ['Accepted', 'Rejected', 'Pending'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value provided" });
    }

    try {
        const updatedApplication = await Application.findByIdAndUpdate(
            applicationId, 
            { status },
            { new: true } // This returns the updated document
        );

        if (!updatedApplication) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.status(200).json(updatedApplication);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error: Could not update application status" });
    }
};

//DELETE a volunteer application - REMOVED
// const deleteApplication = async(req, res) => {
//     const {id} = req.params;
//     try{
//         const removedApplication = await Application.findOneAndDelete({_id: id});

//         if(!removedApplication){
//             return res.status(404).json({error: "Volunteering Application not found"});
//         }
//         res.status(200).json(removedApplication);
//     }catch(error){
//         res.status(400).json({error: "Server Error: Could not delete application"});
//     }
// };

//GET a volunteer profile using applicationId - DON'T CHANGE
const getVolunteerProfile = async (req, res) => {
    const { applicationId } = req.params;

    try {
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        // geting  volunteerId from application
        const volunteerId = application.volunteerId;

        // fidning volunteer profile by volunteerId
        const volunteer = await Volunteer.findById(volunteerId);
        if (!volunteer) {
            return res.status(404).json({ error: "Volunteer not found" });
        }

        // finding volunteer details by volunteerId
        const volunteerDetails = await VolunteerDetails.findOne({ volunteerId });
        if (!volunteerDetails) {
            return res.status(404).json({ error: "Volunteer details not found" });
        }

        // Combining volunteer basic info and volunteer details 
        const volunteerProfile = {
            ...volunteer._doc,
            ...volunteerDetails._doc
        };
        res.status(200).json(volunteerProfile);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error: Could not retrieve volunteer profile" });
    }
};

//get organizations
const getOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find();
        if(!organizations){
            return res.status(404).json({ error: "No organizations found" });
        }
        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not retrieve organizations" });
    }
};




module.exports = {
    getOpportunities,
    getOpportunity,
    createOpportunity,
    deleteOpportunity,
    updateOpportunity,
    getApplications,
    updateApplicationStatus,
    //deleteApplication,
    getOrganization,
    createOrganization,
    updateOrganization,
    createRecruiter,
    deleteRecruiter,
    updateRecruiter,
    saveIndependentRecruiterDetails,
    getRecruiter,
    getVolunteerProfile,
    getOrganizations
};