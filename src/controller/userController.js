"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserProfile = exports.getSingleUser = exports.getAllUsers = exports.resendOTP = exports.Login = exports.verifyUser = exports.Register = void 0;
const utils_1 = require("../utils");
const config_1 = require("../config");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
/** ================= Register ===================== **/
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phone, password, confirm_password } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // Generate salt
        const salt = yield (0, utils_1.GenerateSalt)();
        const userPassword = yield (0, utils_1.GeneratePassword)(password, salt);
        // Generate OTP
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        // check if the user exist
        const User = yield userModel_1.UserInstance.findOne({ where: { email: email } });
        //Create User
        if (!User) {
            yield userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: userPassword,
                fullName: "",
                userName: "",
                salt,
                address: "",
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: false,
                role: "user"
            });
            // Send Otp to user
            // await onRequestOTP(otp, phone);
            //Send Mail to user
            const html = (0, utils_1.emailHtml)(otp);
            yield (0, utils_1.sendmail)(config_1.FromAdminMail, email, config_1.userSubject, html);
            // check if the user exist
            const User = (yield userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            //Generate signature for user
            let signature = yield (0, utils_1.Generatesignature)({
                id: User.id,
                email: User.email,
                verified: User.verified,
            });
            return res.status(201).json({
                message: "User created successfully check your email or phone for OTP verification",
                signature,
                verified: User.verified,
            });
        }
        return res.status(400).json({
            message: "User already exist",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/signup",
        });
    }
});
exports.Register = Register;
/** ================= Verify Users ===================== **/
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.signature;
        const decode = yield (0, utils_1.verifySignature)(token);
        // check if the user is a registered user
        const User = (yield userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        }));
        if (User) {
            const { otp } = req.body;
            if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
                const updatedUser = (yield userModel_1.UserInstance.update({
                    verified: true,
                }, { where: { email: decode.email } }));
                // Regenerate a new signature
                let signature = yield (0, utils_1.Generatesignature)({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    verified: updatedUser.verified,
                });
                if (updatedUser) {
                    const User = (yield userModel_1.UserInstance.findOne({
                        where: { email: decode.email },
                    }));
                    return res.status(200).json({
                        message: "You have successfully verified your account",
                        signature,
                        verified: User.verified,
                    });
                }
            }
        }
        return res.status(400).json({
            Error: "Invalid credential or OTP already expired",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/verify",
        });
    }
});
exports.verifyUser = verifyUser;
/** ================= Login Users ===================== **/
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // check if the user exist
        const User = (yield userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        if (User.verified === true) {
            const validation = yield (0, utils_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                //Generate signature for user
                let signature = yield (0, utils_1.Generatesignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
                return res.status(200).json({
                    message: "You have successfully logged in",
                    signature,
                    email: User.email,
                    verified: User.verified,
                    role: User.role
                });
            }
        }
        return res.status(400).json({
            Error: "Wrong Username or password or not a verified user ",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/login",
        });
    }
});
exports.Login = Login;
/** ================= Resend OTP ===================== **/
const resendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.signature;
        const decode = yield (0, utils_1.verifySignature)(token);
        // check if the user is a registered user
        const User = (yield userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        }));
        if (User) {
            // Generate OTP
            const { otp, expiry } = (0, utils_1.GenerateOTP)();
            const updatedUser = (yield userModel_1.UserInstance.update({
                otp,
                otp_expiry: expiry,
            }, { where: { email: decode.email } }));
            if (updatedUser) {
                const User = (yield userModel_1.UserInstance.findOne({
                    where: { email: decode.email },
                }));
                // Send Otp to user
                yield (0, utils_1.onRequestOTP)(otp, User.phone);
                //Send Mail to user
                const html = (0, utils_1.emailHtml)(otp);
                yield (0, utils_1.sendmail)(config_1.FromAdminMail, User.email, config_1.userSubject, html);
                return res.status(200).json({
                    message: "OTP resend to registered phone number and email",
                });
            }
        }
        return res.status(400).json({
            Error: "Error sending OTP",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/resend-otp/:signature",
        });
    }
});
exports.resendOTP = resendOTP;
/** ================= PROFILE ===================== **/
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = req.query.limit;
        const users = yield userModel_1.UserInstance.findAndCountAll({
            limit: limit,
        });
        return res.status(200).json({
            message: "You have successfully retrieved all users",
            Count: users.count,
            Users: users.rows,
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/get-all-users",
        });
    }
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        // find the user by id
        const User = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (User) {
            return res.status(200).json({
                User,
            });
        }
        return res.status(400).json({
            message: "User not found",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/get-user",
        });
    }
});
exports.getSingleUser = getSingleUser;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        const { fullName, userName, address, phone } = req.body;
        //Joi validation
        const validateResult = utils_1.updateSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // check if the user is a registered user
        const User = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (!User) {
            return res.status(400).json({
                Error: "You are not authorized to update your profile",
            });
        }
        const updatedUser = (yield userModel_1.UserInstance.update({
            fullName,
            userName,
            address,
            phone,
        }, { where: { id: id } }));
        if (updatedUser) {
            const User = (yield userModel_1.UserInstance.findOne({
                where: { id: id },
            }));
            return res.status(200).json({
                message: "You have successfully updated your profile",
                User,
            });
        }
        return res.status(400).json({
            message: "Error occured",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/update-profile",
        });
    }
});
exports.updateUserProfile = updateUserProfile;
// Forgot password
/** ==============  User  Delete House ============== **/
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        const User = yield userModel_1.UserInstance.findOne({ where: { id: id } });
        if (User) {
            const deletedUser = yield userModel_1.UserInstance.destroy({ where: { id: id } });
            return res.status(201).json({
                message: 'User deleted successfully',
                deletedUser
            });
        }
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/delete-user"
        });
    }
});
exports.deleteUser = deleteUser;
