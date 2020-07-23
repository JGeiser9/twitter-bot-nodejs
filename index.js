require('dotenv').config();
const cron = require('node-cron');
const Twit = require('twit');

// Twitter Credentials
const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.AUTH_TOKEN,
  access_token_secret: process.env.AUTH_TOKEN_SECRET
});

function get_status() {
  const status = "this is a test tweet";
  post_status(status);
}

function post_status(status) {
  T.post('statuses/update', { status: status }, (err, data, response) => {
    err ? console.log(err) : console.log('Success: ' + data.text);
  });
}

cron.schedule('* * * * *', () => {
  get_status();
});
