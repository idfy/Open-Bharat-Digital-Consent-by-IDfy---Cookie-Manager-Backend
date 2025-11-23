module.exports = {
    env: {
        node: true,
        // 'commonjs': true,
        browser: true,
        es2021: true
    },
    settings: {
        node: {
            version: '22.0.0'
        }
    },
    extends: ['eslint:recommended', 'plugin:node/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        // Indentation and Formatting
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        'comma-dangle': ['error', 'never'],
        'eol-last': ['error', 'always'],

        // Semicolon-free specific rules
        'no-unexpected-multiline': 'error',
        'semi-spacing': ['error', { before: false, after: true }],

        // Variables
        'no-var': 'error',
        'prefer-const': 'error',
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

        // Functions
        'func-style': ['error', 'declaration'],
        'arrow-body-style': ['error', 'as-needed'],
        'no-param-reassign': 'error',

        // Objects
        'object-shorthand': 'error',
        'prefer-object-spread': 'error',

        // Arrays
        'array-callback-return': 'error',
        'prefer-destructuring': ['error', { object: true, array: false }],

        // Async
        // 'no-async-promise-executor': 'error',
        'prefer-promise-reject-errors': 'error',
        'require-await': 'error',

        // Complexity
        'max-depth': ['error', 2],
        'max-nested-callbacks': ['error', 3],
        'max-params': ['error', 6],
        complexity: ['error', 15],

        // Best Practices
        curly: ['error', 'all'],
        'no-console': ['warn', { allow: ['log', 'warn', 'error'] }],
        'no-alert': 'error',
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-return-await': 'error',
        'no-useless-return': 'error',
        'no-throw-literal': 'error',
        'prefer-regex-literals': 'error',
        radix: 'error',

        // ES6+
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'no-useless-rename': 'error',

        // Node specific
        'node/no-unsupported-features/es-syntax': 'off',
        'node/no-missing-import': 'off',
        'node/no-unsupported-features/node-builtins': [
            'error',
            { version: '>=18.0.0' }
        ]
    }
}
