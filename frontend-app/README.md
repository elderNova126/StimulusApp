## Introduction
Stimulus client is an user interface application written with react.<br />
General documentation of product can be found from [here](https://getstimulus.atlassian.net/wiki/spaces/STIMULUS/pages/55246867/General+Documentation).<br />
Stage Enviroment: [app-dev.getstimulus.io](https://app-dev.getstimulus.io/)


## Get started
1. Create **.env** file inside root folder with following keys (ask your team lead for values):
  * REACT_APP_GRAPHQL_URI
  * REACT_APP_GRAPHQL_URI
  * REACT_APP_AD_INSTANCE
  * REACT_APP_AD_TENANT
  * REACT_APP_AD_SIGN_IN_POLICY
  * REACT_APP_AD_RESET_POLICY
  * REACT_APP_AD_APLICATION_ID
  * REACT_APP_AD_SCOPES


2. Run the following commands:
  * yarn install
  * yarn start:dev
  
**You are ready to go**

![](https://i.imgur.com/AlGkl02.gif)

Open [http://localhost:3006](http://localhost:3006) to view the app in the browser. <br/>
Before making you first PR, please read our [Guideline](#guideline).

## Available Scripts

In the project directory, you can run:

### `yarn install`

Install dependecies on local enviroment.

### `yarn start:dev`

Runs the app in the development mode.<br />
Open [http://localhost:3006](http://localhost:3006) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Run the tests. This command run automatically before pushing anything to the repo. If this will fail you cannot push code to repo

### `yarn test:dev`

Runs the test in watch mode. This is usefull when writing tests, you can specify to run only updated tests

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Docker build

```bash
docker build -f Dockerfile -t stimulus/frontend-app .
```

```bash
docker build -f Dockerfile -t stimulus.azurecr.io/stimulus/frontend-app:latest .

az acr login --name stimulus 

docker push stimulus.azurecr.io/stimulus/frontend-app:latest
```

## Docker run

```bash
docker run --rm --name stimulus_frontend-app -p 3006:80 stimulus/frontend-app:latest
```

## Deployment
Everything you need to know about deployment process can be found in [this article](https://blog.telexarsoftware.com/deploying-react-app-in-azure-blob-storage/)

## Guideline
This project is made
* Using latest features of ECMAScript 2020(ES2020)
  * [Whats new?](https://www.digitalocean.com/community/tutorials/js-es2020)
* Following [Airbnb Javascript Style Guide](https://github.com/airbnb/javascript)

### Folder structure overview

| Directory | What belongs here |
| ------------- |:-------------:|
| public     | Public Assets |
| src/components | Structured Components  |
| src/components/**/ | Component blueprint(index.ts) and associated style file(style.ts). <br /> Here can also be found component constants and/or high order components(HOC) for mapping and preparing the data before rendering the actual component |
| src/config | Application Config |
| src/context | Custom React Context |
| src/hooks | Custom React Hooks |
| src/i18n | Internationalization files |
| src/utils | Helper Pure Functions |

## Lib Stack
![](./public/stack.gif)
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), is build with [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) and [JSS](https://cssinjs.org) for styling components.

### List of React features we use:
* React Hooks - Building The Components  
  * [documentaion](https://reactjs.org/docs/hooks-intro.html)
* React Context - Managing The State 
  * [documentation](https://reactjs.org/docs/context.html)
* React Memo - Performance Optimization 
  * [documentation](https://reactjs.org/docs/react-api.html#reactmemo)

### Other Libs
* Material-UI - Styling(**JSS**) 
  * [documentation](https://material-ui.com/getting-started/usage/)
* Material-UI Icons
  * [icon list](https://material-ui.com/components/material-icons/)
* Internationalization - Languages support 
  * [documentation](https://react.i18next.com/)
* News API 
  * [documentation](https://newsapi.org/)
