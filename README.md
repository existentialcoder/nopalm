<!-- [![Build Status: Linux](https://travis-ci.com/sindresorhus/got.svg?branch=master)](https://travis-ci.com/github/sindresorhus/got) -->
<!-- [![Downloads](https://img.shields.io/npm/dm/got.svg)](https://npmjs.com/got) -->
<!-- [![Install size](https://packagephobia.now.sh/badge?p=got)](https://packagephobia.now.sh/result?p=got) -->

<div align=center> <img src='./images/nopalm.png' width="50%" height="50%"> </div>

> Manage your node projects from user interface

## RATIONALE

* **No**de **P**roject **M**anager sounded very close to **Nopalm**(also sounding similar to `Napalm` :)). Hence the name!
* I always faced difficulties in searching a relevant package while working on a node project and heavily craved for an UI since coming back and forth between browser and terminal killed productivity
* To solve this, I thought of developing <span style="color:#12344d; font-weight: bold">Nopalm (Node Project Manager)</span> with an exciting web user interface to search, install and uninstall packages from a single place
* You can also scaffold a **new node project**
* This project is heavily inspired from [Vue-UI](https://cli.vuejs.org/dev-guide/ui-api.html)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

## USAGE

* Install the npm package globally and run the local server inside any node project directory / empty directory
   ```shell
    npm i -g nopalm
    cd /path/to/target_dir && nopalm
   ```
* Visit [http://localhost:8001](http://localhost:8001) to start managing your node project

## To run locally

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
* Add this **.env** file in the `/client` folder 
    ```shell
    echo "REACT_APP_API_BASE_URL='http://localhost:8001'" >> .env.development.local`
    ```
* Run the react client
    ```shell
    cd client
    npm run start
* Run the server in an existing node project
    ```shell
    cd /path/to/target_node_project
    npm run dev --prefix /path/to/nopalm
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
    
    npm run start --prefix /path/to/nopalm
    ```
* Visit [https://localhost:8001](https://localhost:8001)
* Follow the same steps for testing in `empty directory`

## Testing APIs

Once you run the node server you might find [this](lib/collection/README.md) interesting to test it using Postman

## [Contributing Guidelines](.github/CONTRIBUTING.md)