
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
