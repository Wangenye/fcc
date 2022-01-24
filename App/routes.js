'use strict';

const express         = require( 'express' );
const router          = express.Router();
const StockController = require( './Controllers/StockController' );

const ROOT   = '/';
const API    = '/api/stock-prices';
const stocks = new StockController( );

router.get( ROOT, ( req,res ) => {
  res.render( 'index' );
} );

router.get( API, async ( req,res ) => {
  if ( req.query.stock )
    res.send( await stocks.getStocks( req ) );
  else
    res.status( 400 ).send( 'Error: A stock must be provided (e.g. /api/stock-prices?stock=goog)' );
} );

module.exports = router;