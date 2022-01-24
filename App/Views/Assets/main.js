const singleForm   = document.querySelector( '#single-stock-form'   );
const singleInput  = document.querySelector( '#single-input'        );
const singleLike   = document.querySelector( '#single-like'         );
const singleButton = document.querySelector( '#single-search-btn'   );
singleButton.addEventListener( 'click', event => {
  if ( singleInput.value === '' )
    return singleButton.textContent = 'A stock symbol is required';
  const search = `?stock=${singleInput.value}&like=${singleLike.checked}`;
  submit( event, search );
} );
singleForm.addEventListener(  'submit', event => {
  if ( singleInput.value === '' )
    return singleButton.textContent = 'A stock symbol is required';
  const search = `?stock=${singleInput.value}&like=${singleLike.checked}`;
  submit( event, search );
} );

const multiForm    = document.querySelector( '#multi-stock-form'    );
const multiInput1  = document.querySelector( '#multi-input1'        );
const multiInput2  = document.querySelector( '#multi-input2'        );
const multiLike    = document.querySelector( '#multi-like'          );
const multiButton  = document.querySelector( '#multi-search-btn'    );
multiButton.addEventListener( 'click', event => {
  if ( multiInput1.value === '' || multiInput2.value === '' )
    return multiButton.textContent = 'Both stocks are required';
  const search = `?stock=${multiInput1.value}&stock=${multiInput2.value}&like=${multiLike.checked}`;
  submit( event, search );
} );
multiForm.addEventListener( 'submit', event => {
  if ( multiInput1.value === '' || multiInput2.value === '' )
    return multiButton.textContent = 'Both stocks are required';
  const search = `?stock=${multiInput1.value}&stock=${multiInput2.value}&like=${multiLike.checked}`;
  submit( event, search );
} );

const cardResults = document.querySelector( '#card-results' );
const results     = document.querySelector( '#results' );

const API_URL     = window.location.href + 'api/stock-prices';

const submit = ( event, search ) => {
  cardResults.classList.add( 'show' );
  results.textContent = 'Loading data. Please, wait...'
  event.preventDefault( );
  fetch( API_URL + search )
    .then( response => {
      return response.json();
    } )
    .then( data => {
      results.textContent = JSON.stringify( data );
    } )
}