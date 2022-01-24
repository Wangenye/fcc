const chaiHttp  = require( 'chai-http' );
const chai      = require( 'chai' );
const expect    = chai.expect;
const server    = require( '../Main' );

chai.use( chaiHttp );

const ENDPOINT = '/api/stock-prices';

suite( 'Functional Tests', function ( ) {
    
    suite( 'GET /api/stock-prices => stockData object', function ( ) {

      this.timeout(4000);
      
      let numLikes = 0;
 
      test( '1 stock', done => {
       chai.request( server )
        .get( '/api/stock-prices' )
        .query( { stock: 'goog' } )
        .end( ( err, res ) => {
          expect( res.status ).to.equal( 200 );
          expect( res.body.stockData.stock, 'response stockData.stock should match "GOOG"' )
                  .to.equal( 'GOOG' );
          expect( res.body.stockData.price, 'response stockData.price should be a number' )
                  .is.a( 'number' );
          expect( res.body.stockData.likes, 'response stockData.likes should be a number' )
                  .is.a( 'number' );
          setTimeout( ( ) => {
            numLikes = res.body.stockData.likes;
            done( );
          }, 300 );
        } );
      } );

      test( '1 stock with like', done => {
       chai.request( server )
        .get( '/api/stock-prices' )
        .query( { stock: 'goog', like: true } )
        .end( ( err, res ) => {
          expect( res.status ).to.equal( 200 );
          expect( res.body.stockData.stock, 'response stockData.stock should match "GOOG"' )
                  .to.equal( 'GOOG' );
          expect( res.body.stockData.price, 'response stockData.price should be a number' )
                  .is.a( 'number' );
          expect( res.body.stockData.likes, 'response stockData.likes should be a number' )
                  .is.a( 'number' );
          expect( res.body.stockData.likes, 'response stockData.likes should be incremented by one' )
                  .to.equal( numLikes );
          setTimeout( done, 300 );
        } );
      } );

      test( '1 stock with like again (ensure likes arent double counted)', done => {
        chai.request( server )
        .get( '/api/stock-prices' )
        .query( { stock: 'goog', like: true } )
        .end( ( err, res ) => {
          expect( res.status ).to.equal( 200 );
          expect( res.body.stockData.stock, 'response stockData.stock should match "GOOG"' )
                  .to.equal( 'GOOG' );
          expect( res.body.stockData.price, 'response stockData.price should be a number' )
                  .is.a( 'number' );
          expect( res.body.stockData.likes, 'response stockData.likes should be a number' )
                  .is.a( 'number' );
          expect( res.body.stockData.likes, 'response stockData.likes should NOT be incremented' )
                  .to.equal( numLikes );
          setTimeout( done, 300 );
        } );
      } );

      test( '2 stocks', done => {
        chai.request( server )
        .get( '/api/stock-prices' )
        .query( { stock: [ 'AAPL', 'MSFT' ] } )
        .end( ( err, res ) => {
          expect( res.status ).to.equal( 200 );
          expect( res.body.stockData[0].stock, 'response stockData[0].stock should match "AAPL"' )
                  .to.equal( 'AAPL' );
          expect( res.body.stockData[0].price, 'response stockData[0].price should be a number' )
                  .is.a( 'number' );
          expect( res.body.stockData[0].rel_likes, 'response stockData[0].rel_likes should be a number' )
                  .is.a( 'number' );
          expect( res.body.stockData[1].stock, 'response stockData[1].stock should match "MSFT"' )
                  .to.equal( 'MSFT' );
          expect( res.body.stockData[1].price, 'response stockData[1].price should be a number' )
                  .is.a( 'number' );
          expect( res.body.stockData[1].rel_likes, 'response stockData[1].rel_likes should be a number' )
                  .is.a( 'number' );
          numLikes = [ res.body.stockData[0].rel_likes, res.body.stockData[1].rel_likes ];
          setTimeout( done, 300 );
        } );
      } );

      test( '2 stocks with like', done => {
        chai.request( server )
        .get( '/api/stock-prices' )
        .query( { stock: [ 'AAPL', 'MSFT' ], like: true } )
        .end( ( err, res ) => {
          expect( res.status ).to.equal( 200 );
          expect( res.body.stockData[0].stock, 'response stockData[0].stock should match "AAPL"' )
                  .to.equal( 'AAPL' );
          expect( res.body.stockData[0].price, 'response stockData[0].price should be a number' )
                  .is.a( 'number' );
          expect( res.body.stockData[0].rel_likes, 'response stockData[0].rel_likes should be a number' )
                  .is.a( 'number' );
          expect( res.body.stockData[1].stock, 'response stockData[1].stock should match "MSFT"' )
                  .to.equal( 'MSFT' );
          expect( res.body.stockData[1].price, 'response stockData[1].price should be a number' )
                  .is.a( 'number' );
          expect( res.body.stockData[1].rel_likes, 'response stockData[1].rel_likes should be a number' )
                  .is.a( 'number' );
          expect( res.body.stockData[0].rel_likes, 'response stockData[0].rel_likes should be the difference' )
                  .to.equal( numLikes[0] - numLikes[1] );
          expect( res.body.stockData[1].rel_likes, 'response stockData[1].rel_likes should be the difference' )
                  .to.equal( numLikes[1] - numLikes[0] );
          setTimeout( done, 300 );
        } );
      } );

    });

});
