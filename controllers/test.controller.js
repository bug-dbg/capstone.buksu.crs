const { Test } = require('../models/Test')

const testCtrl = {
    getTestData: async (req, res) => {
        try {
            const test = await Test.find()

            res.json({
                status: 'Success',
                result: test.length,
                data: test
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = testCtrl