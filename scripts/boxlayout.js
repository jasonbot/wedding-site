/**
 * boxlayout.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var Boxlayout = (function() {

	var $el = $( '#bl-main' ),
		$sections = $el.children( 'section' ),
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		},
		// transition end event name
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		// support css transitions
		supportTransitions = Modernizr.csstransitions;

	function init() {
		initEvents();
	}

	function initEvents() {
		
		$sections.each( function() {
			
			var $section = $( this );

            var $seentransitions = {};
            var $transitioncalls = {
                slidesection: function () {
                    // Set up the slideshow part
                    $('#slides').slidesjs({
                      width: 640,
                      height: 480,
                      navigation: true
                    });
                },
                mapsection: function () {
                    // Set up the map
                    var map = L.map('locationmap').setView([34.054722,-117.1825], 11);

                    L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
                                attribution: '&copy; <a href="www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                }).addTo(map);
                }
            };

			// expand the clicked section and scale down the others
			$section.on( 'click', function() {

				if( !$section.data( 'open' ) ) {
					$section.data( 'open', true ).addClass( 'bl-expand bl-expand-top' );
					$el.addClass( 'bl-expand-item' );
                    var idattr = $section.attr('id');
                    if (idattr !== undefined)
                    {
                        if ($seentransitions[idattr] === undefined)
                        {
                            $seentransitions[idattr] = true;

                            if ($transitioncalls[idattr] !== undefined)
                            {
                                setTimeout($transitioncalls[idattr], 1000);
                            }
                        }
                    }
				}

			} ).find( 'span.bl-icon-close' ).on( 'click', function() {
				
				// close the expanded section and scale up the others
				$section.data( 'open', false ).removeClass( 'bl-expand' ).on( transEndEventName, function( event ) {
					if( !$( event.target ).is( 'section' ) ) return false;
					$( this ).off( transEndEventName ).removeClass( 'bl-expand-top' );
				} );

				if( !supportTransitions ) {
					$section.removeClass( 'bl-expand-top' );
				}

				$el.removeClass( 'bl-expand-item' );
				
				return false;

			} );

		} );
	}

	return { init : init };

})();
