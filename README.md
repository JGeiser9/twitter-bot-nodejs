# twitter-bot-nodejs

A simple ```Node``` Twitter bot scheduled to run every day at 12:00 CST. Theft reports tweeted out each day are the previous day's reports.

Bike theft is common here in Minneapolis. ```@Mpls_Cycling``` taps into the Bike Index API and tweets out any bicycles that were reported stolen within the greater Minneapolis area.

# Working Demo
https://twitter.com/mpls_cycling

# Tools Used

 - Node
 - Docker
 - DockerHub
 - Digital Ocean
 - Twit
 - Axios
 - Cron
 - Moment

# Getting Started

### Clone

```
git clone https://github.com/JGeiser9/twitter-bot-nodejs.git
```

### Install Dependencies

```
npm install
```

### Starting the Bot

When you start the bot, it will run continuously and log messages to the server depending on whether a report was found or not and if it was successfully tweeted.

```
npm start
```
