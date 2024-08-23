//importing data models
const Opportunity = require('../models/opportunityModel');
const Application = require('../models/applicationModel');
const Organization = require('../models/organizationModel');
const { Recruiter, IndependentRecruiter, OrganizationRepresenter } = require('../models/recruiterUserModel');
const { Volunteer, VolunteerDetails} = require('../models/volunteerUserModel');

//POST / create recruiter-> recruiter signup
const createRecruiter = async(req, res) => {
    const {
        firstName,
        lastName,
        email,
        organizationOrIndependent,
        password
      } = req.body; 
    
    try{
        //add doc to db
        const newRecruiter = await Recruiter.create({
            firstName,
            lastName,
            email,
            organizationOrIndependent,
            password
        });
        res.status(200).json(newRecruiter);
    }catch(error){
        res.status(400).json({error: "Server Error: Could not create recruiter"});
    }
};

//POST personal details of independent recruiter
const saveIndependentRecruiterDetails = async(req, res) => {
    const { id } = req.params;  
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
    const { recruiterId } = req.body;

    try {
        const recruiterDetails = await Recruiter.findById(recruiterId);

        if (!recruiterDetails) {
            return res.status(404).json({ error: "Recruiter not found" });
        }

        if (recruiterDetails.organizationOrIndependent === 'Independent') {
            const independentRecruiterDetails = await IndependentRecruiter.findOne({ recruiterId: recruiterId });

            if (!independentRecruiterDetails) {
                return res.status(404).json({ error: "Recruiter details not found" });
            }
            return res.status(200).json({recruiterDetails,independentRecruiterDetails});
        } else {
            return res.status(200).json({recruiterDetails});
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not retrieve recruiter details" });
    }
};

//UPDATE Profile details of recruiter - independent or organization representer
const updateRecruiter = async (req, res) => {
    const { id } = req.params;

    try {
        const recruiterDetails = await Recruiter.findById(id);
        if (!recruiterDetails) {
            return res.status(404).json({ error: "Recruiter not found" });
        }

        // Excluding 'organizationOrIndependent' field(if there's one) from the update
        const { organizationOrIndependent, ...updateFields } = req.body;

        const updatedRecruiter = await Recruiter.findByIdAndUpdate(
            id,
            updateFields, // Only update the allowed fields
            { new: true } // Return the updated document
        );

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


//POST/CREATE organization details
const createOrganization = async (req, res) => {
    const { recruiterId } = req.params;
    const {
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
        if (recruiter.organizationOrIndependent !== 'Organization-representer') {
            return res.status(403).json({ error: "Recruiter is not an organization-representer" });
        }

        // Creating the organization
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
        res.status(500).json({ error: "Server Error: Could not create organization" });
    }
};


//GET organization details using recruiterId
const getOrganization = async (req, res) => {
    const { recruiterId } = req.body;

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

        res.status(200).json(organization);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not retrieve organization details" });
    }
};


//PATCH/UPDATE organization details
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

        if (!updatedOrganization) {
            return res.status(404).json({ error: "Organization not found" });
        }

        res.status(200).json(updatedOrganization);
    } catch (error) {
        res.status(500).json({ error: "Server Error: Could not update organization" });
    }
};



//POST a new volunteering opportunity
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
                return res.status(404).json({ error: "Organization-representer details not found" });
            }
            organizationId = organizationRepresenter.organizationId;
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

//GET all volunteering opportunities created by the recruiter
const getOpportunities = async(req, res)=> {
    const { recruiterId } =req.body;
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

//GET a single volunteering opprotunity 
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

//UPDATE a volunteering opportunity
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

//DELETE a volunteering opportunity
const deleteOpportunity = async(req, res) => {
    const { opportunityId } = req.body;
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


//GET all volunteer applications based on reccruiter Id
const getApplications = async (req, res) => {
    const { recruiterId } = req.body;

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


//UPDTAE/PATCH volunteer application
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

//GET a volunteer profile using applicationId
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
    updateRecruiter,
    saveIndependentRecruiterDetails,
    getRecruiter,
    getVolunteerProfile
};