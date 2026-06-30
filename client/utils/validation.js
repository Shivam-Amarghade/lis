// src/utils/validation.js

import { REGEX } from "./Regex.js";

export const validateLogin = ({ email, password }) => {
    const errors = {};

    if (!email.trim()) {
        errors.email = "Email is required";
    } else if (!REGEX.EMAIL.test(email)) {
        errors.email = "Enter valid email";
    }

    if (!password) {
        errors.password = "Password is required";
    } else if (!REGEX.PASSWORD.test(password)) {
        errors.password =
            "Password must contain 8 characters, one uppercase, one lowercase, one number and one special character.";
    }

    return errors;
};