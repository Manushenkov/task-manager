## Getting started

<b> use node version 20 </b>

I tested the app and the dev commands on both macos and ubuntu

#### run the project
```bash
npm i
npm run dev
```

#### Running autotests
```bash
npm run test
```

#### Linting
```bash
npm run lint
npm run lint:fix
```

### Contributing
After creating a PR request, tests and linter are run automatically in github

Check the `mock-workflow-failure` merge request to see a failed linter and test example


## Simulate errors
just change the default error chance in taskManager.ts
```js
const simulateError = (errorChancePercentage: number = 30): void => {
```

## Things to make a note of
An effort was put into making the app accessible, it's usable with keyboard only!

I added `eslint-plugin-react` to sort props and `eslint-plugin-import` to sort imports, this speeds up code review and reduces manual work

I added `prettier` and `husky` to remove stylistic nitpicks from code reviews

`react-error-boundary` package is used because it's suggested in react docs

Dark theme was added as a bonus

Localization added as a bonus