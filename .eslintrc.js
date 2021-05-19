module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "web extensions": true,
        "jquery": true,
        "amd": true,
        "node": true,
        "chart":true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
    }
};
