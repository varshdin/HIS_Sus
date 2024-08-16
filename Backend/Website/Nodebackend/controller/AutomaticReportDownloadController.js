const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Fetch company URLs from the PostgreSQL database
async function getCompanyUrls() {
    const res = await AWSClient.query('SELECT company_name, sustainability_url FROM companies');
    return res.rows;
}

// Create folders for each company
async function makeCompanyFolders(companyNames) {
    const rootPath = './File_filtered/';
    companyNames.forEach((name) => {
        const companyFolder = path.join(rootPath, name);
        if (!fs.existsSync(companyFolder)) {
            fs.mkdirSync(companyFolder, { recursive: true });
        }
    });
    return companyNames;
}

// Download PDF and upload to S3
// async function downloadPdfToS3(url, company) {
//     try {
//         // Making a request to download the PDF
//         const response = await axios.get(url, { responseType: 'arraybuffer' });
                
//         // Checking if the response is a PDF
//         const contentType = response.headers['content-type'];
//         if (contentType !== 'application/pdf') {
//             console.log(`Skipped: ${url} is not a PDF file.`);
//             return;
//         }

//         // Extracting the original filename from the URL
//         let originalFilename = url.split('/').pop();
//         if (!originalFilename) {
//             console.log(`Skipped: No filename found in the URL: ${url}`);
//             return;
//         }

//         // Generate a proper format name
//         const formattedFilename = generateFormattedFilename(originalFilename, company);

//         // Constructing the S3 key
//         const key = `staging/${company}/${formattedFilename}`;

//         // Check if the file already exists in S3
//         const fileExists = await checkIfFileExistsInS3(key);
//         if (fileExists) {
//             console.log(`Skipped: ${formattedFilename} already exists in S3 for company ${company}`);
//             return;
//         }
        
//         // Filtering the file based on its name
//         if (nameFilter(formattedFilename)) {
//             // Uploading the PDF to S3
//         } else {
//             console.log(`Filtered out: ${formattedFilename} does not meet the filter criteria.`);
//         }
        
//         await S3.putObject({
//             Bucket: 'files.sustainabilitymonitor.org',
//             Key: key,
//             Body: response.data,
//             ContentType: 'application/pdf',
//         }).promise();
//         console.log(`Uploaded: ${formattedFilename} to S3 for company ${company}`);
//     } catch (error) {
//         console.error(`Error downloading or uploading ${url} for company ${company}: ${error.message}`);
//     }
// }

async function downloadPdfToS3(url, company) {
    try {
        // Extracting the original filename from the URL
        let originalFilename = url.split('/').pop();
        if (!originalFilename) {
            console.log(`Skipped: No filename found in the URL: ${url}`);
            return;
        }

        // Generate a proper format name
        const formattedFilename = generateFormattedFilename(originalFilename, company);

        // Constructing the S3 key
        const key = `staging/${company}/${formattedFilename}`;

        // Check if the file already exists in S3
        const fileExists = await checkIfFileExistsInS3(key);
        if (fileExists) {
            console.log(`Skipped: ${formattedFilename} already exists in S3 for company ${company}`);
            return;
        }

        // Perform the download
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const contentType = response.headers['content-type'];

        // Check if the content type is PDF or if the filename ends with .pdf
        if (contentType !== 'application/pdf' && !originalFilename.toLowerCase().endsWith('.pdf')) {
            console.log(`Skipped: ${url} is not a PDF file.`);
            return;
        }

        // Filtering the file based on its name
        if (nameFilter(originalFilename)) {
            // Uploading the PDF to S3 with the new formatted name
            await S3.putObject({
                Bucket: 'files.sustainabilitymonitor.org',
                Key: key,
                Body: response.data,
                ContentType: 'application/pdf',
            }).promise();
            console.log(`Uploaded: ${formattedFilename} to S3 for company ${company}`);
        } else {
            console.log(`No matching filter criteria: ${originalFilename}. Using original name for upload.`);
            await S3.putObject({
                Bucket: 'files.sustainabilitymonitor.org',
                Key: `staging/${company}/${originalFilename}`,
                Body: response.data,
                ContentType: 'application/pdf',
            }).promise();
            console.log(`Uploaded with original name: ${originalFilename} to S3 for company ${company}`);
        }
    } catch (error) {
        console.error(`Error downloading or uploading ${url} for company ${company}: ${error.message}`);
    }
}


