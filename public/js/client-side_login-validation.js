/* Validation in Registration page */
// const bcrypt = require('bcrypt')
// const { Users } = require('../../models/User')

const form = document.getElementById('form')
const email = document.getElementById('email')
const password = document.getElementById('password')



var success = false

form.addEventListener('submit', e => {

    if(success === false) {
		e.preventDefault()
    }
    checkInputs()

})

function checkInputs() {
	// Trim to remove the whitespaces
	const emailValue = email.value.trim()
	const passwordValue = password.value.trim()


	if(emailValue === '') {
		setErrorFor(email, 'Email field cannot be blank')
        success = false
	// } else if (checkEmailIfExist(emailValue)) {
    //     setErrorFor(email, 'User does not exist!')
    //     success = false
    } else {
        success = true

	}

	if(passwordValue === '') {
		setErrorFor(password, 'Password field cannot be blank')
        success = false
	// } else if(checkPassword(passwordValue)) {
    //     setErrorFor(password, 'Invalid Password! Try again.')
    //     success = false
    } else {
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


// async function checkEmailIfExist(email) {
//     const userEmail = await Users.findOne({email: email})
// 	if(!userEmail) return false

// }

// async function checkPassword(password) {
// 	const user = await Users.findOne({email: email})
// 	const dbPassword = user.encryptedPassword

// 	bcrypt.compare(password, dbPassword).then((match) => {
// 		if(!match) return false
// 	})
// }

