var companies = require('../data/companies-data.json');
var teams = require('../data/teams.json');

// Companies data maker

exports.dataMakerScript = async () => {
    try {
        var sectorData = {};
        var firmData = {};

        for (let index = 0; index < companies.length; index++) {
            const firm = companies[index];
            sectorData = { name: firm.sector }

            var condition = sectorData;
            let options = {}

            var sector = await Model._findOne(_Sector, condition, options)
            if (!sector) {
                sector = await Model._create(_Sector, sectorData);
                if (!sector) console.log('Oops! Sector is not created!');
            }

            console.log('------------------------------------------', sector);

            if(sector._id){
                firmData = {
                    name: firm.firm,
                    stock_isin: firm.stock_isin,
                    sector: sector._id,
                    group: firm.group,
                    logo: firm.reports_page_link,
                    description: {
                        en: firm.description,
                        de: firm.description
                    },
                    web_link: firm.web_link,
                    reports: firm.dow_reports_link,
                    wordcloud: firm.wordcloud,
                    status: "active"
                }
                
                condition = { name: firm.firm };

                var firmSave = await Model._findOne(_Firm, condition, options, false)
                
                if (!firmSave) {
                    firmSave = await Model._create(_Firm, firmData);
                    if (!firmSave) console.log('Oops! Sector is not created!');
                } else {
                    firmSave.stock_isin = firm.stock_isin;
                    firmSave.sector = sector._id;
                    firmSave.group = firm.group;
                    firmSave.logo = firm.reports_page_link;
                    firmSave.description = {
                        en: firm.description,
                        de: firm.description
                    };
                    firmSave.web_link = firm.web_link;
                    firmSave.reports = firm.dow_reports_link;
                    firmSave.wordcloud = firm.wordcloud;
                 
                    firmSave.save();
                }
                
            }
            console.log('------------------------------------------', firmSave);
        }
    } catch (error) {
        console.log(error)
        // __.res(res, error.message, 500)
    }
}

// Team data maker

exports.teamDataMakerScript = async () => {
    try {
    } catch (error) {
        console.log(error)
        // __.res(res, error.message, 500)
    }
}
