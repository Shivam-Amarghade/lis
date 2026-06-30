// src/utils/regex.js

export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    PASSWORD:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

    PHONE: /^[6-9]\d{9}$/,

    NAME: /^[A-Za-z ]{2,50}$/,
};