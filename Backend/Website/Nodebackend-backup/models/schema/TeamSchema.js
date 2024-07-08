const Schema = mongoose.Schema;

const Teams = new Schema({
    name: String,
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    role: { type: String, default: '' },
    social_link: { type: Object, default: { linkedin : ''} },
    status: {
        type: String,

        enum: [
            'active',
            'deActive',
        ],
        default: 'active'
    },
    created_at: { type: Number, default: new Date().getTime() },
    updated_at: { type: Number, default: new Date().getTime() },
})

module.exports = mongoose.model('Teams', Teams)