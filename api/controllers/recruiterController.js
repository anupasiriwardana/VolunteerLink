//importing data models
const Opportunity = require('../models/opportunityModel');
const Application = require('../models/applicationModel');


//GET all volunteering opportunities created by the recruiter
const getOpportunities = async(req, res)=> {
    const opportunities = await Opportunity.find({}).sort({createdAt : -1});
    res.status(200).json(opportunities);
}

//GET a single volunteering opprotunity 
const getOpportunity = async(req, res) => {
    const {id} = req.params;
    const opportunity = await Opportunity.findById({_id : id});
    if(!opportunity) {
        return res.status(404).json({error: "Volunteering Opportunity not found"});
    }
    res.status(200).json(opportunity);
};

//POST a new volunteering opportunity
const createOpportunity = async(req, res) => {
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
    
    try{
        //add doc to db
        const newOpportunity = await Opportunity.create({
            title,
            description,
            categories,
            skillsRequired,
            virtualOrInPerson,
            location : virtualOrInPerson === 'In-Person' ? location : null,
            startDate,
            endDate,
            applicationDeadline,
            orientationTraining
        });
        res.status(200).json(newOpportunity);
    }catch(error){
        res.status(400).json({error: "Server Error: Could not create opportunity"});
    }
};

//DELETE a volunteering opportunity
const deleteOpportunity = async(req, res) => {
    const {id} = req.params;
    try{
        const removedOpportunity = await Opportunity.findOneAndDelete({_id: id});

        if(!removedOpportunity){
            return res.status(404).json({error: "Volunteering Opportunity not found"});
        }
        res.status(200).json(removedOpportunity);
    }catch(error){
        res.status(400).json({error: "Server Error: Could not delete opportunity"});
    }
};

//UPDATE a volunteering opportunity
const updateOpportunity = async(req, res) => {
    const {id} = req.params;
    try {
        const updatedOpportunity = await Opportunity.findOneAndUpdate(
          { _id: id },
          { ...req.body },
        );

        if (!updatedOpportunity) {
          return res.status(404).json({ error: "Volunteering Opportunity not found" });
        }
        res.status(200).json(updatedOpportunity);
      } catch (error) {
        res.status(500).json({ error: "Server Error: Could not update opportunity" });
      }
};


//GET all volunteer applications
const getApplications = async(req, res) => {
    const applications = await Application.find({}).sort({createdAt : -1});
    res.status(200).json(applications);
};

//UPDTAE/PATCH volunteer application
const updateApplicationStatus = async(req, res) => {
    const { id } = req.params; 
    const { status } = req.body; 

    const validStatuses = ['Accepted', 'Rejected', 'Pending'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value provided" });
    }

    try {
        const updatedApplication = await Application.findByIdAndUpdate(
            id, 
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

//DELETE a volunteer application
const deleteApplication = async(req, res) => {
    const {id} = req.params;
    try{
        const removedApplication = await Application.findOneAndDelete({_id: id});

        if(!removedApplication){
            return res.status(404).json({error: "Volunteering Application not found"});
        }
        res.status(200).json(removedApplication);
    }catch(error){
        res.status(400).json({error: "Server Error: Could not delete application"});
    }
};

//GET a volunteer profile

//GET organization details

//POST/CREATE organization details

//PATCH/UPDATE organization details

//GET Personal details

//POST personal details

//UPDATE Personal details


module.exports = {
    getOpportunities,
    getOpportunity,
    createOpportunity,
    deleteOpportunity,
    updateOpportunity,
    getApplications,
    updateApplicationStatus,
    deleteApplication
};