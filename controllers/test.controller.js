const { Test } = require('../models/Test')
const { TestValue } = require('../models/TestValue')
const axios = require('axios')

const { sign, verify } = require("jsonwebtoken")

const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '270040489280-ljn99nm3ve4m8su2t77dras268tp2fiu.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";

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

    saveTestDataToDB: async (req, res) => {
        try {

            // get user id 
            const accessToken = req.cookies['access-token']
            const sessionToken = req.cookies['session-token']
            
            if (accessToken) {
                  
            var user = verify(accessToken, process.env.JWT_SECRET)

            } else {
                var ticket = await client.verifyIdToken({
                    idToken: sessionToken,
                    audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
                })
            }
         
            if (user) {
                req.user = user
                var userID = req.user.id
               
            } else {
                const payload = ticket.getPayload();
                var userid = payload['sub']
               
            }   
            
            // get user choice value

            const { id, answer } = req.body

            const questionID = await TestValue.findOne({currentQuestionID: id})

            if(!questionID) {
                const value = new TestValue({
                    value: answer, 
                    currentUserID: userID || userid,
                    currentQuestionID: id
                })
    
                // console.log(value)
                await value.save()

            } else {
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("CRS-Capstone-Project-LocalDB");
                    var myquery = { currentQuestionID: id };
                    var newvalues = { $set: {value: answer} };
                    dbo.collection("testvalues").updateOne(myquery, newvalues, function(err, res) {
                      if (err) throw err;
                      console.log("1 document updated");
                      db.close();
                    });
                  });
            }
           
            res.redirect('/test')



            
       
            // const getValue = await TestValue.find({currentUserID: userID || userid })
            
            // // for(let i = 0; i < getValue.length; i++) {
                
            // // }
            // console.log(getValue)

        
          
            // return res.status(200).json({
            //     UserID: userID || userid,
            //     value: getValue,
            // })
        
    
            
            
            // res.json({msg: `questionid: ${id} - answer: ${answer}`})
        
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // add classification to test question model

    evaluate: async (req, res) => {
        try {
            const { id, answer } = req.body
            const accessToken = req.cookies['access-token']
            const sessionToken = req.cookies['session-token']
            
            if (accessToken) {
                  
            var user = verify(accessToken, process.env.JWT_SECRET)

            } else {
                var ticket = await client.verifyIdToken({
                    idToken: sessionToken,
                    audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
                })
            }
         
            if (user) {
                req.user = user
                var userID = req.user.id
               
            } else {
                const payload = ticket.getPayload();
                var userid = payload['sub']
               
            }   

            let arr = []


            const value = await TestValue.find({currentUserID: userID || userid, currentQuestion: id}, 'value -_id')


            value.forEach(function(data) {

                arr.push(data.value)
                
            })

            console.log(arr)


            return res.status(200).json({arrayValues: arr})
            // console.log(value)
            // for(let i = 0; i < value.length; i++) {
            //     arr.push(value)
            // }
            // // arr.push(value)

            // console.log(arr)

            // MongoClient.connect(url, function(err, db) {
            //     if (err) throw err;
            //     var dbo = db.db("CRS-Capstone-Project-LocalDB");
            //     var myquery = { currentQuestionID: id, currentUserID: userID || userid };
            //     dbo.collection("testvalues").find(myquery, function(err, res) {
            //       if (err) throw err;
            //       db.close();
            //     })

            
            //   });

              

            // const {currentuserid} = req.body;

            // const getValue = await TestValue.find({currentUserID: currentuserid || userid });

            // //    getValue. if format daan nga array of answers.. 

            // const resp = await axios.get("http://point to flusk nga endpoint or api")
            // // const { data } = await axios.get(
            // //     "http://localhost:5000/api/test/userchoices"

            // // )
            // // resp.ratings;
            // const ratings = [0.90,0.80,0.50];

            // let courses = [
            //     {name: "course1",description:"this course is para sa mga hilas og math..."},
            //     {name: "course2"},
            //     {name: "course3"},

            // ]
            // let i = 0;
            // foreach(let c in courses){
            //     c.rating = ratings[i];
            //     i ++;
            // }
            // return res.status(200).json(courses);

            // [{name:"course1",rating:0.90}....]

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }

    },
    getTestDataResult: async (req, res) => {
        try {
            const resp = await axios.get("http://localhost:5000/api/user/test-choice/value")
            // const { data } = await axios.get(
            //     "http://localhost:5000/api/test/userchoices"

            // )
            console.log(resp)

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = testCtrl


// Reference Code

// sendTestData: async (req, res) => {
//     try {

//         // get user id 
//         const accessToken = req.cookies['access-token']
//         const sessionToken = req.cookies['session-token']
        
//         if (accessToken) {
              
//         var user = verify(accessToken, process.env.JWT_SECRET)

//         } else {
//             var ticket = await client.verifyIdToken({
//                 idToken: sessionToken,
//                 audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
//             })
//         }
     
//         if (user) {
//             req.user = user
//             var userID = req.user.id
           
//         } else {
//             const payload = ticket.getPayload();
//             var userid = payload['sub']
           
//         }   
        
//         // get user choice value

//         const { id, answer } = req.body
       
//         const value = new TestValue({
//             value: answer, 
//             currentUserID: userID || userid
//         })

//         // console.log(value)
//         await value.save()

        
   
//         const getValue = await TestValue.find({currentUserID: userID || userid })
        
//         // for(let i = 0; i < getValue.length; i++) {
            
//         // }
//         console.log(getValue)

    
      
//         return res.status(200).json({
//             UserID: userID || userid,
//             value: getValue,
//         })
    

        
        
//         // res.json({msg: `questionid: ${id} - answer: ${answer}`})
    
//     } catch (err) {
//         return res.status(500).json({msg: err.message})
//     }
// },

// // add classification to test question model

// evaluate(req, res) => {
//     const {currentuserid} = req.body;

//    const getValue = await TestValue.find({currentUserID: currentuserid || userid });

// //    getValue. if format daan nga array of answers.. 

// try {
//     const resp = await axios.get("http://point to flusk nga endpoint or api")
//     // const { data } = await axios.get(
//     //     "http://localhost:5000/api/test/userchoices"

//     // )
//     // resp.ratings;
//     const ratings = [0.90,0.80,0.50];

//     let courses = [
//         {name: "course1",description:"this course is para sa mga hilas og math..."},
//         {name: "course2"},
//         {name: "course3"},

//     ]
//     let i = 0;
//     foreach(let c in courses){
//         c.rating = ratings[i];
//         i ++;
//     }
//     return res.status(200).json(courses);

//     [{name:"course1",rating:0.90}....]

// } catch (err) {
//     return res.status(500).json({msg: err.message})
// }

// }