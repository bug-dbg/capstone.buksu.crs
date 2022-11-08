const { Test } = require('../models/Test')
const axios = require('axios')

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
    },

    sendTestData: async (req, res) => {
        try {
    
            const value = req.body.answer
            console.log("Data: " + value)
           
        
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getTestDataResult: async (req, res) => {
        try {
            const res = await axios.get('http://localhost:5000/api/user/test-choice/value')
            // const { data } = await axios.get(
            //     "http://localhost:5000/api/test/userchoices"
            // )
            res.status(200).json({
                data: res.data
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = testCtrl