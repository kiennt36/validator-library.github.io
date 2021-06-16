const formElement = document.querySelector('#form-register') || document.querySelector('#form-login')
const passwordInputs = formElement.querySelectorAll('[type=password]')
const fullNameInput = formElement.querySelector('[name=fullName]')
const passwordInput = formElement.querySelector('[name=password]')
const formCheckList = formElement.querySelector('.form-section__form-checkList')
const formCheckItems = formCheckList.querySelectorAll('.form-section__form-checkItem')
const toggleShowPasswordBtn = formElement.querySelectorAll('.form-section__form-group-icon')
const avatarInput = formElement.querySelector('#avatar')
const avatarImage = formElement.querySelector('.form-section__form-show-img')
const linkElement = document.querySelector('.form-section__footer-link')
const provinceElement = document.querySelector('#province')
const favoriteElement = document.querySelector('.form-section__favorite-list')

document.addEventListener("DOMContentLoaded", () => {

	const replaceAllRegex = (regex, element, alphaReplace) => {
			element.value =
				element.value.replaceAll(regex, alphaReplace)
	}

	const convertCambelCase = (char, string) => {
		string.replaceAll(char, char.toUpperCase())
	}

	// Validate fullname input
	if(fullNameInput) {
		fullNameInput.addEventListener('input', () => {
			replaceAllRegex(/ {2,}/g, fullNameInput, ' ')
			const fisrtChars = fullNameInput.value.match(/(^[a-zA-Z])|[ ]([a-zA-Z])/gm) || []
			for(let i = 0; i < fisrtChars.length; i++)
				replaceAllRegex(fisrtChars[i], fullNameInput, fisrtChars[i].toUpperCase())
		})
	}

	// Add / remove class in password input
	passwordInput.onfocus = () => {
		if(formCheckList.classList.contains('hidden'))
			formCheckList.classList.remove('hidden')
	}

	// Validate password
	passwordInput.addEventListener('input', () => {
		const regexs = [
			/.{8,}/,
			/[a-zA-Z]/gm,
			/[^a-zA-Z0-9]|[0-9]/g
		]

		regexs.forEach((regex, index) => {
			replaceAllRegex(/ /g, passwordInput, '')
			if(regexs[index].test(passwordInput.value)) {
				if(!formCheckItems[index].classList.contains('checked'))
				formCheckItems[index].classList.add('checked')
			}
			else {
				formCheckItems[index].classList.remove('checked')
			}
		})

	})

	// show / hidden password
	Array.from(passwordInputs).forEach((element, index) => {
		toggleShowPasswordBtn[index].onclick = () => {
			if(toggleShowPasswordBtn[index].classList.contains('hidden')) {
				toggleShowPasswordBtn[index].classList.remove('hidden')
				element.type = "text"
			}
			else {
				toggleShowPasswordBtn[index].classList.add('hidden')
				element.type = "password"
			}
		}
	})

	// render provinces
	let htmls = `
			<option value="">
				-- Tỉnh/Tp --
			</option>
	`
	htmls += PROVINCES.map(province => {
		return `
			<option value="${province.key}">
				${province.value}
			</option>
		`
	}).join('')

	provinceElement.innerHTML = htmls

	// render favorites
	htmls = FAVORITES.map(favorite => {
		return `
			<div class="form-section__form-input-wrap mt-1">
				<input type="checkbox" name="favorite" value="${favorite.key}">
				<label class="form-section__form-label">
					${favorite.value}
				</label>
			</div>
		`
	}).join('')

	favoriteElement.innerHTML = htmls

	// Validate form register
	Validator({
		form: "#form-register",
		formGroup: ".form-section__form-group",
		errorMessage: ".form-section__form-message",
		rules: [
			Validator.isRequired('#fullName', 'Vui lòng nhập họ tên'),
			Validator.minLength('#fullName', 2, 'Vui lòng nhập đầy đủ họ tên'),
			Validator.isRequired('#email', 'Vui lòng nhập email'),
			Validator.isEmail('#email'),
			Validator.isRequired('#password', 'Vui lòng nhập mật khẩu'),
			Validator.minLength('#password', 8),
			Validator.minCharAlpha('#password', 1),
			Validator.minNumberOfCharSpecial('#password'),
			Validator.isRequired('#password-confirmation', 'Vui lòng nhập lại mật khẩu'),
			Validator.isConfirmed('#password-confirmation', () => {
				return passwordInput.value
			}, "Mật khẩu nhập lại không chính xác"),
			Validator.isRequired('input[name=gender]'),
			Validator.isRequired('input[name=favorite]'),
			Validator.isRequired('#province'),
			Validator.isRequired('#avatar'),
		],
		onSubmit: data => {
			let dataUser = JSON.parse(localStorage.getItem('dataUser'))
			if(dataUser) {
				const srcAvatar = dataUser.srcAvatar
				dataUser = Object.assign({}, data)
				dataUser.srcAvatar = srcAvatar
			}
			localStorage.setItem('dataUser', JSON.stringify(dataUser))
			window.location = DOMAIN_NAME + 'assets/pages/login.html'
		}
	})

	if(avatarInput) {
		avatarInput.addEventListener('change', (e) => {
			if(avatarInput.value) {
				const file = e.target.files[0]
				const reader = new FileReader()
				reader.addEventListener('load', (e) => {
					const srcData = e.target.result
					if(srcData) {
						avatarImage.style.backgroundImage = `url('${srcData}')`
						avatarImage.classList.remove('hidden')
						const dataUser = JSON.parse(localStorage.getItem('dataUser')) || {}
						dataUser.srcAvatar = srcData
						localStorage.setItem('dataUser', JSON.stringify(dataUser))
					}
				})
				reader.readAsDataURL(file)
			}
			else {
				avatarImage.classList.add('hidden')
			}
		})
	}

	if(linkElement) {
		if(linkElement.classList.contains('link-register'))
			linkElement.href = DOMAIN_NAME + 'index.html'
		if(linkElement.classList.contains('link-login'))
			linkElement.href = DOMAIN_NAME + 'assets/pages/login.html'
	}
})