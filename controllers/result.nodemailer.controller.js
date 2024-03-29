const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const ejs = require('ejs')

const { sign, verify } = require("jsonwebtoken")

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '270040489280-ljn99nm3ve4m8su2t77dras268tp2fiu.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

const { TestValue } = require('../models/TestValue')


const productionUrl = 'https://ai.buksu-crs.systems'

const currentUrl = process.env.NODE_ENV === 'production' ? productionUrl : 'http://localhost:3000'

// const currentUrl = process.env.NODE_ENV === 'production'
//   ? productionUrl
//   : process.env.NODE_ENV === 'development'
//     ? 'http://localhost:3000'
//     : 'http://192.168.254.107:3000' || 'http://10.50.27.68:3000' ||'http://192.168.1.162:3000'

// const currentUrl = process.env.NODE_ENV === 'production'
//   ? productionUrl
//   : 'http://localhost:3000'

    

function findHighestValue(array) {
    let highestValue = array[0];
    let position = 0;
    for (let i = 1; i < array.length; i++) {
      if (array[i] > highestValue) {
        highestValue = array[i];
        position = i;
      }
    }
    return { value: highestValue, position: position };
  }
        

const emailSender = {
    sendEmail: async (req, res) => {

        try {

            var accessToken = req.cookies['access-token']
            var user = verify(accessToken, process.env.JWT_SECRET)


            if (user) {
                req.user = user
                var normalSignedEmail = req.user.email
                var userID = req.user.id

            } else {
                console.log('Something went wrong when getting user ID!')
            }

            const { id, answer } = req.body

            let arr = []


            const value = await TestValue.find({ currentQuestion: id, currentUserID: userID }, 'value -_id')

            // loop through the value and push it into an array
            value.forEach(function (data) {
                arr.push(data.value)
            })

            const { data } = await axios.post(`${currentUrl + "/api/courses/recommend/"}`, arr);

            // console.log(data);

            const ratings = data.prediction[0]



            let courses = [
              { name: "Bachelor of Science in Biology Major in Biotechnology", description: "The BS Biology major in Biotechnology program is designed to equip students for careers in bioprocess engineering, molecular biology, plant biotechnology, and medical research. Biotechnology involves the use of biological organisms to develop new products and technologies. The majority of biotechnology majors focus on medicine, agriculture, energy, or the environment.", category: "MATH" },
              { name: "Bachelor of Science in Environmental Science Major in Environmental Heritage Studies", description: "Bachelor of Science in Environmental Science Major in Environmental Heritage Studies is a four-year program that studies ecological principles and phenomena, natural resource management, and human population growth. It teaches students about science based theories and techniques required to monitor and interact with the environment. This course also provides the technical foundation required to comprehend the biological, chemical, and physical aspects of the environment.", category: "EDUCATION" },
              { name: "Bachelor of Arts in English Language", description: "The Bachelor of Arts in English Language Studies focuses on the theoretical aspects of the English language as well as its practical applications. It prepares students for effective English communication in a variety of contexts and situations. It also aims to provide possibilities for applied competencies acquired for job roles by offering competitive global English education. The program provides students with the information and skills needed to meet the challenges of modern English language teaching.", category: "LANGUAGE" },
              { name: "Bachelor of Arts in Economics", description: "This program is designed to study many real-world issues such as global trade, poverty, taxes, crime, and education, as well as how society generates and consumes goods. The Bachelor of Arts in Economics is ideal for students who want to concentrate on the qualitative aspects of economics. To prepare you for work in domestic or foreign organizations, the program places a greater emphasis on social conduct, culture, foreign diplomacy, and linguistics.", category: "BUSINESS" },
              { name: "Bachelor of Arts in Sociology", description: "The Bachelor of Arts in Sociology program will teach you about social groups, social system, and social reform. Sociology examines the causes and strategies to many of today's most difficult societal issues. The curriculum aimed to demonstrate the nature of human life as well as the impact of various types of social structure in our society.", category: "ARTS" },
              { name: "Bachelor of Arts in Philosophy", description: "The course of study is aimed to provide students with a critical foundation in logic and argumentation, as well as an in-depth introduction and discussion to some of the most significant philosophical themes and customs from antiquity to the present. Employers are increasingly looking for Philosophy graduates who can think on the spot, identify key challenges, come up with solutions, and interact with their colleagues.", category: "ARTS" },
              { name: "Bachelor of Arts in Social Sciences", description: "The Bachelor of Arts in Social Science Studies program includes courses in political science, psychological studies, cultural studies, anthropology, and sociology. Individuals can choose from a wide range of core and specialty in this course. Social Science covers mostly the concerns about the the human world and society; it seeks to explore the economic system, social behavior, societal norms, and politics.", category: "ARTS" },
              { name: "Bachelor of Science in Mathematics", description: "A Bachelor's degree in Mathematics is a bachelor's degree that teaches theory and training in practical and core mathematics. BS in Mathematics provides a broad understanding of mathematical topics with depth in specific areas, as well as research into the outcomes of analytical, qualitative and logical reasoning. Mathematics is an incredibly diverse degree that can provide with numerous opportunities.", category: "MATHEMATICS" },
              { name: "Bachelor of Science in Community Development", description: "Community Development intends to produce/develop individuals to be competent development practitioners. The course will provide opportunity for the students to be equipped with skills in community organizing, planning, training and development, social mobilization and action research. Moreover, the course will develop capabilities of the students to accelerate their achievement in their respective goals through quality instruction, research, extension and production.", category: "LANGUAGE" },
              { name: "Bachelor of Science in Development Communication", description: "Bachelor of Science in Development Communication is a four-year course that prepares the students to acquire competencies in three major areas– Community Broadcasting, Development Journalism, and Educational Communication. The program prepares the students to become professionals in the field of development communication whose key purpose is to use participatory and mediated communication to facilitate society’s planned transformation (particularly of rural communities) from a state of poverty to one of a dynamic socio-economic growth characterized by equity, sustainability, agency, and active citizenship in social, political, and economic spheres.", category: "LANGUAGE" },
              { name: "Bachelor of Public Administration Major in Local Governance", description: "Bachelor of Public Administration Major in Local Governance is designed to give students practical and theoretical understanding skills in public management, policy making, and labor rights. It teaches students the foundations of effective governance and policy studies. Its goal is to teach students how to plan, enforce, supervise people, and create strategic planning for government and civil organizations.", category: "ARTS" },
              { name: "Bachelor of Science in Nursing", description: "Bachelor of Science in Nursing is a four-year degree program that teaches students the skills and knowledge required in health care It is divided into four parts: health promotion, disease prevention, risk reduction, and health restoration. The program's goal is to prepare nursing students to provide holistic care to people of all ages, genders, and health statuses. Nursing science, extensive research, leadership studies, and other areas that involves nursing process are covered in this course. It also provides a general education in math, social sciences, and humanities.", category: "MEDICAL" },
              { name: "Bachelor of Science in Accountancy", description: "The Accountancy program is designed to produce graduates who are professionally competent to assume responsible practice of Public Accounting and to render accounting, management, auditing, and tax advisory services. It also aims to prepare graduate to assume key positions in the accounting and administrative departments of private and public firms, and finally to equip the graduates with the latest knowledge and techniques in accounting to keep abreast with the needs of business and industry.", category: "MATHEMATICS" },
              { name: "Bachelor of Science in Business Administration Major in Financial Management", description: "The Business Administration program covers the integrated approach and interrelationship among the functional areas of businesses as well as sensitivity to the social, economic, technological, legal and international environment in which business must operate. The objective of the program is not simply to impart basic business knowledge, but to instill and nurture important qualities and skills in students that are essential for future business leadership and organizational success.", category: "BUSINESS" },
              { name: "Bachelor of Science in Hospitality Management", description: "The BS HRM program was designed to be industry based, well- structured and flexible, in order to match industry needs of the different sectors in the Hospitality Industry and to make qualifications relevant and useful to both students and industry. Its primary concentration is in the development of practical and management skills which are achieved through the combination of theoretical classes, experiential learning, and on-the-job-training both local and international.", category: "BUSINESS" },
              { name: "Bachelor of Science in Automotive Technology", description: "The Bachelor of Science in Automotive Technology program is a four year degree course that offer opportunities for student to learn and apply the scientific knowledge and methods in modern technology to support automotive technology activities in the field of industrial technology. Students are focused on classroom instruction and hands-on laboratory exerciser. Moreover, the program prepares the students to become professionals, and be qualified for positions in the field of automotive technology such as engine overhauling technician, service technician, technical staff, automotive parts man and automotive service manager.", category: "TECHNOLOGY" },
              { name: "Bachelor of Science in Electronics Technology", description: "The Bachelor of Science in Electronics Technology program offers opportunities for student to learn and apply the scientific knowledge and methods in modern technology to support electronics technology activities in the field of industrial technology. Students are provided a focus on classroom instruction and hands-on laboratory design and testing experiences. Moreover, the program prepares the students to become professionals, and be qualified for application positions in the field of electronics technology such as electronic systems analysis and design, technical sales and service, and engineering operations and maintenance.", category: "TECHNOLOGY" },
              { name: "Bachelor of Science in Food Technology", description: "Bachelor of Science in Food Technology is a four-year degree program design to develop professionals in food technology. The program focuses on a mix of pure and applied science, engineering, business and entrepreneurial skills. It aims to produce professionals who have the capacity to apply the science and technology and related fields of study in post-harvest handling, preparation, processing, packaging, storage, distribution and marketing of food to ensure food and nutrition security, quality, environmental sustainability and the well-being of individuals, families and communities. The program also aims to promote continued excellence in food science education.", category: "TECHNOLOGY" },
              { name: "Bachelor of Science in Information Technology", description: "The BS Information Technology program includes the study of the utilization of both hardware and software technologies involving planning, installing, customizing, operating, managing and administering, and maintaining information technology infrastructure that provides computing solutions to address the needs of an organization.", category: "TECHNOLOGY" },
              { name: "Bachelor of Science in Entertainment and Multimedia Computing major in Digital Animation Technology Game Development", description: "The Bachelor of Science in Entertainment and Multimedia Computing Major in Digital Animation Technology is the study and application of fundamental and advanced theories and advanced techniques in 2D and 3D animation, use and development for advancement of animation technologies, and production of commercially acceptable content and viable solutions for different platforms such as broadcast, web and mobile cast.", category: "TECHNOLOGY" },
              { name: "Bachelor of Elementary Education", description: "Bachelor of Elementary Education is a degree program designed to prepare people who want to teach at the elementary level. Its goal is to train highly competent and qualified teachers who specialize in elementary education curriculum.", category: "EDUCATION" },
              { name: "Bachelor of Secondary Education Major in Mathematics", description: "The program aims to train effective Math teachers at both the elementary and secondary levels. This course examines the relationships between numbers, logical structures, and patterns. Students who pursue the BSEd major in Mathematics and wish to work as licensed teachers at both the primary and secondary levels must complete additional education course units in order to sit for the Licensure Examination.", category: "EDUCATION" },
              { name: "Bachelor of Secondary Education Major in Filipino", description: "Bachelor of Secondary Education Major in Filipino is designed to provide students with the knowledge and skills needed to become efficient educators of the Filipino language. This course aims to apply current principles and strategies for teaching Filipino as a first language. It also prepares students to create lessons that meet the diverse needs of bilingual speakers transitioning to the people's first language at various levels.", category: "EDUCATION" },
              { name: "Bachelor of Secondary Education Major in English", description: "Bachelor of Secondary Education Major in English is intended to provide learners with the necessary and relevant skills to teach English at the secondary level. Its goal is to train highly qualified and competent English teachers who specialize in secondary pedagogies.", category: "EDUCATION" },
              { name: "Bachelor of Secondary Education Major in Social Studies", description: "The BSEd is an undergraduate teacher education program that aims to provide learners with the necessary skills and knowledge to teach in their chosen specialization or major at the secondary level. Its goal is to grow highly skilled and competent teachers specializing in secondary education content.  Graduates of BSEd ought to be able to engage in the teaching profession at the secondary level after successfully completing all requirements of the degree/program.", category: "EDUCATION" },
              { name: "Bachelor of Secondary Education Major in Science", description: "Bachelor of Secondary Education Major in Science aims to teach highly skilled and competent students who specializes in science content and pedagogy in primary and secondary schools.", category: "EDUCATION" },
              { name: "Bachelor of Early Childhood Education", description: "Bachelor of Early Childhood Education is a four-year program that teaches students in both the art and the science of teaching children aged 0 to 8. It lays a strong foundation for effective early childhood education and care based on practices that are appropriate. This course also refers to formal and informal educational studies that guide children's development and growth throughout their preschool period.", category: "EDUCATION" },
              { name: "Bachelor of Physical Education", description: "This course draws on knowledge various from allied fields such as sports and exercise sciences, life sciences, behavioral sciences, and employs multidisciplinary guidance to influence and develop all aspects of the learners' lives. It will prepare and train qualified and competent students to teach Physical Education, recreational activities, and sports at the elementary, secondary, and tertiary levels, as well as to become sports, dance, leisure, and fitness experts.", category: "ARTS" },
            ]
    

            // Map to courses Object 

           // Map to courses Object 

        let i = 0;
        courses.forEach(function (c) {
          c.ratings = ratings[i]
          i++
        })


        // Sort the top three result of the recommendation
        const result = courses.sort((a, b) => b.ratings - a.ratings).slice(0, 1)


        // const result = courses.sort((a, b) => b.ratings - a.ratings).slice(0, 1)
        // console.log(courseResult);

        // TODO: create code to map the result to the corresponding category value in dataset
        // this is to check the highest value among the categogy, then returns the category with highest value


        const category = [
          { course: "Bachelor of Science in Biology Major in Biotechnology", average: [71,45,74,54,38,50,62]},
          { course: "Bachelor of Science in Environmental Science Major in Environmental Heritage Studies", average: [71,45,74,54,38,50,62]},
          { course: "Bachelor of Arts in English Language", average: [46,35,72,68,24,96,47]},
          { course: "Bachelor of Arts in Economics", average: [78,63,80,80,84,75,62] },
          { course: "Bachelor of Arts in Sociology", average: [64,70,94,88,69,91,90] },
          { course: "Bachelor of Arts in Philosophy", average: [74,81,88,90,61,83,70] },
          { course: "Bachelor of Arts in Social Sciences", average: [65,66,94,86,70,90,58] },
          { course: "Bachelor of Science in Mathematics", average: [83,63,80,92,78,80,67] },
          { course: "Bachelor of Science in Community Development", average: [71,48,86,68,73,75,54] },
          { course: "Bachelor of Science in Development Communication", average: [72,76,85,88,66,100,65] },
          { course: "Bachelor of Public Administration Major in Local Governance", average: [20,20,68,46,32,38,30] },
          { course: "Bachelor of Science in Nursing", average: [74,66,76,80,80,80,96] },
          { course: "Bachelor of Science in Accountancy", average: [68,60,80,90,89,70,50] },
          { course: "Bachelor of Science in Business Administration Major in Financial Management", average: [68,86,92,87,100,85,65] },
          { course: "Bachelor of Science in Hospitality Management", average: [77,86,92,60,91,89,75] },
          { course: "Bachelor of Science in Automotive Technology", average: [90,48,72,52,49,30,32] },
          { course: "Bachelor of Science in Electronics Technology", average: [81,78,88,94,60,68,70] },
          { course: "Bachelor of Science in Food Technology", average: [90,43,68,88,73,80,55] },
          { course: "Bachelor of Science in Information Technology", average: [95,31,88,78,49,41,32] },
          { course: "Bachelor of Science in Entertainment and Multimedia Computing major in Digital Animation Technology Game Development", average: [95,70,70,74,49,58,37] },
          { course: "Bachelor of Elementary Education", average: [64,71,94,70,73,91,80] },
          { course: "Bachelor of Secondary Education Major in Mathematics", average: [83,63,94,92,78,80,80] },
          { course: "Bachelor of Secondary Education Major in Filipino", average: [64,71,94,70,73,93,68] },
          { course: "Bachelor of Secondary Education Major in English", average: [36,35,72,68,24,96,47] },
          { course: "Bachelor of Secondary Education Major in Social Studies", average: [64,71,94,70,73,92,74] },
          { course: "Bachelor of Secondary Education Major in Science", average: [64,71,94,70,73,89,75] },
          { course: "Bachelor of Early Childhood Education", average: [64,71,98,70,73,91,92] },
          { course: "Bachelor of Physical Education", average: [63,86,96,70,73,70,74] },

        ]

      //   const selectedCourses = category.filter(c => courseResult.some(cr => cr.name === c.course))
      //   .map(c => ({ course: c.course, average: c.average }));

        
      //   for(let i = 0; i < courseResult.length; i++) {

      //       console.log(selectedCourses[i].average);
      //   }

      //   var array1 = selectedCourses[0].average;
      //   var array2 = selectedCourses[1].average;
      //   var array3 = selectedCourses[2].average;
    
      // // combine the arrays into a two-dimensional array
      //   let matrix = [array1, array2, array3];

      //   // calculate the average of each column
      //   var columnAverages = [];
      //   for(let j = 0; j < matrix[0].length; j++) {
      //       let sum = 0;
      //       for(let i = 0; i < matrix.length; i++) {
      //           sum += matrix[i][j];
      //       }
      //       columnAverages[j] = sum / matrix.length;
      //   }

      //   // log the column averages to the console
      //   console.log("Average: " + columnAverages);

  

        var recommendedCategoryAverage
        var highestValue
        for (let i = 0; i < category.length; i++) {
          // console.log(category[i].course);

          if (category[i].course == result[0].name) {
            recommendedCategoryAverage = category[i].average
            highestValue = findHighestValue(recommendedCategoryAverage)

          }
        }
        var position = highestValue.position
        const categoryArray = ['TECHNOLOGY', 'ARTS', 'EDUCATION', 'MATHEMATICS', 'BUSINESS', 'LANGUAGE', 'MEDICAL'];

        const recommendedCategory = categoryArray.find((cat, index) => {
          if (index === position) {
            return cat;
          }
        });


        const coursesUnderRecommendedCategory = courses.filter(course => course.category === recommendedCategory);

       


            // responsible for sending the email
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                secure: true,
                auth: {
                    user: process.env.AUTH_EMAIL,
                    pass: process.env.AUTH_PASS
                }
            })

            ejs.renderFile('./views/result_page/emailResult.html', { category: recommendedCategory, prediction: coursesUnderRecommendedCategory }, function (err, data) {
                if (err) {
                    console.log(err)
                } else {
                    var mainOptions = {
                        from: 'buksu.crs@gmail.com',
                        to: normalSignedEmail,
                        subject: 'Buksu AFG Result',
                        html: data
                    }

                    console.log(normalSignedEmail)

                    console.log("html data ======================>", mainOptions.html);

                    mailTransporter.sendMail(mainOptions, function (err, info) {
                        if (err) {
                            console.log(err)
                            return res.redirect('/evaluation/result')
                        } else {
                            console.log('Message sent: ' + info.response)
                            return res.redirect('/success/email')
                        }
                    })
                }
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }



    }
}

module.exports = emailSender

