const formElement = document.querySelector('#form-login')
const passwordInput = formElement.querySelector('[name=password]')
const toggleShowPasswordBtn = formElement.querySelector('.form-section__form-group-icon')
const linkElement = document.querySelector('.form-section__footer-link')

const dataUser = JSON.parse(localStorage.getItem('dataUser'))

toggleShowPasswordBtn.onclick = () => {
	if(toggleShowPasswordBtn.classList.contains('hidden')) {
		toggleShowPasswordBtn.classList.remove('hidden')
		passwordInput.type = "text"
	}
	else {
		toggleShowPasswordBtn.classList.add('hidden')
		passwordInput.type = "password"
	}
}

// Validate form login
Validator({
	form: "#form-login",
	formGroup: ".form-section__form-group",
	errorMessage: ".form-section__form-message",
	rules: [
		Validator.isRequired('#email', 'Vui lòng nhập email'),
		Validator.isConfirmed('#email', () => {
			if(dataUser) {
				return dataUser.email
			}
			return 'admin@gmail.com'
		}, "Email nhập vào không đúng"),
		Validator.isRequired('#password', 'Vui lòng nhập mật khẩu'),
		Validator.isConfirmed('#password', () => {
			if(dataUser) {
				return dataUser.password
			}
			return 'admin123456'
		}, "Mật khẩu nhập không đúng"),
	],
	onSubmit: data => {
		window.location = DOMAIN_NAME + 'assets/pages/profile.html'
	}
})

if(linkElement) {
	if(linkElement.classList.contains('link-register'))
		linkElement.href = DOMAIN_NAME + 'index.html'
}