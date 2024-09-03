const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const volunteerSchema = new Schema({
    firstName : {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true
    }
});

const volunteerDetailsSchema = new Schema({
    volunteerId: {
        type: Schema.Types.ObjectId,
        ref: 'Volunteer',
        required: true
    },
    phoneNo : {
        type : String,
        required : true
    },
    nic : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    dob : {
        type : Date,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    bio : {
        type : String,
        required : false
    },
    skills : {
        type: [String],
        required: false
    }
},{timestamps : true});


const Volunteer = mongoose.model('Volunteer', volunteerSchema);
const VolunteerDetails = mongoose.model('VolunteerDetails', volunteerDetailsSchema);

module.exports = { Volunteer, VolunteerDetails};