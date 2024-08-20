const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    recruiterId:{
        type: Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: false
    },
    volunteerId: {
        type: Schema.Types.ObjectId,
        ref: 'Volunteer',
        required : false
    },
    opportunityId : {
        type: Schema.Types.ObjectId,
        ref: 'Opportunity',
        required : false
    },
    applicationDate : {
        type: Date,
        default: Date.now
    },
    statementOfInterest : {
        type: String,
        required : true
    },
    status : {
        type: String,
        enum: ['Accepted', 'Rejected', 'Pending'], // Radio button-like options
        required: true,
    }
},{timestamps : true});

module.exports = mongoose.model('Application',applicationSchema);