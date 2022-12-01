const { Test } = require('../models/Test')
const { TestValue } = require('../models/TestValue')
const axios = require('axios')

const { sign, verify } = require("jsonwebtoken")
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '270040489280-ljn99nm3ve4m8su2t77dras268tp2fiu.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Admin:pYg96SY5pQrNUpIo@cluster0.urjcmww.mongodb.net/?retryWrites=true&w=majority";

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
                    var dbo = db.db("test");
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
                
                
                // let courses = [
                //     {name: "Bachelor of Science in Biology Major in Biotechnology ", description: "BS Bio Description"},
                //     {name: "Bachelor of Arts in English Language", description: "BA EL Description"},
                //     {name: "Bachelor of Secondary Education Major in Social Studies", description: "BSE Social Studies Description"},
                //     {name: "Bachelor of Arts in Economics", description: "BA Economics Description"},
                //     {name: "Bachelor of Arts in Sociology", description: "BA Sociology Description"},
              
                // ]

                let courses = [
                    {name: "Bachelor of Science in Biology Major in Biotechnology", description: ""},
                    {name: "Bachelor of Science in Environmental Science Major in Environmental Heritage Studies", description: ""},
                    {name: "Bachelor of Arts in English Language", description: ""},
                    {name: "Bachelor of Arts in Economics", description: ""},
                    {name: "Bachelor of Arts in Sociology", description: ""},
                    {name: "Bachelor of Arts in Philosophy", description: ""},
                    {name: "Bachelor of Arts in Social Sciences", description: ""},
                    {name: "Bachelor of Science in Mathematics", description: ""},
                    {name: "Bachelor of Science in Community Development", description: "Community Development intends to produce/develop individuals to be competent development practitioners. The course will provide opportunity for the students to be equipped with skills in community organizing, planning, training and development, social mobilization and action research. Moreover, the course will develop capabilities of the students to accelerate their achievement in their respective goals through quality instruction, research, extension and production."},
                    {name: "Bachelor of Science in Development Communication", description: "Bachelor of Science in Development Communication is a four-year course that prepares the students to acquire competencies in three major areas– Community Broadcasting, Development Journalism, and Educational Communication. The program prepares the students to become professionals in the field of development communication whose key purpose is to use participatory and mediated communication to facilitate society’s planned transformation (particularly of rural communities) from a state of poverty to one of a dynamic socio-economic growth characterized by equity, sustainability, agency, and active citizenship in social, political, and economic spheres."},
                    {name: "Bachelor of Public Administration Major in Local Governance", description: ""},
                    {name: "Bachelor of Science in Nursing", description: ""},
                    {name: "Bachelor of Science in Accountancy", description: "The Accountancy program is designed to produce graduates who are professionally competent to assume responsible practice of Public Accounting and to render accounting, management, auditing, and tax advisory services. It also aims to prepare graduate to assume key positions in the accounting and administrative departments of private and public firms, and finally to equip the graduates with the latest knowledge and techniques in accounting to keep abreast with the needs of business and industry."},
                    {name: "Bachelor of Science in Business Administration Major in Financial Management", description: "The Business Administration program covers the integrated approach and interrelationship among the functional areas of businesses as well as sensitivity to the social, economic, technological, legal and international environment in which business must operate. The objective of the program is not simply to impart basic business knowledge, but to instill and nurture important qualities and skills in students that are essential for future business leadership and organizational success."},
                    {name: "Bachelor of Science in Hospitality Management", description: "The BS HRM program was designed to be industry based, well- structured and flexible, in order to match industry needs of the different sectors in the Hospitality Industry and to make qualifications relevant and useful to both students and industry. Its primary concentration is in the development of practical and management skills which are achieved through the combination of theoretical classes, experiential learning, and on-the-job-training both local and international."},
                    {name: "Bachelor of Science in Automotive Technology", description: "The Bachelor of Science in Automotive Technology program is a four year degree course that offer opportunities for student to learn and apply the scientific knowledge and methods in modern technology to support automotive technology activities in the field of industrial technology. Students are focused on classroom instruction and hands-on laboratory exerciser. Moreover, the program prepares the students to become professionals, and be qualified for positions in the field of automotive technology such as engine overhauling technician, service technician, technical staff, automotive parts man and automotive service manager."},
                    {name: "Bachelor of Science in Electronics Technology", description: "The Bachelor of Science in Electronics Technology program offers opportunities for student to learn and apply the scientific knowledge and methods in modern technology to support electronics technology activities in the field of industrial technology. Students are provided a focus on classroom instruction and hands-on laboratory design and testing experiences. Moreover, the program prepares the students to become professionals, and be qualified for application positions in the field of electronics technology such as electronic systems analysis and design, technical sales and service, and engineering operations and maintenance."},
                    {name: "Bachelor of Science in Food Technology", description: "Bachelor of Science in Food Technology is a four-year degree program design to develop professionals in food technology. The program focuses on a mix of pure and applied science, engineering, business and entrepreneurial skills. It aims to produce professionals who have the capacity to apply the science and technology and related fields of study in post-harvest handling, preparation, processing, packaging, storage, distribution and marketing of food to ensure food and nutrition security, quality, environmental sustainability and the well-being of individuals, families and communities. The program also aims to promote continued excellence in food science education."},
                    {name: "Bachelor of Science in Information Technology", description: "The BS Information Technology program includes the study of the utilization of both hardware and software technologies involving planning, installing, customizing, operating, managing and administering, and maintaining information technology infrastructure that provides computing solutions to address the needs of an organization."},
                    {name: "Bachelor of Science in Entertainment and Multimedia Computing major in Digital Animation Technology Game Development", description: "The Bachelor of Science in Entertainment and Multimedia Computing Major in Digital Animation Technology is the study and application of fundamental and advanced theories and advanced techniques in 2D and 3D animation, use and development for advancement of animation technologies, and production of commercially acceptable content and viable solutions for different platforms such as broadcast, web and mobile cast."},
                    {name: "Bachelor of Elementary Education", description: ""},
                    {name: "Bachelor of Secondary Education Major in Mathematics", description: ""},
                    {name: "Bachelor of Secondary Education Major in Filipino", description: ""},
                    {name: "Bachelor of Secondary Education Major in English", description: ""},
                    {name: "Bachelor of Secondary Education Major in Social Studies", description: ""},
                    {name: "Bachelor of Secondary Education Major in Science", description: ""},
                    {name: "Bachelor of Early Childhood Education", description: ""},
                    {name: "Bachelor of Physical Education", description: ""},
                    {name: "Bachelor of Law (Juris Doctor)", description: ""},
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