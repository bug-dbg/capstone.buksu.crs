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
    
            const {id,answer} = req.body

            let arr = []

            if(answer != null) {
                arr.push(answer)
                
            }

            // // for (i = 0; i < 10; i++) {
                
            // //     arr.push(answer);
            // // }

            // arr.forEach(element => {
            //     element.push(answer)
                
            // });
              
        
            console.log(arr)
            console.log(arr.length)
            
        
            
            return res.json({msg: `questionid: ${id} - answer: ${answer}`})
        
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