const express = require('express')
const Router = express.Router()

// AdminLogin
Router.post('/contactUs/user', UsersController._contactUsUser);

//Firms
Router.post('/get/firms', FirmController._getFirms);
Router.post('/add/firm', FirmController._addFirm);

Router.post('/get/sectors', FirmController._getSectors);
Router.post('/get/firm/details', FirmController._getFirmDetails)

// User controller
// Router.post('/get/members', UsersController._getTeamsMember);

async function _publicAccess(req,res,next){
    try {
        var validate =  await __.verifyToken(req);
        next()
    } catch (error) {
        next()
    }
    
}

module.exports = Router;
