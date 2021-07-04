"use strict"

const { Client } = require('pg');

const OFFERS_TABLE = "offers";
const STATE_TABLE = "dbstate";

module.exports = function CianDB() {
  
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
  });

  this.init = function init() {
    return client.connect();
  }

  this.getNewOffers = async function getNewOffers(offers) {
    const isFirstRun = await isFirstRunCheck();
    if (isFirstRun) {
      await registerFirstRun();
      await putOffers(offers);
      return [];
    }

    const newOffers = await filterNewOffers(offers);
    await cleanDB();
    await putOffers(offers);
    return newOffers;
  }

  this.close = async function close() {
    return client.end();
  }

  async function isFirstRunCheck() {
    const response = await client.query(`SELECT * FROM ${STATE_TABLE}`);
    if (!response.rowCount)
      throw new Error(`${STATE_TABLE} table is empty`);
    
    const row = response.rows[0];
    if (row.firstrun)
      return true;

    return false;
  }

  async function filterNewOffers(offers) {
    const newOffers = [];
    
    for (const offer of offers) {
      const isKnown = await isKnownOffer(offer);
      if (!isKnown) newOffers.push(offer);
    }

    return newOffers;
  }

  async function isKnownOffer(offer) {
    const response = await client.query(`SELECT 1 FROM ${OFFERS_TABLE} where link='${offer.link}'`);
    if (response.rowCount)
      return true;

    return false;
  }

  function registerFirstRun() {
    return client.query(`UPDATE ${STATE_TABLE} SET firstRun=false`);
  }

  function cleanDB() {
    return client.query(`TRUNCATE ONLY ${OFFERS_TABLE}`);
  }

  async function putOffers(offers) {
    for (const offer of offers)
      await client.query(`INSERT INTO ${OFFERS_TABLE} VALUES('${offer.link}')`);
  }
}
