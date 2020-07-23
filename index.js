require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');
const Twit = require('twit');

// Twitter credentials
const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.AUTH_TOKEN,
  access_token_secret: process.env.AUTH_TOKEN_SECRET
});

// Send the post to twitter
function post_status(status) {
  T.post('statuses/update', { status: status }, (err, data) => {
    err ? console.log(err) : console.log('Success: ' + data.text);
  });
}

// Build out a tweet for each theft report
function build_status(data) {
  data.map(bike => {
    let status = `
      Bike: ${bike.title}
      Info: ${bike.description}
      Where: ${bike.address}
      Date: ${bike.occurred_at}
    `;

    post_status(status);
  });
};

// Hit API for theft data
async function get_data(url) {
  try {
    const response = await axios.get(url);
    build_status(response.data.incidents);
  } catch (error) {
    console.error(error);
  }
}

// Run theft report every Thursday at 12:00 PM
cron.schedule('46 11 * * *', () => {
  // Variable for current unix timestamp when job is run
  // Variable of converted timestamp to America/Chicago timezone?
  // Variable for a timestamp from one week ago
  // Build out the API URL
  const url = "https://bikewise.org:443/api/v2/incidents?page=1&occurred_after=1594857600&incident_type=theft&proximity=Minneapolis&proximity_square=100";

  get_data(url);
});
