module.exports = {
	env: {
		// 사전 정의된 전역 변수 사용을 정의
		browser: true,
		es6: true,
		node: true,
	},
	extends: [
		// 추가한 플러그인에서 사용할 규칙을 설정하는 곳
		// plugins에만 플러그인을 추가한다 해서 규칙이 적용되지 않고 extend에 등록해줘야만 규칙이 적용됨.
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'airbnb',
		'plugin:prettier/recommended',
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		// ESLint 사용을 위해 지원하려는 JavaScript 언어 옵션을 지정
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
	rules: {
		'react/react-in-jsx-scope': 0,
		'react/prefer-stateless-function': 0,
		'react/jsx-filename-extension': 0,
		'react/jsx-one-expression-per-line': 0,
		'no-nested-ternary': 0,
	},
};
