<?php
/*
Plugin Name: Chrissy
Description: This plugin will add a speech navigation to the front end of your website.
Version: 1.2
Author: GeroNikolov
Author URI: http://geronikolov.com
License: GPLv2
*/

class CHRISSY {
	function __construct(){
		add_action( 'wp_enqueue_scripts', array( $this, 'register_front_JS' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_front_CSS' ) );
	}

	function __destruct(){}

	//Register frontend JS
	function register_front_JS() {
		wp_enqueue_script( 'crsy-front-js', plugins_url( '/assets/front.js' , __FILE__ ), array('jquery'), '1.0', true );
	}
	//Register frontend CSS
	function register_front_CSS() {
		wp_enqueue_style( 'crsy-front-css', plugins_url( '/assets/front.css', __FILE__ ), array(), '1.0', 'screen' );
	}
}

$_CHRISSY_ = new CHRISSY;
?>
