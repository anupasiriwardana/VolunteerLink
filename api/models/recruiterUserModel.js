const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recruiterSchema = new Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
    },
    organizationOrIndependent: {
        type: String,
        //enum: ['Organization-representer', 'Independent'], 
        required: true,
    },
    password : {
        type : String,
        required : true
    }
});

const independentRecruiterSchema = new Schema({
    recruiterId: {
        type: Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: true
    },
    nicNo: {
        type: String,
        required: false
    },
    phoneNo : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : false
    },
    address : {
        type : String,
        required: false
    },
    linkedInProfile : {
        type: String,
        required: false
    },
    website : {
        type: String,
        required : false
    },
    bio : { // <- skills & experience
        type: String,
        required: true
    },
    services : {
        type: String,
        required: false
    }
},{timestamps : true});

const organizationRepresenterSchema = new Schema({
    recruiterId: {
        type: Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: true
    },
    organizationId: {
        type: Schema.Types.ObjectId,
        required : true
    },
    roleWithinOrganization : {
        type : String,
        required : true
    }
})

const Recruiter = mongoose.model('Recruiter', recruiterSchema);
const IndependentRecruiter = mongoose.model('IndependentRecruiter', independentRecruiterSchema);
const OrganizationRepresenter = mongoose.model('OrganizationRepresenter',organizationRepresenterSchema);

module.exports = { Recruiter, IndependentRecruiter, OrganizationRepresenter };