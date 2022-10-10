# LNCrawler Website

LNCrawler Website is a react web frontend for [lightnovel-crawler](https://github.com/dipu-bd/lightnovel-crawler).
The aim is to create a light novel and web novel aggregator website with an user-generated database from more than 200+ sources.



- [LNCrawler Website](#lncrawler-website)
  - [to get started](#to-get-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Start the website](#start-the-website)
    - [Run the developpement server](#run-the-developpement-server)
    - [Run the production server](#run-the-production-server)
  - [Build with](#build-with)
  - [Authors](#authors)
  
  
## to get started

### Prerequisites


You will need 
- [python](https://www.python.org/) to run the backend 
- [nodejs](https://nodejs.org/en/) for the front-end
- [git](https://git-scm.com/downloads) to download and update the code.


### Installation

- First clone the repository:

```bash
$ git clone https://github.com/jere344/lightnovel-crawler.git
```

- Open command prompt inside of the project folder and install requirements:

```bash
$ pip install -r requirements.txt
$ pip install -r requierements-bot.txt
```

- Move into lncrawl/bots/web2/react-app/ and install requirements :

```bash
$ npm install
```

## Start the website

### Run the developpement server

- First start the backend bot

```bash
python lncrawl --bot web2
```

- Then start the frontend server
```bash
$ cd lncrawl/bots/web2/react-app
$ npm start
```

### Run the production server
You will need to install serve
```bash
cd lncrawl/bots/web2/react-app
$ npm install -g serve
```

- First put the backend bot in production mode :
```
edit lncrawl\bots\web2\__init__.py and follow the commented instructions
```

- Start the backend bot
```bash
python lncrawl --bot web2
```

- Build the frontend
```bash
$ cd lncrawl/bots/web2/react-app
$ npm run build
```

- Serve the frontend server
```bash
$ cd lncrawl/bots/web2/react-app
$ serve -s build
```

You will need to redirect http://yourdomain.com/ to the frontend server and http://yourdomain.com/api/ to the backend bot


For https you will need 
- a reverse proxy like nginx or apache
- edit lncrawl\bots\web2\react-app\.env and set HTTPS=true



## Build with

* [lightnovel-crawler](https://github.com/dipu-bd/lightnovel-crawler) - LNCrawler Website is based on lightnovel-crawler
* [React](https://reactjs.org/) - The web framework used
* [python](https://www.python.org/) - The backend language



## Authors

* [@jere344](https://github.com/jere344)


And all the contributors of [lightnovel-crawler](https://github.com/dipu-bd/lightnovel-crawler)


___


More general informations can be found in the [lightnovel-crawler](https://github.com/dipu-bd/lightnovel-crawler) repository.
