
// Automatically download reports

// Function to create an S3 client and list objects in a specified bucket and prefix
const listS3Objects = async (bucketName = 'internal.sustainabilitymonitor.org', prefix= 's3://internal.sustainabilitymonitor.org/staging/') => {
    // Initialize the S3 client
    console.log('----------------------------')
    const params = {
      Bucket: bucketName,
      Prefix: prefix
    };
  
    try {
      const data = await S3.listObjectsV2(params).promise();
      console.log(data)
      return data.Contents.map(object => object.Key);
    } catch (error) {
      console.error("Error fetching objects from S3:", error);
      throw error;
    }
  }

exports._startCollectingReports = async (req, res) => {
    try {
        console.log('call before')

        const result = await listS3Objects()

        console.log('call after', result)
        __.res(res, 'Successfully reports downloaded', 200)

    } catch (error) {
        __.res(res, error.message, 500)
    }
}


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
  const regex = /sustainability-reports\/Firm_ID\/(\d+)\/(.+?)_(.+?)_(.+?)_(\d{4})\.(.+)/;
  const match = filePath.match(regex);
  if (match) {
    return {
      company_id: match[1],
      company_alias: match[2],
      report_filename: match[0].split('/').pop(),
      s3_url_production: filePath,
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
          if (!exists) {
            console.log('-------file exists-------------', exists)
            const reportId = await storeReportInfo(reportInfo);
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


