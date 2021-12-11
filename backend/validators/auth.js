const {check} = require('express-validator')

exports.userSignupValidator = [
    check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required'),
    check('email')
    .isEmail()
    .withMessage('Must be a valid email adress'),
    check('password')
    .isLength({min: 6})
    .withMessage('Password must be atleast 6 characters long'),

];
exports.userSigninValidator = [
    check('email')
    .isEmail()
    .withMessage('Must be a valid email adress'),
    check('password')
    .isLength({min: 6})
    .withMessage('Password must be atleast 6 characters long'),

];

exports.forgotPasswordValidator = [
    check('email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('Must be a valid email adress'),

];

exports.resetPasswordValidator = [
    check('newPassword')
    .not()
    .isEmpty()
    .isLength({min: 6})
    .withMessage('Password must be atleast 6 characters long'),

];