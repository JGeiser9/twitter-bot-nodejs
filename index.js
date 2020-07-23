require('dotenv').config();
var axios = require('axios');
var cron = require('node-cron');
var Twit = require('twit');
var moment = require('moment-timezone');

// Twitter credentials
const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.AUTH_TOKEN,
  access_token_secret: process.env.AUTH_TOKEN_SECRET
});

// Send the posts to twitter
function post_initial_status(incidents, current_date) {
  const date = moment.unix(current_date).format("MM-DD-YYYY");

  // Check for theft reports
  if (incidents.length) {
    incidents.map(bike => {
      const theft_date = moment.unix(bike.occurred_at).format("MM-DD-YYYY");
      let status = `${bike.title} | Stolen on ${theft_date} | ${bike.address} ${bike.source.html_url}`;

      T.post('statuses/update', { status: status }, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  } else {
    console.log(`No reports in the past 24 hours | ${date}`);
  }
}

// Hit API for theft data
async function get_data(url, current_date) {
  try {
    const response = await axios.get(url);
    post_initial_status(response.data.incidents, current_date);
  } catch (error) {
    console.error(error);
  }
}

// Run theft report at 12 every day for previous 24 hours
cron.schedule('* 12 * * *', () => {
  const yesterday_unix = moment().tz("America/Chicago").subtract(1, "days").unix();
  const today_unix = moment().tz("America/Chicago").subtract(1, "minute").unix();
  const url = `https://bikewise.org:443/api/v2/incidents?page=1&occurred_before=${today_unix}&occurred_after=${yesterday_unix}&incident_type=theft&proximity=Minneapolis&proximity_square=100`;

  get_data(url, today_unix);
});
