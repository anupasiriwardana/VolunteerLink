const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    website : {
        type: String,
        required: false
    },
    description : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    country : {
        type: String,
        required: true
    },
    city : {
        type: String,
        required: true
    },
    address : {
        type: String,
        required: true
    }
    
},{timestamps : true});

module.exports = mongoose.model('Organzation',organizationSchema);