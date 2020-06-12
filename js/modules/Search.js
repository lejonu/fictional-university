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
            return false;
        });

        // Close search Oververlay
        this.closeButton.on( 'click', () => {
            this.closeSearchOverlay();
        });

        $( document ).on("keydown", ( e ) => {
            // console.log( e.keyCode );

            if( e.keyCode === 83 && !this.isOpenOverlay && !$( "input, textarea" ).is( ':focus' )) {
                this.openSearchOverlay( );
                return false;
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
                    this.getResults( );
                }, 750);
            } else {
                this.resultsDiv.html( '' );
                this.isSpinnerVisible = false;
            }
        }

        this.previousValue = this.searchField.val();
    }

    getResults( ) {

        $.getJSON( `${ universityData.root_url }/wp-json/university/v1/search?term=${ this.searchField.val() }`, ( results ) => {
            this.resultsDiv.html( `
            <div class="row">
                <div class="one-third">
                    <h2 class="search-overlay__section-title">General Information</h2>
                        
                ${ results.generalInfo.length ? '<ul class="link-list min-list">' : '<p>No General Information found to: ' +  this.searchField.val() + '</p>' }

                ${ results.generalInfo.map( item => `
                <li><a href="${ item.permalink }">${ item.title }</a> ${ item.postType === 'post' ? `by ${ item.authorName } ` : '' } </li>
            `).join( '' )}

                ${ results.generalInfo.length ? '</ul>' : '' }
            
                </div>
                <div class="one-third">
                    <h2 class="search-overlay__section-title">Programs</h2>
                    ${ results.programs.length ? '<ul class="link-list min-list">' : `<p>No Programs Information found. <a href="${ universityData.root_url }/programs">View all Programs </a>` } </p> 

                    ${ results.programs.map( item => `
                    <li><a href="${ item.permalink }">${ item.title }</a> </li>
                `).join( '' )}
    
                    ${ results.professors.length ? '</ul>' : '' }
                    
                    <h2 class="search-overlay__section-title">Professors</h2>
                    ${results.professors.length ? '<ul class="professor-cards">' : `<p>No professors match that search.</p>`}
                      ${results.professors.map(item => `
                        <li class="professor-card__list-item">
                          <a class="professor-card" href="${item.permalink}">
                            <img class="professor-card__image" src="${item.image}">
                            <span class="professor-card__name">${item.title}</span>
                          </a>
                        </li>
                      `).join('')}
                    ${results.professors.length ? '</ul>' : ''}
                </div>
                <div class="one-third">
                    <h2 class="search-overlay__section-title">Events</h2>

                    ${results.events.length ? '' : `<p>No Events Information found. <a href="${ universityData.root_url }/events">View all Events </a></p> ` } 
                      ${results.events.map(item => `
                      <div class="event-summary">
                      <a class="event-summary__date t-center" href="${ item.permalink }">
                          <span class="event-summary__month">${ item.month }</span>
                          <span class="event-summary__day">${ item.day }</span>  
                      </a>
                      <div class="event-summary__content">
                          <h5 class="event-summary__title headline headline--tiny"><a href="${ item.permalink }">${ item.title }</a></h5>
                          <p>${ item.description } <a href="${ item.permalink }" class="nu gray">Learn more</a></p>
                      </div>
                  </div>
                      `).join('')}
                    
                </div>
            </div>
            ` );

            this.isSpinnerVisible = false;
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