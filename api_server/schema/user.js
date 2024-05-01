// Import the package for defining validation rules
const joi = require('joi');

// 1. Define validation rules for username and password
const userid = joi.string().alphanum().min(1).max(20).required()
const password = joi
    .string()
    .pattern(/^[\S]{6,12}$/)
    .required()
const location = joi.string()

// 2. Define validation rules for user information form fields id, username, and email
// integer() for integer type arrays, no decimals   required() indicates a mandatory parameter
const id = joi.number().integer().min(1).required()
const username = joi.string()
const user_email = joi.string().email().required()

// Define validation rules for avatar, validating a base64 string with dataUri()
const avatar = joi.string().dataUri().required()

// 1.1 Define the validation rules object for registration and login form data
exports.reg_login_schema = {
    body: {
        userid,
        username,
        password,
        location,
    },
}

// 2.2 Validation rules object - Update user basic information, validate the client-submitted form data
exports.update_userinfo_schema = {
    // Validation is required for the data inside req.body
    body: {
        userid,
        username,
        // Form data and validation rule names differ, cannot use shorthand
        email: user_email,
    },
}

// 3.3 Validation rules object - Update password  joi.ref('oldPwd') means the new password must be different from the old password, concat(password) merges this rule with the previous rule
exports.update_password_schema = {
    body: {
        // Reuse previously defined password validation
        oldPwd: password,
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    },
}

// 4. Validation rules object - Update avatar
exports.update_avatar_schema = {
    body: {
        avatar
    }
}
