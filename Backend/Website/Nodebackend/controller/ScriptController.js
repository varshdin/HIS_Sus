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
    const bucket = S3_BUCKET_NAME;
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
    const bucket = S3_BUCKET_NAME;
    const prefix = 'staging/';
  
    const s3Urls = await listFilesFromS3(bucket, prefix);
    for (let s3Url of s3Urls) {
      // Remove "staging/" and split the path
      const pathParts = s3Url.replace("staging/", "").split('/');
    
      if(pathParts == '') {
        continue;
      }
      
      // Extract company alias (which is the first part of the path)
      const companyAlias = pathParts[0];
    
      // Extract the filename and other details from the last part of the path
      const filename = pathParts[pathParts.length - 1];
      
      // Extract the file extension
      const fileExtension = filename.split('.').pop();
      
      // Extract the year from the filename (if available)
      const yearMatch = filename.match(/_(\d{4})_/);
      const year = yearMatch ? parseInt(yearMatch[1]) : null;
    
      // Check if the file already exists in the download table
      const checkQuery = `
        SELECT 1 FROM download WHERE download_filename = $1
      `;
      const checkValues = [filename];
      
      const res = await AWSClient.query(checkQuery, checkValues);
      
      if (res.rows.length > 0) {
        console.log(`File already exists: ${filename}, skipping insert.`);
        continue;
      }
    
      // Prepare the SQL query for insertion
      const insertQuery = `
        INSERT INTO download (company_id, company_alias, download_filename, download_extension, download_year, download_url, s3_url_staging)
        VALUES (
          (SELECT company_id FROM companies WHERE company_name = $1),
          $1, $2, $3, $4,
          (SELECT sustainability_url FROM companies WHERE company_name = $1),
          $5
        )
      `;
    
      const values = [companyAlias, filename, fileExtension, year, 'https://s3.eu-central-1.amazonaws.com/files.sustainabilitymonitor.org/'+s3Url];
      // Execute the query to insert the data
      await AWSClient.query(insertQuery, values);
    }
    
    console.log("Data processing completed successfully!");

      __.res(res, 'Successfully Update Table', 200)

  } catch (error) {
      __.res(res, error.message, 500)
  }
}


