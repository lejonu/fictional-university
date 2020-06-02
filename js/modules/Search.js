import $ from 'jquery';

class Search {
    // 1. Describe our object
    constructor() {
        this.addSearchHTML();
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
                this.openSearchOverlay( );
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
                }, 750);
            } else {
                this.resultsDiv.html( '' );
                this.isSpinnerVisible = false;
            }
        }

        this.previousValue = this.searchField.val();
    }

    getResults( e ) {

        $.getJSON( `${ universityData.root_url }/wp-json/wp/v2/posts?search=${ this.searchField.val() }`, posts => {
            $.getJSON( `${ universityData.root_url }/wp-json/wp/v2/pages?search=${ this.searchField.val() }`, pages => {
               
               let combinedResults = posts.concat( pages );
               
                let htmlCode = `
                <h2 class="search-overlay__section-title">General Information</h2>
    
                ${ combinedResults.length ? '<ul class="link-list min-list">' : '<p>No General Information found to: ' +  this.searchField.val() + '</p>' }
    
                ${ combinedResults.map( item => `
                    <li><a href="${ item.link }">${ item.title.rendered }</a>
                `).join( '' )}
    
                ${ combinedResults.length ? '</ul>' : '' }
                
                `;
    
                this.resultsDiv.html( htmlCode  );    
    
                this.isSpinnerVisible = false;
            });


        });       
    }

    openSearchOverlay() {
        this.searchOverlay.addClass( "search-overlay--active" );

        // remove page scrolling
        $( "body" ).addClass( "body-no-scroll" );

        this.searchField.val('');

        setTimeout(() => {
            this.searchField.focus();
        }, 301);
              
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

    addSearchHTML() {
        $( "body" ).append( `
  
        <div class="search-overlay">
            <div class="search-overlay__top">
                <div class="container">
                    <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>                              
                    <input type="text" class="search-term" id="search-term" placeholder="What are you looking for?">
                    <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
                </div> 
            </div>

            <div class="container">
                <div id="search-overlay__results">
                </div>
            </div>
        </div>

        `);
    }

}

export default Search;