const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opportunitySchema = new Schema({
    recruiterId: {
        type: Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: false
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    categories: {
        type: [String], // Array of strings to allow multiple categories
        required: false,
    },
    skillsRequired: {
        type: [String], // Array of strings to list required skills
        required: false,
    },
    virtualOrInPerson: {
        type: String,
        enum: ['Virtual', 'In-Person'], // Radio button-like options
        required: true,
    },
    location: {
        type: String,
        required: function() {
            return this.virtualOrInPerson === 'In-Person';
        },
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    applicationDeadline: {
        type: Date,
        required: true,
    },
    orientationTraining: {
        type: String, // Optional, could be a description or details of orientation/training
        required: false,
    },
},{timestamps : true});

module.exports = mongoose.model('Opportunity',opportunitySchema);