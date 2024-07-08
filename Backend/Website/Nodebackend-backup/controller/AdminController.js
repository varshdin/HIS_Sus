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
                    // if (firm.dow_reports_link.length !== 0) {
                    //     for (let index = 0; index < firm.dow_reports_link.length; index++) {
                    //         let newReportLink = firm.dow_reports_link[index];
                    //         let checkAvailableOrNot = false;
                    //         for (let index = 0; index < firmSave.reports.length; index++) {
                    //             let oldReportLink = firmSave.reports[index];
                    //             if (oldReportLink.split('/')[oldReportLink.split('/').length - 1] === newReportLink.split('/')[newReportLink.split('/').length - 1])
                    //                 checkAvailableOrNot = true;
                    //         }
                    //         if (checkAvailableOrNot)
                    //             firmSave.reports.push(newReportLink);
                    //     }
                    // }

                    // if (firm.wordcloud.length !== 0) {
                    //     for (let index = 0; index < firm.wordcloud.length; index++) {
                    //         let newCloudReportLink = firm.wordcloud[index];
                    //         let checkAvailableOrNot = false;
                    //         for (let index = 0; index < firmSave.wordcloud.length; index++) {
                    //             let oldCloudReportLink = firmSave.wordcloud[index];
                    //             if (oldCloudReportLink.split('/')[oldCloudReportLink.split('/').length - 1] === newCloudReportLink.split('/')[newCloudReportLink.split('/').length - 1])
                    //                 checkAvailableOrNot = true;
                    //         }
                    //         if (checkAvailableOrNot)
                    //             firmSave.wordcloud.push(newCloudReportLink);
                    //     }
                    // }

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
        var teamData = {};

        for (let index = 0; index < teams.length; index++) {
            const user = teams[index];
            teamData = { 
                name: user.name,
                image: user.image,
                role: user.role,
                social_link: user.social_link
            }

            var condition = { name: user.name };
            let options = {}

            var userSave = await Model._findOne(_Team, condition, options, false)
            if (!userSave) {
                userSave = await Model._create(_Team, teamData);
                if (!userSave) console.log('Oops! user is not created!');
            } else {
                userSave.image = user.image;
                userSave.social_link = user.social_link;
                userSave.save();
            }

           // console.log('------------------------------------------', userSave);
        }
    } catch (error) {
        console.log(error)
        // __.res(res, error.message, 500)
    }
}
