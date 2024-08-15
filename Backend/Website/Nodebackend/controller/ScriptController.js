
// Automatically download reports
// Define the path to your script and the virtual environment
const { exec } = require('child_process');

// Define the path to your script and the virtual environment
const projectPath = path.resolve(__dirname, '../scripts/automatic_report_download/Scraper');
const venvPath = path.join(projectPath, 'venv');
const pythonCmd = path.join(venvPath, 'bin', 'python');  // Path to the Python interpreter in the venv
const reqFilePath = path.resolve(__dirname, '../scripts/automatic_report_download');
const requirementsFilePath = path.join(reqFilePath, 'requirements.txt');
const spiderPath = path.join(projectPath, 'Scraper', 'spiders');  // Path to the spiders directory

exports._startCollectingReports = async (req, res) => {
    try {
        // Check if the virtual environment directory exists
        if (!fs.existsSync(venvPath)) {
          // Create the virtual environment if it doesn't exist
          console.log('Virtual environment not found, creating one...');
          exec(`python3 -m venv ${venvPath}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error creating virtual environment: ${error}`);
              res.status(500).send(`Error creating virtual environment: ${error.message}`);
              return;
            }
            console.log('Virtual environment created successfully.');

            // After creating the virtual environment, install the requirements once
            installRequirements(res, () => {
              runSpider(res);
            });
          });
        } else {
          // If the virtual environment exists, skip installing requirements and directly run the Scrapy spider
          runSpider(res);
        }
    } catch (error) {
        __.res(res, error.message, 500)
    }
}
function installRequirements(res, callback) {
  // Install dependencies from requirements.txt
  console.log('Installing dependencies...');
  exec(`${pythonCmd} -m pip install -r ${requirementsFilePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error installing dependencies: ${error}`);
      res.status(500).send(`Error installing dependencies: ${error.message}`);
      return;
    }
    console.log('Dependencies installed successfully.');
    callback();
  });
}

function runSpider(res) {
  // Run the Scrapy spider
  console.log('Running the Scrapy spider...');
  exec(`cd ${spiderPath} && ${pythonCmd} -m scrapy crawl sustain`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Scrapy spider: ${error}`);
      __.res(res, `Error executing Scrapy spider: ${error.message}`, 500)
      return;
    }

    if (stderr) {
      console.log(`Scrapy stdout: ${stdout}`);
      // console.error(`Scrapy stderr: ${stderr}`);
      __.res(res, `Scrapy stderr: ${stderr}`, 500)
      return;
    }

    __.res(res, `Scrapy spider executed successfully: ${stdout}`, 200)
  });
}

//---------------------------------------------------------------------------------
//Upadte Report Table
async function listFilesFromS3(bucket, prefix) {
  const params = {
    Bucket: bucket,
    Prefix: prefix
  };

  try {
    const data = await S3.listObjectsV2(params).promise();
    return data.Contents.map(file => file.Key);
  } catch (err) {
    console.error("Error fetching files from S3:", err);
    throw err;
  }
}

exports._parseFileInfo = async (filePath) => {
  //const regex = /sustainability-reports\/Firm_ID\/(\d+)\/(.+?)_(.+?)_(.+?)_(\d{4})\.(.+)/;
 const regex = /sustainability-reports\/Firm_ID\/(\d+)\/(.+?)_(ESG|IR)_(.+?)_(\d{4})\.(.+)/;


  const match = filePath.match(regex);
  //console.log(match);
  if (match) {
    return {
      company_id: match[1],
      company_alias: match[2],
      report_filename:match[0].split('/').pop(),
      s3_url_production: 'https://s3.eu-central-1.amazonaws.com/files.sustainabilitymonitor.org/'+filePath,
      report_extension: match[6],
      report_type: match[3],
      report_language: match[4],
      report_year: match[5]
    };
  } else {
    console.log("File path does not match expected format")
    return null
  }
}

exports._storeReportInfo = async (reportInfo)  => {
  const query = `
    INSERT INTO reports (company_id, company_alias, report_filename, s3_url_production, report_extension, report_type, report_language, report_year)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING report_id
  `;

  const values = [
    Number(reportInfo.company_id),
    reportInfo.company_alias,
    reportInfo.report_filename,
    reportInfo.s3_url_production,
    reportInfo.report_extension,
    reportInfo.report_type,
    reportInfo.report_language,
    reportInfo.report_year
  ];
  try {
    const res = await AWSClient.query(query, values);
    return res.rows[0].report_id;
  } catch (err) {
    console.error("Error inserting report info into PostgreSQL:", err);
    throw err;
  }
}

async function reportExists(report_filename) {
  const query = `SELECT report_id FROM reports WHERE report_filename = $1`;
  const values = [report_filename];

  try {
    const res = await AWSClient.query(query, values);
    return res.rows.length > 0;
  } catch (err) {
    console.error("Error checking if report exists in PostgreSQL:", err);
    throw err;
  }
}

exports._SaveCollectingReports = async (req, res) => {
  try {
    const bucket = 'files.sustainabilitymonitor.org';
    const prefix = 'sustainability-reports/Firm_ID/';
  
      const files = await listFilesFromS3(bucket, prefix);
  
      for (const file of files) {
        console.log(`Stored report with ID: ${file}`);
        const reportInfo = await this._parseFileInfo(file);
        console.log(`Stored report with ID: ${reportInfo}`);
        if (reportInfo) {
          const exists = await reportExists(reportInfo.report_filename);
          console.log(exists)
          if (!exists) {
            console.log('-------file exists-------------', exists)
            const reportId = await this._storeReportInfo(reportInfo);
            console.log(`Stored report with ID: ${reportId}`);
          } else {
            console.log('-------file else-------------', exists)
            console.log(`Report already exists: ${reportInfo.report_filename}`);
          }
        }
        
      }
      __.res(res, 'Successfully reports save', 200)

  } catch (error) {
      __.res(res, error.message, 500)
  }
}
//------------------------------------------------------------------------------------
//Update Download Table

exports._updateDownloadTable=async (req, res) => {
  try {
    const bucket = 'internal.sustainabilitymonitor.org';
    const prefix = 'staging/';
  
      const files = await listFilesFromS3(bucket, prefix);
  
      for (const file of files) {
        console.log(`Stored report with ID: ${file}`);
      }

      __.res(res, 'Successfully Update Table', 200)

  } catch (error) {
      __.res(res, error.message, 500)
  }
}


