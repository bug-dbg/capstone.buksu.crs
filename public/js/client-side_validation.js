/* Validation in Registration page */

const form = document.getElementById('form')
const firstName = document.getElementById('firstName')
const lastName = document.getElementById('lastName')
const email = document.getElementById('email')
const password = document.getElementById('password')
const password2 = document.getElementById('password2')



var success = false

form.addEventListener('submit', e => {
	
    if(success === false) {
		e.preventDefault()       	
    }
    checkInputs()

})

function checkInputs() {
	// Trim to remove the whitespaces
	const firstNameValue = firstName.value.trim()
	const lastNameValue = lastName.value.trim()
	const emailValue = email.value.trim()
	const passwordValue = password.value.trim()
	const password2Value = password2.value.trim()
	
	if(firstNameValue === '') {
		setErrorFor(firstName, 'This field cannot be blank')
        success = false
	} else {
		setsuccessFor(firstName)
        success = true
      
	}

	if(lastNameValue === '') {
		setErrorFor(lastName, 'This field cannot be blank')
        success = false
	} else {
		setsuccessFor(lastName)
        success = true
    
	}
	
	if(emailValue === '') {
		setErrorFor(email, 'Email field cannot be blank')
        success = false
	} else if (emailAlreadyExist(emailValue)) { 
		console.log(emailAlreadyExist(emailValue))
        setErrorFor(email, 'Email Already Existed! Try another one.')
        success = false
    } else if (!isEmail(emailValue)) {
		setErrorFor(email, 'Not a valid email')
        success = false
    }  else {
		setsuccessFor(email)
        success = true
        
	}
	
	if(passwordValue === '') {
		setErrorFor(password, 'Password field cannot be blank')
        success = false
	} else if(passwordValue.length < 6) {
        setErrorFor(password, 'Password is at least 6 characters long')
        success = false
    } else {
		setsuccessFor(password)
        success = true
    
	}

	if(password2Value === '') {
		setErrorFor(password2, 'This field cannot be blank')
	} else if(passwordValue !== password2Value) {
		setErrorFor(password2, 'Password does not match')
		success = false
	} else{
		setsuccessFor(password2)
		success = true
	}
	
}

function setErrorFor(input, message) {
	const formControl = input.parentElement
	const small = formControl.querySelector('small')
	formControl.className = 'form-control error'
	small.innerText = message
}

function setsuccessFor(input) {
	const formControl = input.parentElement
	formControl.className = 'form-control success'
}
	
function isEmail(email) {
	return /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
}


// function emailAlreadyExist(email) {

// 	let e = email
// 	let getEmailData = $.get('http://localhost:5000/all-users')

// 	.done(() => {
// 		var emailData = getEmailData.responseJSON.users
	

// 		for(let i = 0; i < emailData.length; i++) {
// 			var data = emailData[i].email

// 			if(data === e) {
// 				console.log(data + ' = ' + e)
// 				return true
// 			}
			
// 		}
	
// 	})
	
// }

// async function emailAlreadyExist(email) {
// 	const userEmail = await Users.findOne({email})

// 	if(userEmail === email) return true
// }




// function emailAlreadyExist(email) {

// 	let e = email
// 	let getEmailData = $.get('http://localhost:5000/all-users')

// 	.done(() => {
// 		var emailData = getEmailData.responseJSON.users
	

// 		for(let i = 0; i < emailData.length; i++) {
// 			var data = emailData[i].email
			
// 			if(data == e) {
//				console.log(data + " = " + e)			
//			}
			
// 		}
// 		return data
// 	})
// }

