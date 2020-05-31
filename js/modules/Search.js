import $ from 'jquery';

class Search {
    // 1. Describe our object
    constructor() {
        this.openButton =  $( ".js-search-trigger" );
        this.closeButton =  $( ".search-overlay__close" );
        this.searchOverlay = $( ".search-overlay");
        this.init();

        this.isOpenOverlay = false;
    }

    // 2. Events triggered on construnction
    init() {
        // Open search Overlay
        this.openButton.on( 'click', () => {
            this.openSearchOverlay();
        });

        // Close search Oververlay
        this.closeButton.on( 'click', () => {
            this.closeSearchOverlay();
        });

        $( document ).on("keyup", ( e ) => {
            // console.log( e.keyCode );

            if( e.keyCode === 83 && !this.isOpenOverlay ) {
                this.openSearchOverlay();
            } 

            if( e.keyCode === 27 && this.isOpenOverlay ) {
                this.closeSearchOverlay();
            } 
        });
    }

    // 3. Methods ( functions, actions...)
    openSearchOverlay() {
        this.searchOverlay.addClass( "search-overlay--active" );

        // remove page scrolling
        $( "body" ).addClass( "body-no-scroll" );

        // set to open Overlay
        this.isOpenOverlay = true;
    }

    closeSearchOverlay() {
        this.searchOverlay.removeClass( "search-overlay--active" );
        // get back page scrolling
        $( "body" ).removeClass( "body-no-scroll" );

        // set to not open Overlay
        this.isOpenOverlay = false;
    }

}

export default Search;