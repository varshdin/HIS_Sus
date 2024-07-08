const Schema = mongoose.Schema;

const Sectors = new Schema({
    name: { type: String, unique: true },
    image: { type: String, default: "" },
    description: { type: Object, default: { en: '', de: '' } },
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

module.exports = mongoose.model("Sectors", Sectors)