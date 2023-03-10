const { Reports } = require('../models/Report')
const { Users } = require('../models/User')
const axios = require('axios')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Admin:pYg96SY5pQrNUpIo@cluster0.urjcmww.mongodb.net/?retryWrites=true&w=majority";

var ObjectID = require('mongodb').ObjectId;




const reportCtrl = {
    numOfUsers: async (req, res)  => {
        try {
            
            
          
            const allReports = await Reports.find()
       
            var o_id = new ObjectID("63de063a1e8e7041b46c0b85");

            const  data  = await Users.find({
                role: 0
            })

            // console.log(data)
            console.log(allReports)

            // const value = new Reports({
            //     numberOfUsers: data.length
            // })

            // await value.save()

            if(!allReports) {
                const value = new Reports({
                    numberOfUsers: data.length
                })
    
                await value.save()
            } else {
                const client = new MongoClient(url, { useNewUrlParser: true });
                client.connect(err => {
                  const collection = client.db("test").collection("reports");
                  collection.updateOne({ _id: o_id }, { $set: { numberOfUsers: data.length} }, function(err, res) {
                    console.log("Document updated");
                    client.close();
                  });
                });
                
            }
            

        
        

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = reportCtrl