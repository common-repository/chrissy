var stop = false;

jQuery( document ).ready( function(){
	if ( 
		typeof( SpeechRecognition ) != "undefined" || 
		typeof( webkitSpeechRecognition ) != "undefined" &&
		!isMobile()
	) {
		var website_url = window.location.origin;
		var cmds = [
			"Hello Chrissy",
			"Go to [page]",
			"Search for [word]",
			"Reload",
			"Previous",
			"Next",
			"Scroll down",
			"Scroll up",
			"Scroll to top",
			"Scroll to bottom",
			"Stop",
			"Show actions",
			"Hide",
			"Show",
			"Clean up"
		];


		// Collect all A's on the page
		var map = [];
		var grammar = [
			"hello chrissy",
			"reload",
			"previous",
			"next",
			"scroll down",
			"scroll up",
			"scroll to top",
			"scroll to bottom",
			"stop",
			"go to",
			"search",
			"show actions",
			"clean up",
			"hide",
			"show"
		];
		jQuery( "body" ).find( "a" ).each( function(){
			link_url = jQuery( this ).attr( "href" );
			link_text = jQuery( this ).html();
			link_id = link_text.replace( /[^A-Za-z0-9\s]/gi, "" ).replace( / /g, "-" ).toLowerCase();

			map[ link_id ] = {
				"url" : link_url,
				"text" : link_text
			};

			grammar_text = link_text.replace( /[^A-Za-z0-9\s]/gi, "" ).toLowerCase();
			grammar.push( grammar_text );
		} );

		// Recognition
		var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
		var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
		var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

		var CHRISSY_GRAMMAR = '#JSGF V1.0; grammar chrissys_brain; public <chrissys_brain> = ' + grammar.join(' | ') + ' ;';

		var recognition = new SpeechRecognition();
		var speechRecognitionList = new SpeechGrammarList();
		speechRecognitionList.addFromString( CHRISSY_GRAMMAR, 1 );
		recognition.grammars = speechRecognitionList;
		recognition.continuous = true;
		recognition.lang = 'en-US';
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;

		// Build the UI
		chrissy_ui = "\
		<div id='chrissy-ui'>\
			<div class='header'>Chrissy <span class='eye' style='background-image: url("+ window.location.origin +"/wp-content/plugins/chrissy/assets/images/eye-sprite.svg);'></span></div>\
			<div id='response-box'>\
				<div class='example'>Try to say \"Show actions\"!</div>\
			</div>\
		</div>\
		";
		jQuery( "body" ).append( chrissy_ui );
		if ( localStorage.getItem( "chrissy_status" ) == "visible" || localStorage.getItem( "chrissy_status" ) == null ) { setTimeout( function(){ jQuery( "#chrissy-ui" ).addClass( "show-chrissy" ); }, 250 ); }
		else { jQuery( "#chrissy-ui #response-box" ).hide(); }

		jQuery( "#chrissy-ui" ).on( "click", function( e ){
			jQuery( this ).toggleClass( "show-chrissy" );
			jQuery( this ).find( "#response-box" ).toggle();

			if ( jQuery( this ).hasClass( "show-chrissy" ) ) { localStorage.setItem( "chrissy_status", "visible" ); }
			else { localStorage.setItem( "chrissy_status", "hidden" ); }
		} );

		// Start the recognition
		recognition.start();

		recognition.onstart = function( event ) {}

		recognition.onresult = function( event ){
			var last = event.results.length - 1;
		    var command = event.results[ last ][ 0 ].transcript.trim().toLowerCase();

			if ( command == "hide" ) {
				jQuery( "#chrissy-ui #response-box" ).hide();
				jQuery( "#chrissy-ui" ).removeClass( "show-chrissy" );
				localStorage.setItem( "chrissy_status", "hidden" );
			}
			else if ( command == "show" ) {
				jQuery( "#chrissy-ui" ).addClass( "show-chrissy" );
				jQuery( "#chrissy-ui #response-box" ).show();
				localStorage.setItem( "chrissy_status", "visible" );
			}
			else if ( command == "show actions" ) {
				jQuery( "#chrissy-ui #response-box" ).empty();
				for ( i = 0; i < cmds.length; i++ ) {
					jQuery( "#chrissy-ui #response-box" ).append( "<div>"+ parseInt( i + 1 ) +") "+ cmds[ i ] +"</div>" );
				}
			}
			else if ( command == "clean up" ) {
				jQuery( "#chrissy-ui #response-box" ).html( "<div class='example'>Try to say \"Show actions\"!</div>" );
			}
			else if ( command == "hello chrissy" ) {
				jQuery( "#chrissy-ui #response-box" ).html( "Hello there! :)" );
			}
			else if ( command == "reload" ) { window.location.reload( true ); }
			else if ( command == "previous" ) { window.history.back(); }
			else if ( command == "next" ) { window.history.forward(); }
			else if ( command == "scroll up" ) {
				scroll_position = document.documentElement.scrollTop > document.body.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
				jQuery( 'html, body' ).animate({
			        scrollTop: scroll_position - 250
			    }, 1000);
				jQuery( "#chrissy-ui #response-box" ).html( "Scrolled up." );
			}
			else if ( command == "scroll down" ) {
				scroll_position = document.documentElement.scrollTop > document.body.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
				jQuery( 'html, body' ).animate({
			        scrollTop: scroll_position + 250
			    }, 1000);
				jQuery( "#chrissy-ui #response-box" ).html( "Scrolled down." );
			}
			else if ( command == "scroll to top" ) {
				jQuery( 'html, body' ).animate({
			        scrollTop: 0
			    }, 1000);
				jQuery( "#chrissy-ui #response-box" ).html( "Back to top!" );
			}
			else if ( command == "scroll to bottom" ) {
				scroll_position = document.documentElement.scrollTop > document.body.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
				jQuery( 'html, body' ).animate({
			        scrollTop: jQuery( document ).height()
			    }, 1000);
				jQuery( "#chrissy-ui #response-box" ).html( "Down to the bottom!" );
			}
			else if ( command == "stop" ) {
				stop = true;
				recognition.stop();
				jQuery( "#chrissy-ui #response-box" ).html( "Goodbye!" );
				setTimeout( function(){ jQuery( "#chrissy-ui" ).remove(); }, 2000 );
			}
			else {
				 if ( command.indexOf( "go to" ) > -1 ) {
					 navigate = command.split( "go to" )[ 1 ].trim().replace( / /g, "-" ).toLowerCase();

					 if ( map.indexOf( navigate ) > -1 ) {
						 relation = map[ map_key ];
						 window.location = relation.url;
					 } else {
						 for ( map_key in map ) {
							 if ( map_key.indexOf( navigate ) > -1 ) {
								 relation = map[ map_key ];
								 window.location = relation.url;
								 break;
							 }
						 }
					 }
				 }
				 else if ( command.indexOf( "search for" ) > -1 ) {
					 word = command.split( "search for" )[ 1 ].trim().replace( / /g, "+" ).replace( /and/g, "-" ).toLowerCase();
					 window.location = window.location.origin +"?s="+ word;
				 }
				 else { jQuery( "#chrissy-ui #response-box" ).html( "Sorry I didn't get that: \""+ command +"\"" ); }
			}
		}

		recognition.onend = function( event ){
			if ( event.isTrusted && !stop ) { recognition.start(); }
		}
	}
} );

function isMobile() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) { return true; }
    else { return false; }
}