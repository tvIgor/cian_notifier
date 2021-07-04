"use strict"

const TeleBot = require('./teleBot');
const CianDB = require('./cianDB');
const Cian = require('./cian');

const teleBot = new TeleBot();
const cianDB = new CianDB();

const interval = 1000 * 60 * 60 * process.env.BOT_TOKEN;

cianDB.init().then(() => {
  setInterval(async () => {
    try {
      const offers = await Cian.getOffers();
      const newOffers = await cianDB.getNewOffers(offers);
  
      for (const offer of newOffers)
        teleBot.sendMessage(offer.link);
    }
    catch (err) {
      teleBot.sendMessage("Error: " + err);
    }
  }, interval);
});
