"use strict"

const { Telegraf } = require('telegraf');

module.exports = function TeleBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  this.sendMessage = function sendMessage(msg) {
    return bot.telegram.sendMessage(process.env.CHAT_ID, msg);
  }
}
