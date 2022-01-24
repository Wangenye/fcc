'use strict';

const DB         = require( '../Controllers/DB' );
const LikeModel  = require( '../Models/LikeModel' );
const axios      = require( 'axios' );

const APIURL = `https://api.iextrading.com/1.0/stock/`;

module.exports = class StockController {

  constructor ( req ) {
    new DB( ).connect( );
    this.likeModel = new LikeModel( );
  }

  async setNewLike ( symbol,ip ) {
    const results = await this.likeModel.likeASymbol( symbol, ip );
    return results;
  }

  async getStocks ( req ) {
    const symbol = req.query.stock;
    const like   = req.query.like === undefined ? false : req.query.like !== 'false';
    const ip     = req.ip;

    // If two symbols were passed.
    if ( Array.isArray( symbol ) ) {
      const stock1 = await this.getOneStock( symbol[0], like, ip );
      const stock2 = await this.getOneStock( symbol[1], like, ip );

      if ( stock1.ERROR || stock2.ERROR )   return stock1.ERROR || stock2.ERROR

      return {
        'stockData' : [
          { stock : stock1.symbol, price : stock1.price, rel_likes : stock1.likes-stock2.likes },
          { stock : stock2.symbol, price : stock2.price, rel_likes : stock2.likes-stock1.likes }
        ]
      };
    }

    // If only one symbol was passed.
    const stock = await this.getOneStock( symbol, like, ip );
    if ( stock.ERROR )  return stock.ERROR
    return { 'stockData' : { stock: stock.symbol, price: stock.price, likes: stock.likes } };

  }

  async getOneStock ( symbol, like, ip ) {
    symbol = symbol.toUpperCase( );
    // Stores one like in the database for the stock linked to this IP if a "like" query parameter
    // has been passed and if there is no likes for the stock linked to the given IP yet.
    if ( like ) {
      const newLike = await this.setNewLike( symbol, ip );
    }
    // Retrieves the number of likes for the given symbol from the database.
    const likes = await this.likeModel.getLikes( symbol );
    // Retrieves the stock data from the external API and returns a JSON object with
    // the values for the stock name, price on close, and number of likes for the given stock.
    const results = await axios.get( APIURL + symbol + '/price' )
      .then( res => {
        return { symbol, price: res.data, likes };
      } )
      .catch( error => {
        console.log( { ERROR: 'Something went wrong while trying to access stock data. Please, try again.' } );
        return { ERROR: 'Something went wrong while trying to access stock data. Please, try again.' }
      } );

    return results;
  }

}