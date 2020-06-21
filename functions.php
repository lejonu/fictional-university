<?php

require get_theme_file_path( '/inc/search-route.php' );
require get_theme_file_path( '/inc/like-route.php' );



function university_custom_rest() {
    register_rest_field(  'post', 'authorName', array(
        'get_callback' => function() {
            return get_the_author();
        }
    ));
    register_rest_field(  'note', 'userNoteCount', array(
        'get_callback' => function() {
            return count_user_posts( get_current_user_id(), 'note' );
        }
    ));
}

add_action( 'rest_api_init', 'university_custom_rest' );

function pageBanner( $args = NULL ) {
    
    if( !$args['title'] ) {
        $args['title'] = get_the_title();
    }

    if( !$args[ 'subtitle' ] ) {
        $args[ 'subtitle' ] = get_field( 'page_banner_subtitle' );
    }

    if( !$args[ 'photo'] ) {
        if( get_field( 'page_banner_image' ) ) {
            $args[ 'photo'] = get_field( 'page_banner_image' )[ 'sizes' ][ 'pageBanner' ];
        } else {
            $args[ 'photo'] = get_theme_file_uri('/images/ocean.jpg');
        }
    }

    ?>

    <div class="page-banner">
        <div class="page-banner__bg-image" style="background-image: url(<?php echo $args[ 'photo' ];?>">
        </div>
        <div class="page-banner__content container container--narrow">
            <h1 class="page-banner__title"><?php echo $args['title'];?></h1>
            <div class="page-banner__intro">
                <p><?php echo $args[ 'subtitle' ];?></p>
            </div>
        </div>  
    </div>

    <?php
}

function universityFiles() {
    wp_enqueue_script( 'main-unversity-js', get_theme_file_uri('/js/scripts-bundled.js'), NULL, microtime(), true);

    wp_enqueue_style( 'font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

    wp_enqueue_style( 'custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');

    wp_enqueue_style( 'universityMainStyles', get_stylesheet_uri(), NULL, microtime() );

    wp_localize_script( 'main-unversity-js', 'universityData', array(
        'root_url' => get_site_url(),
        'nonce' => wp_create_nonce( 'wp_rest' )
    ));
}

add_action( 'wp_enqueue_scripts', 'universityFiles' );

function universityFeatures() {
    // register_nav_menu( 'headerMenuLocation', 'Header Menu Location' ); 
    // register_nav_menu( 'footerLocationOne', 'Footer Location One' ); 
    // register_nav_menu( 'footerLocationTwo', 'Footer Location Two' ); 

    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'post-thumbnails', array( 'post','professor' ) );
    add_image_size( 'professorLandscape', 400, 260, true );
    add_image_size( 'professorPortrait', 480, 650, true );
    add_image_size( 'pageBanner', 1500, 350, true );
}

add_action( 'after_setup_theme', 'universityFeatures' );

function universityAdjustQueries( $query ) {
    if( !is_admin() AND is_post_type_archive( 'event' ) AND $query->is_main_query()) {
        $today = date( 'Ymd' );
        $query->set( 'meta_key', 'event_date' );
        $query->set( 'orderby', 'meta_value_num' );
        $query->set( 'order', 'ASC' );
        $query->set( 'meta_query', array(
            'key' => 'event_date',
            'compare' => '>=',
            'value' => $today,
            'type' => 'numeric'
        ) );
    }

    if( !is_admin() AND is_post_type_archive( 'program' ) AND $query->is_main_query()) {
        $query->set( 'orderby', 'title' );
        $query->set( 'order', 'ASC' );
        $query->set( 'posts_per_page', -1 );
    }
}

add_action( 'pre_get_posts', 'universityAdjustQueries' );


// Redirect subscriber account out of admin and onto homepage

function redirectSubsToFrontend() {
    $ourCurrentUser = wp_get_current_user();
    
    if( count( $ourCurrentUser->roles ) == 1  AND $ourCurrentUser->roles[0] == 'subscriber' ){
        wp_redirect( site_url( '/' ) );
        exit;
    }
}

add_action( 'admin_init', 'redirectSubsToFrontend');

function noSubsAdminBar() {
    $ourCurrentUser = wp_get_current_user();
    
    if( count( $ourCurrentUser->roles ) == 1  AND $ourCurrentUser->roles[0] == 'subscriber' ){
        show_admin_bar( false );
    }
}

add_action( 'wp_loaded', 'noSubsAdminBar');


// Customize Login Screen

function ourHeaderUrl() {
    return esc_url(site_url( '/' ));
}

add_filter( 'login_headerurl', 'ourHeaderUrl' );

function ourLoginCSS(){
    wp_enqueue_style( 'universityMainStyles', get_stylesheet_uri(), NULL, microtime() );

    wp_enqueue_style( 'custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');

}

add_action( 'login_enqueue_scripts', 'ourLoginCSS' );

function ourLoginTitle() {
    return get_bloginfo( 'name' );
}

add_filter( 'login_headertext', 'ourLoginTitle' );

// Force note posts to be private

function makeNotePrivate( $data, $postarr ) {

    if ( $data[ 'post_type' ] == 'note') {
        if ( count_user_posts( get_current_user_id(), 'note' ) > 4 AND !$postarr[ 'ID'] ) {
            die( "You have reached your note limit." );
        }

        $data[ 'post_title' ] = sanitize_text_field( $data[ 'post_title' ] );
        $data[ 'post_content' ] = sanitize_textarea_field( $data[ 'post_content' ] );
    }
    
    if ( $data[ 'post_type' ] == 'note' AND $data[ 'post_status' ] != 'trash' ) {
        $data[ 'post_status' ] = 'private';
    }
    
    return $data;
}

add_filter( "wp_insert_post_data", "makeNotePrivate", 10, 2);