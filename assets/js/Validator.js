function Validator(options) {
	const formElement = document.querySelector(options.form)
	let ErrorMessageElement
	let selectorRules = {}

	const getParent = (element, selector) => {
		while(element.parentElement) {
			if(element.parentElement.matches(selector)) {
				return element.parentElement
			}
			element = element.parentElement
		}
	}

	const validate = (inputElement, rule) => {

		const parentElement = getParent(inputElement, options.formGroup)
		const ErrorMessageElement = parentElement.querySelector(options.errorMessage)
		const rules = selectorRules[rule.selector]
		const rulesLength = rules.length
		let errorMessage

		for(let i = 0; i < rulesLength; i++) {
			switch(inputElement.type) {
				case 'radio':
				case 'checkbox':
					errorMessage = rules[i] (
						formElement.querySelector(rule.selector + ':checked')
					)
					break

				default:
				errorMessage = rules[i] (inputElement.value)
			}
			if(errorMessage) break
		}

		if(parentElement && ErrorMessageElement) {
			if(errorMessage) {
				ErrorMessageElement.innerText = errorMessage
				if(!parentElement.classList.contains('error'))
					parentElement.classList.add('error')
			}
			else {
				ErrorMessageElement.innerText = ''
				if(parentElement.classList.contains('error'))
					parentElement.classList.remove('error')
			}
		}

		return !errorMessage
	}

	if(formElement) {

		// Xử lý xự kiện của input (onblur, oninput, ...)
		options.rules.forEach(rule => {
			const inputElements =
				formElement.querySelectorAll(rule.selector)

			Array.from(inputElements).forEach(inputElement => {
				const parentElement = getParent(inputElement, options.formGroup)
				const ErrorMessageElement = parentElement.querySelector(options.errorMessage)

				// Lưu tất cả các rule vào object selectiorRules
				if(Array.isArray(selectorRules[rule.selector])) {
					selectorRules[rule.selector].push(rule.test)
				}
				else {
					selectorRules[rule.selector] = [rule.test]
				}


				// Xử lý khi input blur
				inputElement.onblur = () => {
					validate(inputElement, rule)
				}

				// Xử lý khi input được nhập
				inputElement.oninput = () => {
					if(parentElement && ErrorMessageElement) {
						ErrorMessageElement.innerText = ''
						if(parentElement.classList.contains('error'))
							parentElement.classList.remove('error')
					}
				}
			})
		})

		// Xử lý sự kiện khi fom submit
		formElement.onsubmit = (e) => {
			e.preventDefault()
			let isFormValid = true
			options.rules.forEach(rule => {
				const inputElements =
				formElement.querySelectorAll(rule.selector)
				Array.from(inputElements).forEach(inputElement => {
					const isValid = validate(inputElement, rule)

					if(!isValid) {
						isFormValid = false
					}
				})
			})

			if(isFormValid) {
				if(options.onSubmit && typeof options.onSubmit === 'function') {
					
					const enabledInputs = formElement.querySelectorAll('[name]')

					const dataUser = Array.from(enabledInputs).reduce((values, inputElement) => {

						switch(inputElement.type) {
							case 'radio':
								values[inputElement.name] =
									formElement.querySelector('input[name="' + inputElement.name + '"]:checked').value
								break

							case 'checkbox':
								if(inputElement.matches(':checked')) {
									if(!Array.isArray(values[inputElement.name]))
										values[inputElement.name] = []

									values[inputElement.name].push(inputElement.value)
								}
								break

							case 'file':
								values[inputElement.name] = inputElement.files
								break

							default:
								values[inputElement.name] = inputElement.value.trim()
						}

						return values
					}, {})

					if(dataUser)
						options.onSubmit(dataUser)
					else
						options.onSubmit({
							errorMessage: "No data"
						})
				}
				else {
					formElement.submit()
				}
			}
		}
	}
}

Validator.isRequired = (selector, message="Vui lòng nhập trường này") => {
	return {
		selector,
		test: function (value) {
			return value ? undefined : message 
		}
	}
}

Validator.isEmail = (selector, message="Trường này phải là email") => {
	return {
		selector,
		test: function (value) {
			const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
			return regex.test(value.toUpperCase().trim()) ? undefined : message
		}
	}
}

Validator.minNumberOfCharSpecial = (selector, message="Nhập tối tiểu một số hoặc một ký tự đặc biệt") => {
	return {
		selector,
		test: function (value) {
			const regex = /[0-9]|[^a-zA-Z0-9 ]/gm
			return regex.test(value) ? undefined : message
		}
	}
}

Validator.minLength = (selector, min, message=`Vui lòng nhập tối thiểu ${min} ký tự`) => {
	return {
		selector,
		test: function (value) {
			return value.trim().length >= min ? undefined : message
		}
	}
}

Validator.minCharAlpha = (selector, min, message=`Vui lòng nhập tối thiểu ${min} chữ cái`) => {
	return {
		selector,
		test: function (value) {
			const regex = /[a-zA-Z]{1,}/gm
			return regex.test(value) ? undefined : message
		}
	}
}

Validator.isConfirmed = (selector, input, message=`Giá trị nhập vào không khớp`) => {
	return {
		selector,
		test: function (value) {
			return value === input() ? undefined : message
		}
	}
}

