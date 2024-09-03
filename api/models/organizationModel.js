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
        required: false
    },
    country : {
        type: String,
        required: false
    },
    city : {
        type: String,
        required: false
    },
    address : {
        type: String,
        required: false
    }
    
},{timestamps : true});

module.exports = mongoose.model('Organzation',organizationSchema);