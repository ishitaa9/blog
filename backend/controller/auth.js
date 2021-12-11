const User = require('../models/user')
const Blog = require('../models/blog')
const shortId = require('shortid');
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt');
const blog = require('../models/blog');
const { errorHandler } = require('../helpers/dbErrorHandler');
const _ = require('lodash');

//sendgrid id
const sgMail = require('@sendgrid/mail'); //SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// exports.preSignup = (req, res) => {
//     console.log('got here now', req.body);
//     const {name, email, password} = req.body
//     User.findOne({email: email.toLowerCase()}, (err, user) => {
//         if(user) {
//             return res.status(400).json({
//                 error: 'Email already exists'
//             })
//         }
//         const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION,{ expiresIn: '10m'});

//         const emailData = {
//             from: process.env.EMAIL_FROM,
//             to: email,
//             subject: `Account activation link`,
//             html: `
//             <p>Please use the following link to activate your account </p>
//             <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
//             <hr />
//             <p>This email may contain sensitive information</p>
//             <p>https://seoblog.com</p>`
//         };
//         sgMail.send(emailData).then(sent => {
//             console.log('got inside the sg function', sent);
//             return res.json({
//                 message: `Click the link on ${email} to activate your account.`
//             });
//         });
//     });
// };

exports.signup = (req,res)=> {
    User.findOne({email: req.body.email}).exec((err, user)=> {
        if(user) {
            return res.status(400).json({
                error: 'Email is taken'
            })
        }
        const {name,email,password} = req.body
        let username = shortId.generate()
        let profile = `${process.env.CLIENT_URL}/profile/${username}`

        let newUser = new User({name, email, password, profile, username})
        newUser.save((err, success) => {
                if(err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                res.json({
                    message: 'Signup success! Please signin.'
                })
        })
    })
};


// exports.signup = (req, res) => {
//     const token = req.body.token
//     if(token) {
//         jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
//             if(err) {
//                return res.status(400).json({
//                error: 'Link has expired. Please signup again'
//                 })
//             }

//             const { name, email, password } = jwt.decode(token)

//             let username = shortId.generate();
//             let profile = `${process.env.CLIENT_URL}/profile/${username}`;

//             const user = new User({name, email, password, profile, username});
//             user.save((err, user) => {
//                 if(err) {
//                     return res.status(401).json({
//                         error: errorHandler(err)
//                     });
//                 }
//                 return res.json({
//                     message: 'Signup successful! Please signin.'
//                 })
//             });
//         });

//     } else {
//         return res.json({
//             message: 'Something went wrong. Please try again.'
//         })
//     }
// };

exports.signin = (req,res) => {
    const{email, password} = req.body
    // check if user exist
    User.findOne({email}).exec((err,user) => {
        if(err || !user) {
            return res.status(400).json({
                error:'User does not exist. Please sign up.'
            });
        }

        // authenticate
        if(!user.authenticate(password)){
            return res.status(400).json({
                error:'Email and password do not match.'
            });
        }
        //generate a tocken and send to client
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET,{expiresIn: '500d'})
        res.cookie('token', token, {expiresIn: '500d'})

        const {_id, username, name, email, role} = user
        return res.json ({
            token,
            user : {_id, username, name, email, role}
        })
    })
}

exports.signout = (req,res) => {
    res.clearCookie("token")
    res.json({
        message: 'Signout success"'
    })
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
});

exports.authMiddleware = (req, res, next ) => {
    const authUserId = req.user._id
    User.findById({_id: authUserId}).exec((err,user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found'

            })
        }
        req.profile = user
        next()
    })
}

exports.adminMiddleware = (req, res, next ) => {
    const adminUserId = req.user._id
    User.findById({_id: adminUserId}).exec((err,user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found.'

            })
        }
        if(user.role !== 1) {
            return res.status(400).json({
                error: 'Admin resouce. Access denied.'
            });

        }
        req.profile = user
        next()
    })
};

exports.canUpdateDeleteBlog = (req, res, next) => {
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({slug}).exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        let authorizedUser = data.postedBy._id.toString() === res.profile._id.toString
        if(!authorizedUser) {
            return res.status(400).json({
                error: 'You are not authorized'
            })
        }
        next();
    })
}

// forgot Password, reset Password

exports.forgotPassword = (req, res) => {
    const {email} = req.body
    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(401).json({
                error: 'User with this email does not exist'
            })
        }

        const token = jwt.sign({_id: user._id}, process.env.JWT_RESET_PASSWORD, {expiresIn: '10m'})

        //send email
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Password reset link`,
            html: `
            <p>Please use the following link to reset your password </p>
            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>https://seoblog.com</p>`
        };
        //populating the database with the user resetPAsswordLink
        return user.updateOne({resetPasswordLink: token}, (err, success) =>{
            if(err) {
                return res.json({error: errorHandler(err)});
            } else {
                sgMail.send(emailData).then(sent => {
                    return res.json({
                        message: `Click the link on ${email} to reset your password. Link expires in 10 minutes.`
                    })
                })
            }
        })
    })
}

exports.resetPassword = (req, res) => {
    const{resetPasswordLink, newPassword} = req.body

    if(resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if(err) {
                return res.status(401).json({
                    error: 'Expired link. Try again.'
                })
            }
            User.findOne({resetPasswordLink}, (err, user) => {
                if(err || !user) {
                    return res.status(401).json({
                        error: 'Something went wrong. Try later.'
                    })
                }
                const updateFields = {
                    password : newPassword,
                    resetPasswordLink: ''
                };

                user = _.extend(user, updateFields);

                user.save((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json({
                        message: `Great! Login using new password.`
                    });
                });
            });
        });
    }
};

