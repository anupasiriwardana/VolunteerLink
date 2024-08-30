// Importing data models
const Admin = require('../models/adminModel');
const {Recruiter} = require('../models/recruiterUserModel');
const {Volunteer} = require('../models/volunteerUserModel');

// userlogin controler func
const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = null;
        let userType = null;
        
        // Checking wehther email exists in admin
        user = await Admin.findOne({ email });
        if (user) {
            if (user.password === password) {
                userType = "admin";
                return res.status(200).json({ 
                    message: "Login successful", 
                    userType,
                    user 
                });
            } else {
                return res.status(400).json({ error: "Invalid password" });
            }
        }

        // Checking wehther email exists in recruiter
        user = await Recruiter.findOne({ email });
        if (user) {
            if (user.password === password) {
                // now checking whther recruiter is independent or organization-representer
                if(user.organizationOrIndependent == "Organization-representer"){
                    userType = "organization-recruiter";
                }else{
                    userType = "independent-recruiter";
                }
                return res.status(200).json({ 
                    message: "Login successful", 
                    userType,
                    user 
                });
            } else {
                return res.status(400).json({ error: "Invalid password" });
            }
        }

        // Checking if email exists in Volunteer 
        user = await Volunteer.findOne({ email });
        if (user) {
            if (user.password === password) {
                userType = "volunteer";
                return res.status(200).json({ 
                    message: "Login successful", 
                    userType,
                    user 
                });
            } else {
                return res.status(400).json({ error: "Invalid password" });
            }
        }

        // If email doesn't match any user
        return res.status(404).json({ error: "User not found" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error: Could not log in" });
    }
};

module.exports = { userLogin };
