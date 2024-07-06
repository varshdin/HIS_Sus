// Get all companies

const { values } = require("underscore");

exports._getFirms = async (req, res) => {
    try {
        var condition = {
            status: "active"
        };
        var options = {
            limit: 10,
            sort: "_id",
            skip: 0,
            select: "name logo reports"
        };
       

        if (req.body.options) {
            options.limit = Number(req.body.options.limit) || 40;
            options.sort = (req.body.options.sort) || "_id";
            options.skip = Number(req.body.options.skip) || 0;
        }

        options.populate = {
            path: 'sector',
            select: "-image -description -status -created_at -updated_at"
        }
        // Calculate the skip value based on the page number
        if (req.body.page) {
            options.skip = (Number(req.body.page) - 1) * options.limit;
        }
        var firms = await getAWSCompanies(options)
                .then((rows) => {
                   return rows;
                })
                .catch((err) => {
                    throw new Error('Oops! firms are not available')
                });
        // firms = await Model._find(_Firm, condition, options)
        // if (!firms) throw new Error('Oops! firms are not available')

        __.res(res, firms, 200)

    } catch (error) {
        __.res(res, error.message, 500)
    }
}

function getAWSCompanies(options) {
    
    return new Promise((resolve, reject) => {
        AWSClient.query('SELECT * FROM companies ORDER BY company_name', (err, res) => {
    
            if (err) {
                reject(new Error('Oops! firms are not available......................'));
            } else {
                resolve(res.rows);
            }
        });
    });
}


// Get Firm details
exports._getFirmDetails = async (req, res) => {
    try {
        var condition = {
            status: 'active',
            _id: req.body.condition._id
        };
        var options = {};
        options.populate = {
            path: 'sector',
            select: "-image -description -status -created_at -updated_at"
        }

        const firms = await getAWSCompanyById(req.body.condition._id)
            .then((rows) => {
                return rows;
            })
            .catch((err) => {
                throw new Error('Oops! firms are not available!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            });
        
        // const firms = await Model._findOne(_Firm, condition, options)
        // if (!firms) throw new Error('Oops! firm data is not available at the moment')

        __.res(res, firms, 200)

    } catch (error) {
        __.res(res, error.message, 500)
    }
}

function getAWSCompanyById(id) {
    return new Promise((resolve, reject) => {
        AWSClient.query(`SELECT * FROM companies where company_id = ${id}`, (err, res) => {
            if (err) {
                console.log(err);
                reject(new Error('Oops! firm are not available'));
            } else {
                resolve(res.rows);
            }
        });
    });
}
