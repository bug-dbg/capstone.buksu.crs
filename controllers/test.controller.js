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

            res.status(200).json({
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
            if(req.cookies['access-token']) {
                var accessToken = req.cookies['access-token']
            } else {
                var sessionToken = req.cookies['session-token']
            }

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

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // add classification to test question model

    evaluate: async (req, res, next) => {
       
        try {
           
            const { id, answer } = req.body 

            let arr = []
    
    
            const value = await TestValue.find({currentQuestion: id}, 'value -_id')
    
            // loop through the value and push it into an array
            value.forEach(function(data) {
                arr.push(data.value) 
            })
    
            if(value) {
                // res.json({
                //     status: 'Success',
                //     length: arr.length,
                //     data: arr
                // }) 
                const { data } = await axios.post("http://localhost:3000/api/courses/recommend/", arr);

                // console.log(data);

                const ratings = data.prediction[0]

                console.log(ratings)
                
                
                let courses = [
                    {name: "Bachelor of Science in Biology Major in Biotechnology ", description: "BS Bio Description"},
                    {name: "Bachelor of Arts in English Language", description: "BA EL Description"},
                    {name: "Bachelor of Secondary Education Major in Social Studies", description: "BSE Social Studies Description"},
                    {name: "Bachelor of Arts in Economics", description: "BA Economics Description"},
                    {name: "Bachelor of Arts in Sociology", description: "BA Sociology Description"},
              
                ]
    
                // Map to courses Object 
    
                let i = 0;
                courses.forEach(function(c) {
                    c.ratings = ratings[i]
                    i++
                })
            
    
                // Sort the top three result of the recommendation
                const topThreeResult = courses.sort((a,b) => b.ratings - a.ratings).slice(0, 3)
                console.log(topThreeResult);
                
                return res.render('result_page/result', {prediction: topThreeResult});
            }
            
            else {
                return res.status(500).json({error: "ERROR"});
            }

          
            // res.redirect('/evaluation/result')
          
            
          
            // const { data } = await axios.get("http://localhost:3000/api/courses/recommend/",arr)
            
            // const ratings = data.prediction[0]

            // console.log(ratings)
            
            
            //  let courses = [
            //     {name: "Bachelor of Science in Biology Major in Biotechnology "},
            //     {name: "Bachelor of Arts in English Language"},
            //     {name: "Bachelor of Secondary Education Major in Social Studies"},
            //     {name: "Bachelor of Arts in Economics"},
            //     {name: "Bachelor of Arts in Sociology"},
          
            //  ]

            // // Map to courses in Object 
            // let i = 0;
            // courses.forEach(function(c) {
            //     c.ratings = ratings[i]
            //     i++
            // })
        

            // // Sort the top three result of the recommendation
            // const topThreeResult = courses.sort((a,b) => b.ratings - a.ratings).slice(0, 3)
            // console.log(topThreeResult)
     
            // // TODO: Fix Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

            return res.status(200).json({data});
   
            

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }

    },
    getTestDataResult: async (req, res) => {
        try {
            const { data } = await axios.get("http://localhost:3000/api/courses/recommend/")
            
            const ratings = data.prediction[0]

            console.log(ratings)
            
            
            let courses = [
                {name: "Bachelor of Science in Biology Major in Biotechnology ", description: "BS Bio Description"},
                {name: "Bachelor of Arts in English Language", description: "BA EL Description"},
                {name: "Bachelor of Secondary Education Major in Social Studies", description: "BSE Social Studies Description"},
                {name: "Bachelor of Arts in Economics", description: "BA Economics Description"},
                {name: "Bachelor of Arts in Sociology", description: "BA Sociology Description"},
          
            ]

            // Map to courses Object 

            let i = 0;
            courses.forEach(function(c) {
                c.ratings = ratings[i]
                i++
            })
        

            // Sort the top three result of the recommendation
            const topThreeResult = courses.sort((a,b) => b.ratings - a.ratings).slice(0, 3)
            console.log(topThreeResult)
    

            return res.status(200).json({prediction: topThreeResult});

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