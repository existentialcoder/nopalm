<div align=center> <img src='./images/nopalm.png' width="50%" height="50%"> </div>

> Manage your node projects from user interface
[![Downloads](https://img.shields.io/npm/dm/nopalm.svg)](https://npmjs.com/nopalm)
[![Install size](https://packagephobia.now.sh/badge?p=nopalm)](https://packagephobia.now.sh/result?nopalm)

## RATIONALE

* Having trouble in creating and managing multiple Node.Js projects during local development? Prefer using user interfaces over CLIs for larger project management?
* `Nopalm 🔥` is a one stop graphical solution to create and manage your local Node.Js projects end to end.
* With nopalm you can create/scaffold any kind of new project using various pre-defined choices, manage existing node project and its package dependencies efficiently.
* *Why the name?* **No**de **P**roject **M**anager sounded very close to **Nopalm** (also sounding similar to `Napalm`). Hence the name (and the branding)!
* This project is heavily inspired from [Vue-UI](https://cli.vuejs.org/dev-guide/ui-api.html) and [NPM-GUI](https://www.npmjs.com/package/npm-gui) and "tries" to improve on these projects.
* *Desired Future?* Premium cloud and gen-AI features.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

## USAGE

* Install the npm package globally and run the local server inside any node project directory / empty directory
   ```shell
    npm i -g nopalm
    cd /path/to/target_dir && nopalm
   ```
* Alternatively, use npx to save the trouble of installing as well. In an empty or node project directory, run
    ```shell
    npx nopalm
    ```
* Visit [http://localhost:8001](http://localhost:8001) to start managing your node project like a pro

## To run / develop locally

#### Pre installed requirements
- **node > 10**
- **npm** or **yarn**
#### Steps
* Clone the repository
* Install packages in `client` and `server`
    ```shell
    npm i

    cd client/
    npm i
    ```
**To run the development version**
* Run the react client
    ```shell
    cd client
    npm run dev'
* Run the server in an existing node project directly without a script
    ```shell
    cd /path/to/target_node_project
    nodemon /path/to/nopalm
    ```
* Alternatively, alias the nopalm server and run
    ```shell
    echo 'alias lnopalm="node /path/to/nopalm_project"' >> ~/.zshrc
    cd /path/to/target_node_project && lnopalm
    ```
* Visit [https://localhost:3000](https://localhost:3000)
  **To run the production version**
* Build the UI and run the server alone
    ```shell
    cd client/

    <!-- Build the React client -->
    npm run build

    <!-- cd to target node project -->
    cd /path/to/target_node_project
    
    nodemon /path/to/nopalm
    ```
* Visit [https://localhost:8001](https://localhost:8001)
* Follow the same steps for testing in `empty directory`

## Testing APIs

Once you run the node server you might find [this](lib/collection/README.md) interesting to test it using Postman

## [Contributing Guidelines](.github/CONTRIBUTING.md)
