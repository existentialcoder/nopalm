<!-- [![Build Status: Linux](https://travis-ci.com/sindresorhus/got.svg?branch=master)](https://travis-ci.com/github/sindresorhus/got) -->
<!-- [![Downloads](https://img.shields.io/npm/dm/got.svg)](https://npmjs.com/got) -->
<!-- [![Install size](https://packagephobia.now.sh/badge?p=got)](https://packagephobia.now.sh/result?p=got) -->

<div align=center> <img src='./images/nopalm.png' width="50%" height="50%"> </div>

> Manage your node projects from user interface

### RATIONALE
* **No**de **P**roject **M**anager sounded very close to **Nopalm**(also sounding similar to `Napalm` :)). Hence the name!
* I always faced difficulties in searching a relevant package while working on a node project and heavily craved for an UI since coming back and forth between browser and terminal killed productivity
* To solve this, I thought of developing a <span style="color:#12344d; font-weight: bold">Nopalm (Node Project Manager)</span> with an exciting web user interface to search, install and uninstall packages from a single place
* You can also scaffold a **new node project**
* This project is heavily inspired from [Vue-UI](https://cli.vuejs.org/dev-guide/ui-api.html)

### USAGE
* Install the npm package globally and run the local server inside any node project directory / empty directory
   ```shell
    npm i -g nopalm
    cd /path/to/target_dir && nopalm
   ```
* Visit [http://localhost:8001](http://localhost:8001) to start managing your node project

### To test locally
##### Pre installed requirements
- **node > 10**
- **npm** or **yarn**
##### Steps
* Clone the repository
* Go to the **`client/`** folder and create **`.env.development.local`** and copy the following content
    ```shell
    REACT_APP_API_BASE_URL='http://localhost:8001'
    ```
* Run the react client
    ```shell
    cd client
    npm i
    npm run start
* To run in an existing node project, go to the that particular directory and run this command
    ```shell
    npm run dev --prefix /path/to/nopalm
    ```
* Run the same command in an empty directory to create new node project !
* Visit [http://localhost:3000](http://localhost:3000) to run this in development mode
