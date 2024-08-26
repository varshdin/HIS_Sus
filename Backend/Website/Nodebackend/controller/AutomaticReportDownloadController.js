const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Fetch company URLs from the PostgreSQL database
async function getCompanyUrls() {
    const res = await AWSClient.query('SELECT company_id, company_name, company_alias, sustainability_url FROM companies');
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

async function downloadPdfToS3(url, company) {
    try {
        // Extracting the original filename from the URL
        let originalFilename = url.split('/').pop();
        if (!originalFilename) {
            console.log(`Skipped: No filename found in the URL: ${url}`);
            return;
        }

        // Generate a proper format name
        const formattedFileData = generateFormattedFilename(originalFilename, company.company_alias);
        // Constructing the S3 key
        const key = `staging/${company.company_name}/${formattedFileData.originalFilename}`;

        // Check if the file already exists in S3
        const fileExists = await checkIfFileExistsInS3(key);
        if (fileExists) {
            console.log(`Skipped: ${formattedFileData.originalFilename} already exists in S3 for company ${company.company_alias}`);
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
        if (nameFilter(formattedFileData.originalFilename)) {
            // Uploading the PDF to S3 with the new formatted name
            await S3.putObject({
                Bucket: S3_BUCKET_NAME,
                Key: key,
                Body: response.data,
                ContentType: 'application/pdf',
            }).promise();
            console.log(`Uploaded: ${formattedFileData.originalFilename} to S3 for company ${company.company_alias}`);
            
            const downloadedDataStore = {
                company_id: company.company_id,
                company_alias: company.company_alias,
                download_filename: formattedFileData.originalFilename,
                download_extension: formattedFileData.originalFilename.split('.').pop(),
                download_year: formattedFileData.year,
                download_url: url,
                s3_url_staging:  `${S3_BUCKET_NAME_PREFIX_URL}${S3_BUCKET_NAME}/${key}`
            }
            await insertCompanyData(downloadedDataStore)
            console.log(`Company successfully stored in download table`);
        }
    } catch (error) {
        console.error(`Error downloading or uploading ${url} for company ${company.company_alias}: ${error}`);
    }
}


async function insertCompanyData(companyData) {
    try {
        const queryText = `
            INSERT INTO download (company_id, company_alias, download_filename, download_extension, download_year, download_url, s3_url_staging)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const values = [
            companyData.company_id,
            companyData.company_alias,
            companyData.download_filename,
            companyData.download_extension,
            (companyData.download_year)? companyData.download_year: null,
            companyData.download_url,
            companyData.s3_url_staging
        ];
        // console.log(values);
        const res = await AWSClient.query(queryText, values);
        // console.log('Data inserted successfully', res.rows[0]);
        console.log('Data inserted successfully in download table');

    } catch (err) {
        console.error('Error executing query in download table', err.stack);
    }
}


// Function to generate a proper formatted filename
function generateFormattedFilename(originalFilename, company) {
    // Define default values
    let year = '';

    // Improved year extraction from the filename
    const yearMatch = originalFilename.match(/(?:19|20)\d{2}/);
    if (yearMatch) {
        year = yearMatch[0];
    }

    const response = {
        originalFilename: originalFilename,
        year: year
    }

    return response;
}


// Function to check if the file already exists in the S3 bucket
async function checkIfFileExistsInS3(key) {
    try {
        await S3.headObject({
            Bucket: S3_BUCKET_NAME,
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
                    await downloadPdfToS3(link, company);
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