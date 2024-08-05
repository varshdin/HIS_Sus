// const AWS = require('aws-sdk');
// const { Client } = require('pg');

// // Configure AWS SDK for S3
// AWS.config.update({
//   accessKeyId: 'your-access-key-id', // Replace with your AWS access key ID
//   secretAccessKey: 'your-secret-access-key', // Replace with your AWS secret access key
//   region: 'your-region' // Replace with your AWS region
// });

// const s3 = new AWS.S3();

// // Configure PostgreSQL client
// const client = new Client({
//     user: 'fuas',
//     host: 'sustainability.cvnuvcym0gmh.eu-central-1.rds.amazonaws.com',
//     //database: 'germansustainability',
//     database:'Sustainability',
//     password: 'fuas2022!',
//     port: 5432,
//   });


  
// async function listFilesFromS3(bucket, prefix) {
//   const params = {
//     Bucket: bucket,
//     Prefix: prefix
//   };

//   try {
//     const data = await s3.listObjectsV2(params).promise();
//     return data.Contents.map(file => file.Key);
//   } catch (err) {
//     console.error("Error fetching files from S3:", err);
//     throw err;
//   }
// }

// function parseFileInfo(filePath) {
//   const regex = /sustainability-reports\/(.+?)\/(.+?)\/(.+?)\/(.+?)_(.+?)_(.+?)_(\d{4})\.(.+)/;
//   const match = filePath.match(regex);

//   if (match) {
//     return {
//       company_id: match[2],
//       company_alias: match[4],
//       report_filename: match[0].split('/').pop(),
//       s3_url_production: `s3://${filePath}`,
//       report_extension: match[8],
//       report_type: match[5],
//       report_language: match[6],
//       report_year: match[7]
//     };
//   } else {
//     throw new Error("File path does not match expected format");
//   }
// }

// async function storeReportInfo(reportInfo) {
//   const query = `
//     INSERT INTO reports (company_id, company_alias, report_filename, s3_url_production, report_extension, report_type, report_language, report_year)
//     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//     RETURNING report_id
//   `;

//   const values = [
//     reportInfo.company_id,
//     reportInfo.company_alias,
//     reportInfo.report_filename,
//     reportInfo.s3_url_production,
//     reportInfo.report_extension,
//     reportInfo.report_type,
//     reportInfo.report_language,
//     reportInfo.report_year
//   ];

//   try {
//     const res = await client.query(query, values);
//     return res.rows[0].report_id;
//   } catch (err) {
//     console.error("Error inserting report info into PostgreSQL:", err);
//     throw err;
//   }
// }

// async function main() {
//   const bucket = 'files.sustainabilitymonitor.org';
//   const prefix = 'sustainability-reports/Firm_ID/';

//   try {
//     await client.connect();
//     const files = await listFilesFromS3(bucket, prefix);

//     for (const file of files) {
//       const reportInfo = parseFileInfo(file);
//       const reportId = await storeReportInfo(reportInfo);
//       console.log(`Stored report with ID: ${reportId}`);
//     }
//   } catch (err) {
//     console.error("Error processing reports:", err);
//   } finally {
//     await client.end();
//   }
// }

// main();


const { Client } = require('pg');

// Sample S3 URLs
const sampleUrls = [
  's3://files.sustainabilitymonitor.org/sustainability-reports/Firm_ID/1/AaasrealBank_IR_EN_2016.pdf',
  's3://files.sustainabilitymonitor.org/sustainability-reports/Firm_ID/1/AareasalBank_IR_EN_2017.pdf',
  's3://files.sustainabilitymonitor.org/sustainability-reports/Firm_ID/1/AarasdealBank_IR_EN_2018.pdf'
];

// Configure PostgreSQL client
const client = new Client({
      user: 'fuas',
      host: 'sustainability.cvnuvcym0gmh.eu-central-1.rds.amazonaws.com',
      //database: 'germansustainability',
      database:'Sustainability',
      password: 'fuas2022!',
      port: 5432,
  });
  
  function parseFileInfo(filePath) {
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
      throw new Error("File path does not match expected format");
    }
  }
  
  async function reportExists(report_filename) {
    const query = `SELECT report_id FROM reports WHERE report_filename = $1`;
    const values = [report_filename];
  
    try {
      const res = await client.query(query, values);
      return res.rows.length > 0;
    } catch (err) {
      console.error("Error checking if report exists in PostgreSQL:", err);
      throw err;
    }
  }
  
  async function storeReportInfo(reportInfo) {
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
    console.log(values)
    try {
      const res = await client.query(query, values);
      return res.rows[0].report_id;
    } catch (err) {
      console.error("Error inserting report info into PostgreSQL:", err);
      throw err;
    }
  }
  
  async function main() {
    try {
      await client.connect();
  
      for (const url of sampleUrls) {
        const reportInfo = parseFileInfo(url);
        console.log('-------reportInfo.report_filename-------------', reportInfo.report_filename)
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
    } catch (err) {
      console.error("Error processing reports:", err);
    } finally {
      await client.end();
    }
  }
  
  main();