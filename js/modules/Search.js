import $ from 'jquery';

class Search {
    // 1. Describe our object
    constructor() {
        this.resultsDiv = $( "#search-overlay__results" );
        this.openButton =  $( ".js-search-trigger" );
        this.closeButton =  $( ".search-overlay__close" );
        this.searchOverlay = $( ".search-overlay");
        this.searchField = $( "#search-term" );
        this.init();

        this.isOpenOverlay = false;
        this.isSpinnerVisible = false;
        this.previousValue;
        this.typingTimer;
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

        $( document ).on("keydown", ( e ) => {
            // console.log( e.keyCode );

            if( e.keyCode === 83 && !this.isOpenOverlay && !$( "input, textarea" ).is( ':focus' )) {
                this.openSearchOverlay();
            } 

            if( e.keyCode === 27 && this.isOpenOverlay ) {
                this.closeSearchOverlay();
            } 
        });

        this.searchField.on( "keyup", ( e ) => {
            this.typingLogic( e );
        });
    }

    // 3. Methods ( functions, actions...)
    typingLogic( e ) {
        if( this.previousValue != this.searchField.val() ){
            // Reset timeout
            clearTimeout( this.typingTimer );

            if( this.searchField.val() ) {
                if( !this.isSpinnerVisible )
                {
                    this.resultsDiv.html( '<div class="spinner-loader"></div>' );
                    this.isSpinnerVisible = true;
                } 
    
                this.typingTimer = setTimeout(( ) => {
                    // console.log( e.target.values );
                    this.getResults( e );
                }, 2000);
            } else {
                this.resultsDiv.html( '' );
                this.isSpinnerVisible = false;
            }


        }

        this.previousValue = this.searchField.val();
    }

    getResults( e ) {
        this.resultsDiv.html( "Imagine Real results..." + e.target.value );

        this.isSpinnerVisible = false;
    }

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