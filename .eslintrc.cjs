// I have no idea how ESLint works.

// module.exports = {
//     "env": {
//         "browser": true,
//         "es2021": true
//     },
//     "extends": [
//         "eslint:recommended",
//         "plugin:@typescript-eslint/recommended"
//     ],
//     "parser": "@typescript-eslint/parser",
//     "parserOptions": {
//         "ecmaVersion": 13,
//         "sourceType": "module"
//     },
//     "plugins": [
//         "@typescript-eslint"
//     ],
//     "rules": {
//     }
// };

module.exports = {
    parser: '@typescript-eslint/parser', // add the TypeScript parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        project: './tsconfig.json'
    },
    env: {
        browser: true,
        es6: true,
    },
    plugins: [
        'svelte3',
        '@typescript-eslint' // add the TypeScript plugin
    ],
    overrides: [ // this stays the same
        {
            files: ['*.svelte'],
            processor: 'svelte3/svelte3'
        }
    ],
    rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
    },
    settings: {
        //   'svelte3/typescript': () => require('typescript'), // pass the TypeScript package to the Svelte plugin
        // OR
        'svelte3/typescript': true, // load TypeScript as peer dependency
        // ...
        'svelte3/ignore-styles': () => true, // ignore Svelte CSS
    }
};