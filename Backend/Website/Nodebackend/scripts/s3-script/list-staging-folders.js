// list-staging-folders.js

const AWS = require('aws-sdk');

// Optionally, set the AWS region. If not set, it will use the default region from the environment or instance metadata.
AWS.config.update({ region: 'us-east-1' }); // Replace with your bucket's region if necessary

// Create an S3 service object
const s3 = new AWS.S3();

// Specify the S3 bucket name
const bucketName = 'internal.sustainabilitymonitor.org';

/**
 * Function to list folders inside the 'staging/' folder of the specified S3 bucket.
 */
async function listFoldersInStaging() {
    // Parameters for S3 listObjectsV2
    const params = {
        Bucket: bucketName,
        Prefix: 'staging/',
        Delimiter: '/'
    };

    try {
        // List objects in the bucket with the specified prefix and delimiter
        const data = await s3.listObjectsV2(params).promise();

        // Check if CommonPrefixes exists and has entries
        if (data.CommonPrefixes && data.CommonPrefixes.length > 0) {
            console.log(`Folders in 'staging/' folder of bucket '${bucketName}':`);
            data.CommonPrefixes.forEach(prefix => {
                // Each CommonPrefix represents a "folder"
                // prefix.Prefix is the folder path, ending with '/'
                console.log(`- ${prefix.Prefix}`);
            });
        } else {
            console.log(`No folders found in 'staging/' folder of bucket '${bucketName}'.`);
        }
    } catch (error) {
        console.error('Error listing folders in staging:', error);
    }
}

// Execute the function
listFoldersInStaging();
