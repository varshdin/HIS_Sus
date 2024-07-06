const Schema = mongoose.Schema;

const Companies = new Schema({
    name: { type: String, unique: true },
    stock_isin: { type: String, default: "" },
    sector: { type: Schema.Types.ObjectId, ref: "Sectors" },
    group: { type: Number, default: 1 },
    logo: { type: String, default: "" },
    description: { type: Object, default: {en : '', de: ''} },
    web_link: { type: String, default: "" },
    reports: { type: Array, default: [] },
    status: { type: String, default: 'active' },
    wordcloud: { type: Array, default: [] },
    created_at: { type: Number, default: new Date().getTime() },
    updated_at: { type: Number, default: new Date().getTime() },
})


module.exports = mongoose.model("Companies", Companies)