// Function to generate a proper formatted filename
// Function to generate a proper formatted filename
function generateFormattedFilename(originalFilename, company) {
    // Define default values
    let year = '';
    let documentType = 'Report';
    let language = '';

    // Improved year extraction from the filename
    const yearMatch = originalFilename.match(/(?:19|20)\d{2}/);
    if (yearMatch) {
        year = yearMatch[0];
    }

    // Determine document type based on keywords
    if (/sustainability/i.test(originalFilename)) {
        documentType = 'SustainabilityReport';
    } else if (/climate/i.test(originalFilename)) {
        documentType = 'ClimateReport';
    } else if (/emission/i.test(originalFilename)) {
        documentType = 'EmissionReport';
    } else if (/modern[_-]?slavery/i.test(originalFilename)) {
        documentType = 'ModernSlaveryStatement';
    } else if (/code[_-]?of[_-]?conduct/i.test(originalFilename)) {
        documentType = 'CodeOfConduct';
    } else if (/green[_-]?finance/i.test(originalFilename)) {
        documentType = 'GreenFinanceFramework';
    } else if (/nichtfinanzieller/i.test(originalFilename)) {
        documentType = 'NonFinancialReport';
    }

    // Determine language based on common language codes or indicators
    if (/en/i.test(originalFilename)) {
        language = 'EN';
    } else if (/de/i.test(originalFilename)) {
        language = 'DE';
    }

    // Generate the formatted filename
    const formattedFilename = `${company}_${year}_${documentType}${language ? '_' + language : ''}.pdf`;

    // If no year was found, consider adding a fallback year based on some default, if required
    return formattedFilename;
}


// Function to check if the file already exists in the S3 bucket
async function checkIfFileExistsInS3(key) {
    try {
        await S3.headObject({
            Bucket: 'files.sustainabilitymonitor.org',
            Key: key,
        }).promise();
        return true;  // File exists
    } catch (error) {
        if (error.code === 'NotFound') {
            return false;  // File does not exist
        }
        throw error;  // Other errors, such as permission issues, should be raised
    }
}

// Name filter function
function nameFilter(string) {
    const allowedWords = ["non_financial", "non-financial", "nonfinancial", "sustainable", "sustainability", 
    "nichtfinanzieller", "NFR", "environmental", "nachhaltig", "nachhaltigkeit", 
    "nhb", "annual", "sr", "cr", "report", "climate", "emission", "co2", 
    "green", "framework", "key_indicators", "modern_slavery", "diversity"];

    const excludeWords = ["half", "halb", "quarter", "quartal", "quarterly", "q1", "q2", "q3", 
    "analyst", "code_of_conduct", "policy", "statement", "declaration"];

    // Exclude based on excludeWords
    for (const word of excludeWords) {
        if (new RegExp(word, 'i').test(string)) {
            return false;
        }
    }

    // Allow based on allowedWords
    for (const word of allowedWords) {
        if (new RegExp(word, 'i').test(string)) {
            return true;
        }
    }

    return false;
}

// Main scraping function
exports._startAutomaticReportDownloading = async (req, res) => {
    try {
        const companies = await getCompanyUrls();
        await makeCompanyFolders(companies.map(c => c.company_name));
        
        for (const company of companies) {
            try {
                const response = await axios.get(company.sustainability_url);
                const $ = cheerio.load(response.data);
                const links = $('a[href$=".pdf"]').map((i, el) => $(el).attr('href')).get();
                
                for (let link of links) {
                    link = new URL(link, company.sustainability_url).href;  // Resolve relative URLs
                    // console.log(`Scraping ${link}`);
                    await downloadPdfToS3(link, company.company_name);
                }
            } catch (error) {
                console.error(`Error scraping ${company.company_name}: ${error.message}`);
            }
        }
        
        __.res(res, reports, 200)

    } catch (error) {
        __.res(res, error.message, 500)
    }
}