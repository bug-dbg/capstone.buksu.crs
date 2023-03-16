const { Test } = require('../models/Test')
const { TestValue } = require('../models/TestValue')
const axios = require('axios')

const { sign, verify } = require("jsonwebtoken")
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '270040489280-ljn99nm3ve4m8su2t77dras268tp2fiu.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

var { MongoClient } = require('mongodb');
var url = "mongodb+srv://Admin:pYg96SY5pQrNUpIo@cluster0.urjcmww.mongodb.net/?retryWrites=true&w=majority";
const { Reports } = require('../models/Report')

const productionUrl = 'https://ai.buksu-crs.systems'

const currentUrl = process.env.NODE_ENV === 'production' ? productionUrl : 'http://localhost:3000'


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
            return res.status(500).json({ msg: err.message })
        }
    },

    saveTestDataToDB: async (req, res) => {
        try {

            // get user id 
            if (req.cookies['access-token']) {
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

            const questionID = await TestValue.findOne({ currentQuestionID: id })

            if (!questionID) {
                const value = new TestValue({
                    value: answer,
                    currentUserID: userID || userid,
                    currentQuestionID: id
                })

                // console.log(value)
                await value.save()

            } else {
                // MongoClient.connect(url, function (err, db) {
                //     if (err) throw err;
                //     var dbo = db.db("tests");
                //     var myquery = { currentQuestionID: id };
                //     var newvalues = { $set: { value: answer } };
                //     dbo.collection("testvalues").updateOne(myquery, newvalues, function (err, res) {
                //         if (err) throw err;
                //         console.log("1 document updated");
                //         db.close();
                //     });
                // });

                MongoClient.connect(url, { useUnifiedTopology: true })
                    .then(client => {
                        const db = client.db('test');
                        const collection = db.collection('testvalues');
                        const options = { upsert: true };
                        const filter = { currentQuestionID: id, currentUserID: userID};
                        const update = { $set: { value: answer } };

                        return collection.updateOne(filter, update, options);
                    })
                    .then(result => {
                        console.log(`${result.modifiedCount} document updated`);
                    })
                    .catch(error => console.error(error));

              

                // try {
                //     await client.connect();
                //     const db = client.db('test');
                //     const collection = db.collection('testvalues');
                //     const filter = { currentQuestionID: id, currentUserID: userID };
                //     const update = { $set: { value: answer } };
                //     const options = { upsert: true };
                //     const result = await collection.updateOne(filter, update, options);
                //     console.log(`${result.modifiedCount} document updated`);
                //   } catch (error) {
                //     console.error(error);
                //   } finally {
                //     await client.close();
                //   }

                
                // const client = new MongoClient(url);
                // try {
                //     const database = client.db("test");
                //     const collection = database.collection("testvalues");
                //     // create a filter for a movie to update
                //     const filter = { currentQuestionID: id, currentUserID: userID };
                //     // this option instructs the method to create a document if no documents match the filter
                //     const options = { upsert: true };
                //     // create a document that sets the plot of the movie
                //     const updateDoc = {
                //       $set: {
                //         value: answer
                //       },
                //     };
                //     const result = await collection.updateOne(filter, updateDoc, options);
                //     console.log(
                //       `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
                //     );
                //   } finally {
                //     await client.close();
                //   }
            }
            res.redirect('/test')

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    // add classification to test question model

    evaluate: async (req, res, next) => {

        try {

              // get user id 
              if (req.cookies['access-token']) {
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

            const { id, answer } = req.body

            let arr = []


            const value = await TestValue.find({ 
                    currentQuestion: id, 
                    currentUserID: userID }, 
                    'value -_id'
                )

            // loop through the value and push it into an array
            value.forEach(function (data) {
                arr.push(data.value)
            })

            if (value) {
                // res.json({
                //     status: 'Success',
                //     length: arr.length,
                //     data: arr
                // }) 
                console.log("node array=" + arr)
                const { data } = await axios.post(`${currentUrl + "/api/courses/recommend/"}`, arr);

                

                const ratings = data.prediction[0]

                console.log(ratings)

                let courses = [
                    { name: "Bachelor of Science in Biology Major in Biotechnology", description: "The BS Biology major in Biotechnology program is designed to equip students for careers in bioprocess engineering, molecular biology, plant biotechnology, and medical research. Biotechnology involves the use of biological organisms to develop new products and technologies. The majority of biotechnology majors focus on medicine, agriculture, energy, or the environment." },
                    { name: "Bachelor of Science in Environmental Science Major in Environmental Heritage Studies", description: "Bachelor of Science in Environmental Science Major in Environmental Heritage Studies is a four-year program that studies ecological principles and phenomena, natural resource management, and human population growth. It teaches students about science based theories and techniques required to monitor and interact with the environment. This course also provides the technical foundation required to comprehend the biological, chemical, and physical aspects of the environment." },
                    { name: "Bachelor of Arts in English Language", description: "The Bachelor of Arts in English Language Studies focuses on the theoretical aspects of the English language as well as its practical applications. It prepares students for effective English communication in a variety of contexts and situations. It also aims to provide possibilities for applied competencies acquired for job roles by offering competitive global English education. The program provides students with the information and skills needed to meet the challenges of modern English language teaching." },
                    { name: "Bachelor of Arts in Economics", description: "This program is designed to study many real-world issues such as global trade, poverty, taxes, crime, and education, as well as how society generates and consumes goods. The Bachelor of Arts in Economics is ideal for students who want to concentrate on the qualitative aspects of economics. To prepare you for work in domestic or foreign organizations, the program places a greater emphasis on social conduct, culture, foreign diplomacy, and linguistics." },
                    { name: "Bachelor of Arts in Sociology", description: "The Bachelor of Arts in Sociology program will teach you about social groups, social system, and social reform. Sociology examines the causes and strategies to many of today's most difficult societal issues. The curriculum aimed to demonstrate the nature of human life as well as the impact of various types of social structure in our society." },
                    { name: "Bachelor of Arts in Philosophy", description: "The course of study is aimed to provide students with a critical foundation in logic and argumentation, as well as an in-depth introduction and discussion to some of the most significant philosophical themes and customs from antiquity to the present. Employers are increasingly looking for Philosophy graduates who can think on the spot, identify key challenges, come up with solutions, and interact with their colleagues." },
                    { name: "Bachelor of Arts in Social Sciences", description: "The Bachelor of Arts in Social Science Studies program includes courses in political science, psychological studies, cultural studies, anthropology, and sociology. Individuals can choose from a wide range of core and specialty in this course. Social Science covers mostly the concerns about the the human world and society; it seeks to explore the economic system, social behavior, societal norms, and politics." },
                    { name: "Bachelor of Science in Mathematics", description: "A Bachelor's degree in Mathematics is a bachelor's degree that teaches theory and training in practical and core mathematics. BS in Mathematics provides a broad understanding of mathematical topics with depth in specific areas, as well as research into the outcomes of analytical, qualitative and logical reasoning. Mathematics is an incredibly diverse degree that can provide with numerous opportunities." },
                    { name: "Bachelor of Science in Community Development", description: "Community Development intends to produce/develop individuals to be competent development practitioners. The course will provide opportunity for the students to be equipped with skills in community organizing, planning, training and development, social mobilization and action research. Moreover, the course will develop capabilities of the students to accelerate their achievement in their respective goals through quality instruction, research, extension and production." },
                    { name: "Bachelor of Science in Development Communication", description: "Bachelor of Science in Development Communication is a four-year course that prepares the students to acquire competencies in three major areas– Community Broadcasting, Development Journalism, and Educational Communication. The program prepares the students to become professionals in the field of development communication whose key purpose is to use participatory and mediated communication to facilitate society’s planned transformation (particularly of rural communities) from a state of poverty to one of a dynamic socio-economic growth characterized by equity, sustainability, agency, and active citizenship in social, political, and economic spheres." },
                    { name: "Bachelor of Public Administration Major in Local Governance", description: "Bachelor of Public Administration Major in Local Governance is designed to give students practical and theoretical understanding skills in public management, policy making, and labor rights. It teaches students the foundations of effective governance and policy studies. Its goal is to teach students how to plan, enforce, supervise people, and create strategic planning for government and civil organizations." },
                    { name: "Bachelor of Science in Nursing", description: "Bachelor of Science in Nursing is a four-year degree program that teaches students the skills and knowledge required in health care It is divided into four parts: health promotion, disease prevention, risk reduction, and health restoration. The program's goal is to prepare nursing students to provide holistic care to people of all ages, genders, and health statuses. Nursing science, extensive research, leadership studies, and other areas that involves nursing process are covered in this course. It also provides a general education in math, social sciences, and humanities." },
                    { name: "Bachelor of Science in Accountancy", description: "The Accountancy program is designed to produce graduates who are professionally competent to assume responsible practice of Public Accounting and to render accounting, management, auditing, and tax advisory services. It also aims to prepare graduate to assume key positions in the accounting and administrative departments of private and public firms, and finally to equip the graduates with the latest knowledge and techniques in accounting to keep abreast with the needs of business and industry." },
                    { name: "Bachelor of Science in Business Administration Major in Financial Management", description: "The Business Administration program covers the integrated approach and interrelationship among the functional areas of businesses as well as sensitivity to the social, economic, technological, legal and international environment in which business must operate. The objective of the program is not simply to impart basic business knowledge, but to instill and nurture important qualities and skills in students that are essential for future business leadership and organizational success." },
                    { name: "Bachelor of Science in Hospitality Management", description: "The BS HRM program was designed to be industry based, well- structured and flexible, in order to match industry needs of the different sectors in the Hospitality Industry and to make qualifications relevant and useful to both students and industry. Its primary concentration is in the development of practical and management skills which are achieved through the combination of theoretical classes, experiential learning, and on-the-job-training both local and international." },
                    { name: "Bachelor of Science in Automotive Technology", description: "The Bachelor of Science in Automotive Technology program is a four year degree course that offer opportunities for student to learn and apply the scientific knowledge and methods in modern technology to support automotive technology activities in the field of industrial technology. Students are focused on classroom instruction and hands-on laboratory exerciser. Moreover, the program prepares the students to become professionals, and be qualified for positions in the field of automotive technology such as engine overhauling technician, service technician, technical staff, automotive parts man and automotive service manager." },
                    { name: "Bachelor of Science in Electronics Technology", description: "The Bachelor of Science in Electronics Technology program offers opportunities for student to learn and apply the scientific knowledge and methods in modern technology to support electronics technology activities in the field of industrial technology. Students are provided a focus on classroom instruction and hands-on laboratory design and testing experiences. Moreover, the program prepares the students to become professionals, and be qualified for application positions in the field of electronics technology such as electronic systems analysis and design, technical sales and service, and engineering operations and maintenance." },
                    { name: "Bachelor of Science in Food Technology", description: "Bachelor of Science in Food Technology is a four-year degree program design to develop professionals in food technology. The program focuses on a mix of pure and applied science, engineering, business and entrepreneurial skills. It aims to produce professionals who have the capacity to apply the science and technology and related fields of study in post-harvest handling, preparation, processing, packaging, storage, distribution and marketing of food to ensure food and nutrition security, quality, environmental sustainability and the well-being of individuals, families and communities. The program also aims to promote continued excellence in food science education." },
                    { name: "Bachelor of Science in Information Technology", description: "The BS Information Technology program includes the study of the utilization of both hardware and software technologies involving planning, installing, customizing, operating, managing and administering, and maintaining information technology infrastructure that provides computing solutions to address the needs of an organization." },
                    { name: "Bachelor of Science in Entertainment and Multimedia Computing major in Digital Animation Technology Game Development", description: "The Bachelor of Science in Entertainment and Multimedia Computing Major in Digital Animation Technology is the study and application of fundamental and advanced theories and advanced techniques in 2D and 3D animation, use and development for advancement of animation technologies, and production of commercially acceptable content and viable solutions for different platforms such as broadcast, web and mobile cast." },
                    { name: "Bachelor of Elementary Education", description: "Bachelor of Elementary Education is a degree program designed to prepare people who want to teach at the elementary level. Its goal is to train highly competent and qualified teachers who specialize in elementary education curriculum." },
                    { name: "Bachelor of Secondary Education Major in Mathematics", description: "The program aims to train effective Math teachers at both the elementary and secondary levels. This course examines the relationships between numbers, logical structures, and patterns. Students who pursue the BSEd major in Mathematics and wish to work as licensed teachers at both the primary and secondary levels must complete additional education course units in order to sit for the Licensure Examination." },
                    { name: "Bachelor of Secondary Education Major in Filipino", description: "Bachelor of Secondary Education Major in Filipino is designed to provide students with the knowledge and skills needed to become efficient educators of the Filipino language. This course aims to apply current principles and strategies for teaching Filipino as a first language. It also prepares students to create lessons that meet the diverse needs of bilingual speakers transitioning to the people's first language at various levels." },
                    { name: "Bachelor of Secondary Education Major in English", description: "Bachelor of Secondary Education Major in English is intended to provide learners with the necessary and relevant skills to teach English at the secondary level. Its goal is to train highly qualified and competent English teachers who specialize in secondary pedagogies." },
                    { name: "Bachelor of Secondary Education Major in Social Studies", description: "" },
                    { name: "Bachelor of Secondary Education Major in Science", description: "Bachelor of Secondary Education Major in Science aims to teach highly skilled and competent students who specializes in science content and pedagogy in primary and secondary schools" },
                    { name: "Bachelor of Early Childhood Education", description: "Bachelor of Early Childhood Education is a four-year program that teaches students in both the art and the science of teaching children aged 0 to 8. It lays a strong foundation for effective early childhood education and care based on practices that are appropriate. This course also refers to formal and informal educational studies that guide children's development and growth throughout their preschool period." },
                    { name: "Bachelor of Physical Education", description: "This course draws on knowledge various from allied fields such as sports and exercise sciences, life sciences, behavioral sciences, and employs multidisciplinary guidance to influence and develop all aspects of the learners' lives. It will prepare and train qualified and competent students to teach Physical Education, recreational activities, and sports at the elementary, secondary, and tertiary levels, as well as to become sports, dance, leisure, and fitness experts." },
                ]

                // Map to courses Object 

                let i = 0;
                courses.forEach(function (c) {
                    c.ratings = ratings[i]
                    i++
                })


                // Sort the top three result of the recommendation
                const topThreeResult = courses.sort((a, b) => b.ratings - a.ratings).slice(0, 3)
                console.log(topThreeResult);

                // add the top three result to the database for reports

                // try{
                //     const filter = { _id: '63de063a1e8e7041b46c0b85' };
                //     const update = { numberOfUsers: await Users.countDocuments() };
                //     const options = { upsert: true, new: true, setDefaultsOnInsert: true };
                //     let report = await Reports.findOneAndUpdate(filter, update, options);

                //     if (!report) { // report was not found, create a new one
                //         const userCount = await Users.countDocuments();
                //         report = new Reports({
                //             numberOfUsers: userCount > 0 ? userCount : 1,
                //         });
                //         await report.save();

                //         console.log("Successfully created a new report document")
                //     }     

                // } catch(err) {
                //     console.log("msg:" + err.message)
                // }

                // const courseName = [
                //     'Bachelor of Science in Biology Major in Biotechnology','Bachelor of Science in Environmental Science Major in Environmental Heritage Studies', 'Bachelor of Arts in English Language', 'Bachelor of Arts in Economics', 'Bachelor of Arts in Sociology', 'Bachelor of Arts in Philosophy', 'Bachelor of Arts in Social Sciences', 'Bachelor of Science in Mathematics', 'Bachelor of Science in Community Development', 'Bachelor of Science in Development Communication', 'Bachelor of Public Administration Major in Local Governance', 'Bachelor of Science in Nursing', 'Bachelor of Science in Accountancy', 'Bachelor of Science in Business Administration Major in Financial Management', 'Bachelor of Science in Hospitality Management', 'Bachelor of Science in Automotive Technology', 'Bachelor of Science in Electronics Technology', 'Bachelor of Science in Food Technology', 'Bachelor of Science in Information Technology', 'Bachelor of Science in Entertainment and Multimedia Computing major in Digital Animation Technology Game Development', 'Bachelor of Elementary Education', 'Bachelor of Secondary Education Major in Mathematics', 'Bachelor of Secondary Education Major in Filipino', 'Bachelor of Secondary Education Major in English', 'Bachelor of Secondary Education Major in Social Studies', 'Bachelor of Secondary Education Major in Science', 'Bachelor of Early Childhood Education', 'Bachelor of Physical Education']; 
                // const filter = { _id: '63de063a1e8e7041b46c0b85' }; // replace with actual report ID
                // const update = { $inc: { [`coursePredictions.${courseName}`]: 1 } };
                // const options = { upsert: true, new: true, setDefaultsOnInsert: true };

                // try {
                //     let report = await Reports.findOneAndUpdate(filter, update, options);

                //     if (!report) { // report was not found, create a new one
                //         report = new Reports({
                //             numberOfUsers: await Users.countDocuments(),
                //             coursePredictions: { [courseName]: 1 }
                //         });
                //         await report.save();
                //         console.log("Successfully created a new report document")
                //     }
                // } catch (err) {
                //     console.log("msg:" + err.message)
                // }

                return res.render('result_page/result', { prediction: topThreeResult });

            } else {
                return res.status(500).json({ error: "ERROR" });
            }


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    }

    // getTestDataResult: async (req, res) => {
    //     try {
    //         const { data } = await axios.get("http://localhost:3000/api/courses/recommend/")

    //         const ratings = data.prediction[0]

    //         console.log(ratings)


    //         let courses = [
    //             { name: "Bachelor of Science in Biology Major in Biotechnology ", description: "BS Bio Description" },
    //             { name: "Bachelor of Arts in English Language", description: "BA EL Description" },
    //             { name: "Bachelor of Secondary Education Major in Social Studies", description: "BSE Social Studies Description" },
    //             { name: "Bachelor of Arts in Economics", description: "BA Economics Description" },
    //             { name: "Bachelor of Arts in Sociology", description: "BA Sociology Description" },

    //         ]

    //         // Map to courses Object 

    //         let i = 0;
    //         courses.forEach(function (c) {
    //             c.ratings = ratings[i]
    //             i++
    //         })


    //         // Sort the top three result of the recommendation
    //         const topThreeResult = courses.sort((a, b) => b.ratings - a.ratings).slice(0, 3)
    //         console.log(topThreeResult)


    //         return res.status(200).json({ prediction: topThreeResult });

    //     } catch (err) {
    //         return res.status(500).json({ msg: err.message })
    //     }
    // }
}

module.exports = testCtrl