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


exports._getSectors = async (req, res) => {
    try {
        var condition = {};
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

        options.populate = { }
        // Calculate the skip value based on the page number
        if (req.body.page) {
            options.skip = (Number(req.body.page) - 1) * options.limit;
        }
        var sectors = await getAWSSectors(options)
                .then((rows) => {
                   return rows;
                })
                .catch((err) => {
                    throw new Error('Oops! sectors are not available')
                });
        // sectors = await Model._find(_Firm, condition, options)
        // if (!sectors) throw new Error('Oops! sectors are not available')

        __.res(res, sectors, 200)

    } catch (error) {
        __.res(res, error.message, 500)
    }
}


function getAWSSectors(options) {
    return new Promise((resolve, reject) => {
        AWSClient.query('SELECT * FROM sector ORDER BY nace_lev2_id ASC', (err, res) => {
            if (err) {
                reject(new Error('Oops! Sectors are not available......................'));
            } else {
                resolve(res.rows);
            }
        });
    });
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


exports._addFirm = async(req,res)=>{
    try {
        req.body = __._form(req.body)
        console.log(req.body);

                // Assuming you have the firm data from req.body
        const firmData = {
            company_name: req.body.com_name,
            company_alias: req.body.com_ali_name,
            nace_lev2_id: req.body.nace_lev2_id,
            nace_lev1_desc: req.body.Nace_Lev2_Id_Description,
            company_url: req.body.company_URL,
            sustainability_url: req.body.sustainability_URL,
            logo_link: req.body.company_logo,
            company_description: req.body.description
        };

        addFirm(firmData)
            .then(() => {
                __.res(res, 'Successfully firm has been added!' ,200)            
            })
            .catch(err => {
                console.error('Error adding firm:', err);
                __.res(res, err.message,500)
            });

        // // Validation 
        // var required = ["firstname", "lastname","email","message", "subject"]
        // var validate = __._checkFields(req.body,required)

        // if(validate !== true) throw new Error(validate.message)

        // var data = {
        //     firstname : req.body.firstname,
        //     lastname : req.body.lastname,
        //     phone: (req.body.phone) ? req.body.phone : '',
        //     message : req.body.message,
        //     email : req.body.email,
        //     subject: req.body.subject,
        //     statusDate : {
        //         status : 'pending',
        //         date : new Date().getTime()
        //     }
        // }
        // var contactResponse = await Model._create(_Contactus, data)

        // if(!contactResponse) throw new Error('Oops! You can\'t connect because you form is not a valid file.')
                
    } catch (error) {
        __.res(res,error.message,500)
    }
}

async function addFirm(firmData) {
    const query = `
      INSERT INTO companies (
        company_name,
        company_alias,
        nace_lev2_id,
        nace_lev1_desc,
        company_url,
        sustainability_url,
        logo_link,
        company_description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `;
    const values = [
      firmData.company_name,
      firmData.company_alias,
      firmData.nace_lev2_id,
      firmData.nace_lev1_desc,
      firmData.company_url,
      firmData.sustainability_url,
      firmData.logo_link,
      firmData.company_description
    ];
  
    try {
      const res = await AWSClient.query(query, values);
      console.log('Firm added successfully:', res.rowCount);
      return res.rowCount;
    } catch (err) {
      console.error('Error inserting firm:', err.stack);
      throw new Error('Error inserting firm');
    }
  }