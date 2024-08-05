
// Automatically download reports

exports._startCollectingReports = async (req, res) => {
    try {

        // var reports = await getReports();

        __.res(res, 'Successfully reports downloaded', 200)

    } catch (error) {
        __.res(res, error.message, 500)
    }
}
