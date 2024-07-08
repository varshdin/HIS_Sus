
// Contact us 
exports._contactUsUser = async(req,res)=>{
    try {
        req.body = __._form(req.body)

        // Validation 
        var required = ["firstname", "lastname","email","message", "subject"]
        var validate = __._checkFields(req.body,required)

        if(validate !== true) throw new Error(validate.message)

        var data = {
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            phone: (req.body.phone) ? req.body.phone : '',
            message : req.body.message,
            email : req.body.email,
            subject: req.body.subject,
            statusDate : {
                status : 'pending',
                date : new Date().getTime()
            }
        }
        var contactResponse = await Model._create(_Contactus, data)

        if(!contactResponse) throw new Error('Oops! You can\'t connect because you form is not a valid file.')
        
        // Mail send to administration
        const adminMail = {
            to: CONFIG.adminMail,
            subject: 'New inquiry at Sustainability Monitor',
            template: 'adminMailTemplate.hbs',
            context :{
                name: req.body.firstname + ' ' + req.body.lastname,
                userEmail: req.body.email,
                userSubject : req.body.subject,
                message: req.body.message
            }   
        }	
        console.log(adminMail)
        await _Mail(adminMail)
                
        // Mail send to user
        const mail = {
            to  : req.body.email,
            subject: 'Your inquiry at Sustainability Monitor',
            template :'contactUs.hbs',
            context :{
                userSubject : req.body.subject,
                name: req.body.firstname +' ' + req.body.lastname
            }   
        }	

        await _Mail(mail)
        __.res(res,`Hi ${req.body.firstname +' ' + req.body.lastname}, Your message has been received, and we will respond to you as soon as we can.`,200)            
                
    } catch (error) {
        __.res(res,error.message,500)
    }
}

// Update ticket
exports._updateTicket = async(req,res)=>{
    try {
        // Validation

      req.body = __._form(req.body);
  
      if(Object.keys(req.body).length == 0){
            __.res(res,'Oops! something went wrong,Please try again.',500)
            return false;
      }
  
      const required = [
        "description",
        "status",
        "ticketId",
      ];

      const validator = __._checkFields(req.body, required);
  
      if (validator != true) throw new Error(validator.message);
  
      var condition = {
          _id : req.body.ticketId
      }

      var ticket = await Model._findOne(_Contactus,condition,{},false)

      if(!ticket) throw new Error('Oops! Ticket not found')

      ticket.status = req.body.status
      ticket.response = req.body.description
      
      var checkDate = false;

      for (let index = 0; index < ticket.statusDate.length; index++) {
          const date = ticket.statusDate[index];
          if(req.body.status == date.status){
            checkDate = true;
          }
      }

      if(!checkDate){
        ticket.statusDate.push({
            date : new Date().getTime(),
            status : req.body.status
        })
      }


        // Send Mail        _Mail(mail);

        const mail = {
            to  : ticket.email,
            subject: 'Inquiry about Sustainability Info/Website',
            template :'contactUs.hbs',
            context :{subject :'Inquiry about Sustainability Info/Website',
            name: ticket.name,
                message: `Thank you for your email! We're more than happy to help you with your request.
                
In regards to your request regarding [Subject]. We will contact you as soon as possible via Email. Thank you for your patient.

Have a nice day,
                Your request number(${ticket._id}) has been ${ticket.status}`,
            response : ticket.response
        }}	

        await _Mail(mail)
        

      ticket.save();

      __.res(res,ticket,200)


    } catch (error) {
        __.res(res,error.message,500)
    }
}


// Get Teams 
exports._getTeamsMember = async (req, res) => {
    try {
        var condition = {
            status: 'active'
        };
        var options = {
            skip: 0
        };

        if (req.body.options) {
            options.limit = Number(req.body.options.limit) || 40;
            options.sort = (req.body.options.sort) || "_id";
            options.skip = Number(req.body.options.skip) || 0;
        }

        const teams = await Model._find(_Team, condition, options)
        if (!teams) throw new Error('Oops! teams are not available')

        __.res(res, teams, 200)

    } catch (error) {
        __.res(res, error.message, 500)
    }
}
