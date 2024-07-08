const Schema = mongoose.Schema;

const Contactus = new Schema({

    firstname : {type : String, required: true },
    lastname : {type : String, required: true},
    email : {type : String, required: true},
    phone : {type : String,default : ''},
    message : String,
    response : String,
    subject: { type: String, required: true },
    status : {
        type : String,
        
        enum : [
                'pending',
                'canceled',
                'solved',
        ],

        default : 'pending'
    },

    statusDate : [{
        status : {type : String,default : 'pending'},
        date : {type : Number, default : new Date().getTime()}
    }],

    created_at : {type : Number,default : new Date().getTime()},
    updated_at : {type : Number,default : new Date().getTime()}

})

module.exports = mongoose.model('Contactus',Contactus)