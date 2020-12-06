if( typeof (gtag) === 'function' ) {

  let gaTrackingId = null
  document.addEventListener('turbolinks:load', (event) => {
    if(gaTrackingId == null){
      // Lets store the Tracking ID
      gaTrackingId = window.dataLayer[1][1];
      // Assume standard tracking code has pushed the initial pageview
      return
    }
    else {
      // Register the pageview.
      gtag('config', gaTrackingId, {
        page_location: event.data.url
      })
    }
  })
}