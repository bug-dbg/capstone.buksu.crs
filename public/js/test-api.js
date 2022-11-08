const submitBtn = document.getElementById("submit")
var arr = []
var len = 10

submitBtn.addEventListener("click", function() {
    var cbChecked = document.querySelector('[name="answers"]:checked')
    
    if (cbChecked != null) {
        arr.push(cbChecked.value)
    }

    // if(arr.length === 9) {
    //     submitBtn.innerHTML =  `Submit`
    // }

    if(arr.length === len) {

        // // $.ajax('http://localhost:5000/api/test/userchoices', {

        // // })

        // // $.ajax({
        // //     type:'POST',
        // //     url: '/test/userchoices',
        // //     data: data
        // // })
       
        // const data = $.post('http://localhost:5000/api/user/test-choice/value',  // url
        //         { myData: arr });

        // var getdata = $.get('http://localhost:5000/api/user/test-choice/value')

        // console.log(getdata)
        alert(arr)
        
        // var ajaxRequest= $.post("/api/test/userchoices", arr, function(data) {
        //     alert(data);
        //   })
        //     .fail(function() {
        //       alert("error");
        //     })
        //     .always(function() {
        //       alert("finished");
        //   });
      
        // console.log(ajaxRequest)

        
        
        // const data = axios.post('http://localhost:5000/api/user/test-choice/value', arr)
        // .then(res => console.log(res))
        // .catch(err => console.log(err))
        // console.log(data)

         const URL = 'http://localhost:5000/api/user/test-choice/value';
        const data = axios(URL, {
            method: 'POST',
            headers: {
            'content-type': 'application/json',
            },
            data: arr,
        })
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
        
        console.log(data)

        
        // var data = $.ajax({
        //     url: URL,
        //     type: "POST",
        //     data: arr,
        //     success: function(response) {
        //             console.log(response);
        //     },
        //     error: function(err) {
        //         console.log(err)
        //     }
        // });
        // console.log(data)
        

        
        
        // const data = axios
        //     .post('http://localhost:5000/api/user/test-choice/value', arr)
        //     .then(response => {
        //     const sendData = response.data
        //     console.log(`POST: value is sent`, sendData)
           
            
        //     })
        //     .catch(error => console.error(error))
        
        
     
        // userChoiceValue(arr)
    }
})