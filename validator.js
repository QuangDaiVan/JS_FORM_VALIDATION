// đối tượng Validator
function Validator(options) {
    const selectorRules = {}
    function validate(inputElement, rule) {
        const errElement = inputElement.parentElement.querySelector('.form-message')
        // lấy ra các rules của selector
        const rules = selectorRules[rule.selector]
        let errMessage
        // lặp qua từng rule
        for (let i = 0; i < rules.length; ++i) {
            errMessage = rules[i](inputElement.value)
            if (errMessage) break
        }
        if (errMessage) {
            errElement.innerText = errMessage
            inputElement.parentElement.classList.add('invalid')
        } else {
            errElement.innerText = ''
            inputElement.parentElement.classList.remove('invalid')
        }
        return !errMessage
    }

    const formElement = document.querySelector(options.form)
    if (formElement) {
        // bỏ đi mặc định nút submit
        formElement.onsubmit = function (e) {
            e.preventDefault()
            var isFormValid = true
            // thực hiện lặp qua từng rule và validate dữ liệu
            options.rules.forEach(function (rule) {
                const inputElement = formElement.querySelector(rule.selector)
                let isValid = validate(inputElement, rule)
                if (!isValid) {
                    isFormValid = false
                }
            })
            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    const formInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    const formValues = Array.from(formInputs).reduce(function (values, input) {
                        values[input.name] = input.value
                        return values
                    }, {})
                    options.onSubmit(formValues)
                } else {
                    formElement.submit()
                }
            }
        }
        // xử lý lặp qua mỗi rule và xử lý
        options.rules.forEach(function (rule) {
            // lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }


            const inputElement = formElement.querySelector(rule.selector)
            if (inputElement) {
                // xử lý trường hợp blur ra ngoài
                inputElement.onblur = function () {
                    validate(inputElement, rule)
                }
                // xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    validate(inputElement, rule)
                }
            }
        })
    }
}

//Định nghĩa các rule
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return regex.test(value) ? undefined : message || 'Trường này phải là email'
        }
    }
}
Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim().length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}
Validator.isConfirm = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Gía trị nhập vào không chính xác'
        }
    }
}

// 10/10/2024: cheat
