const { Reports } = require('../models/Report')
const { Users } = require('../models/User')
const axios = require('axios')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Admin:pYg96SY5pQrNUpIo@cluster0.urjcmww.mongodb.net/?retryWrites=true&w=majority";



const reportCtrl = {
    numOfUsers: async (req, res)  => {
        try {
         
            const { data } = await axios.get("http://localhost:5000/all-users");

            console.log(data.length)

            const value = new Reports({
                numberOfUsers: data.length
            })
            await value.save()

        
        
            


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = reportCtrl