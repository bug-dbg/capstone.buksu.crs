const quiz = document.getElementById('quiz');
const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text')
const b_text = document.getElementById('b_text')
const c_text = document.getElementById('c_text')
const d_text = document.getElementById('d_text')
const e_text = document.getElementById('e_text')
const submit = document.getElementById('submit')
const answerEl = document.querySelectorAll('.answer')

var getTestData = $.get('http://localhost:5000/api/test-data')
    
    .done(() => {
        var testData = getTestData.responseJSON.data
        console.log(testData)

        let currentTest = 0  
        loadTest();
    
        function loadTest() {
            deselectAnswers()
        
            
            const currentTestData  = testData[currentTest]

            questionEl.innerText = currentTestData.question
            a_text.innerText = currentTestData.choice1
            b_text.innerText = currentTestData.choice2
            c_text.innerText = currentTestData.choice3
            d_text.innerText = currentTestData.choice4
            e_text.innerText = currentTestData.choice5
            
        }

        function getSelected() {
            
            let answer = undefined

            answerEl.forEach((answerEl) => { // to loop for all the questions
                if(answerEl.checked) {  
                    // if radio element is checked it will return its id
                    answer = answerEl.id;
                }
            });
            
            return answer;
            // else it will return undifined
        }

        function deselectAnswers() {
            answerEl.forEach((answerEl) => {
                answerEl.checked = false;
            });
        }

        submit.addEventListener('click', () => {  
            
            // event listener when clicking the submit button
        
            const answer = getSelected();
            // if theres a choice selected
            if(answer) {

            currentTest++
                // if submitted it will load another question 

            }

            if (currentTest < testData.length) {
                loadTest()
            } else {
                quiz.innerHTML = `<h3>Done</h3>
                <button onclick="location.reload()">Get Recommendation</button>`             
            }
            console.log(answer); 
        });
    })