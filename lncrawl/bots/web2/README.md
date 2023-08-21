# LNCrawler Website

LNCrawler Website is a react web frontend for [lightnovel-crawler](https://github.com/dipu-bd/lightnovel-crawler).
The aim is to create a light novel and web novel aggregator website with an user-generated database from more than 200+ sources.

A live demo is availible at https://lncrawler.monster/


- [LNCrawler Website](#lncrawler-website)
  - [to get started](#to-get-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Start the website](#start-the-website)
    - [Run the developpement server](#run-the-developpement-server)
    - [Run the production server](#run-the-production-server)
  - [Build with](#build-with)
  - [Authors](#authors)
- [More informations](#more-informations)
- [Pictures](#pictures)
  
  
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
$ pip install -r requirements-bot.txt
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

- Edit the configuration file `lncrawl/bot/web2/flask_api/config.json` with your domain name:
```json 
"website_url": "https://lncrawler.monster",
"api_url": "https://api.lncrawler.monster",
```

- Copy the configuration file to the frontend folder :
```bash
$ cp "lncrawl/bots/web2/flask_api/config.json" "lncrawl/bots/web2/react-app/src/"
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

For the rest you will need some kind of reverse proxy like nginx or apache2 to serve the backend and the frontend.

## Build with

* [lightnovel-crawler](https://github.com/dipu-bd/lightnovel-crawler) - LNCrawler Website is based on lightnovel-crawler
* [React](https://reactjs.org/) - The web framework used
* [python](https://www.python.org/) - The backend language



## Authors

* [@jere344](https://github.com/jere344)


And all the contributors of [lightnovel-crawler](https://github.com/dipu-bd/lightnovel-crawler)


___

# More informations

More general informations can be found in the [lightnovel-crawler](https://github.com/dipu-bd/lightnovel-crawler) repository.


# Pictures

![FireShot Capture 002 - Read Light Novels Online For Free - LnCrawler - localhost](https://user-images.githubusercontent.com/86294972/195616533-fd60cfc0-8ecf-4132-9738-db52a68567e8.png)
![FireShot Capture 003 - Read Light Novels Online For Free - LnCrawler - localhost](https://user-images.githubusercontent.com/86294972/195616566-92042fde-f414-4b00-ae0d-2cce81fe217a.png)


Adding a novel :

![FireShot Capture 006 - Add instantly a new novel to LnCrawler database from more than 140 so_ - localhost](https://user-images.githubusercontent.com/86294972/195616687-5788fd10-f6bd-4fcb-b520-a7eaa32affbd.png)
![FireShot Capture 008 - Add instantly a new novel to LnCrawler database from more than 140 so_ - localhost](https://user-images.githubusercontent.com/86294972/195616702-17187538-0164-4e9a-b183-3da4ba701d88.png)
![FireShot Capture 009 - Add instantly a new novel to LnCrawler database from more than 140 so_ - localhost](https://user-images.githubusercontent.com/86294972/195616958-3bf6a75c-0872-443e-a316-f3f00e1b8ac7.png)
![FireShot Capture 010 - Add instantly a new novel to LnCrawler database from more than 140 so_ - localhost](https://user-images.githubusercontent.com/86294972/195616741-dc5aa5c9-84d2-48e7-80b9-9134e93543a9.png)
![FireShot Capture 004 - Read Le Maître Des Secrets in French for free - LnCrawler - localhost](https://user-images.githubusercontent.com/86294972/195616756-4e6aba97-8689-4095-8c49-514b54a7180e.png)
![FireShot Capture 005 - Read Light Novels Online For Free - LnCrawler - localhost](https://user-images.githubusercontent.com/86294972/195616767-8d957bc4-644d-4709-a00b-61363f18e1ff.png)
