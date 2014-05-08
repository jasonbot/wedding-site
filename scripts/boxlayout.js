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
                      width: 800,
                      height: 600,
                      navigation: true
                    });

                    $('#slidecontainerholder').removeClass('fadedout');
                },
                mapsection: function () {
                    // Set up the map
                    var places = [
                        {
                            "name": "Wedding Venue (Ollis Ranch)",
                            "location": [34.0013447, -117.1372919],
                            "address": "30075 Live Oak Canyon Road, Redlands, CA",
                            "category": "Venues"
                        },
                        {
                            "name": "Henna Ceremony Venue (The Commons Recreation Center)",
                            "location": [33.9902378, -117.6584914],
                            "address": "6550 Eucalyptus Avenue, Chino, CA",
                            "category": "Venues"
                        },
                        {
                            "name": "Comfort Suites Redlands",
                            "location": [34.063812, -117.200708],
                            "address": "1230 W Colton Ave Redlands, CA",
                            "category": "Hotels"
                        },
                        {
                            "name": "Ayres Hotel Redlands",
                            "location": [34.062381, -117.196774],
                            "address": "1015 W Colton Ave Redlands, CA",
                            "category": "Hotels"
                        },
                        {
                            "name": "Hilton Doubletree Ontario",
                            "location": [34.066312, -117.609801],
                            "address": "222 N Vineyard Ave Ontario, CA",
                            "category": "Hotels"
                        },
                        {
                            "name": "Ontario International Airport (ONT)",
                            "location": [34.060837, -117.592495],
                            "address": "Terminal Way, Ontario, CA",
                            "category": "Airport"
                        }
                    ];

                    var start_value = $("#venuelist").val();

                    var map = L.map('locationmap').setView([34.0013447, -117.1372919], 11);
                    map.on('move', function(e) {
                        $('#venuelist').val(start_value);
                    });

                    var placeitems = {};
                    var optgroups = {};

                    L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
                                attribution: '&copy; <a href="www.openstreetmap.org/copyright">OpenStreetMap</a>',
                                detectRetina: true
                                }).addTo(map);

                    $(places).each(function(i, place) {
                        if (place["location"])
                        {
                            var address_text = "";
                            if (place['address'])
                            {
                                address_text = "<i>" + place['address'] + "</i><br>";
                            }
                            var popup_text = ("<b>" + place['name'] + "</b><br>" + 
                                              address_text +
                                              '<a href="http://maps.google.com/maps?q=' + 
                                              place["location"].join(",") + 
                                              '" target="_blank">Link to map</a>');
                            var place_object = L.marker(place['location']).bindPopup(popup_text);
                            place_object.addTo(map);

                            var option = $("<option />");
                            option.attr({ 'value': place['name']}).text(place['name']);
                            var add_to = $("#venuelist");
                            if (place["category"])
                            {
                                if (place["category"] in optgroups)
                                {
                                    add_to =  optgroups[place["category"]];
                                }
                                else
                                {
                                    add_to = $("<optgroup></optgroup>");
                                    add_to.attr('label', place["category"]);
                                    $("#venuelist").append(add_to);
                                    optgroups[place["category"]] = add_to;
                                }
                            }
                            add_to.append(option);

                            placeitems[place['name']] = place_object;
                        }
                    });

                    $("#venuelist").change(function(evt) {
                        var markername = $("#venuelist").val();
                        if (markername in placeitems)
                        {
                            var marker = placeitems[markername];
                            map.panTo(marker.getLatLng());
                            marker.openPopup();
                        }
                    });

                    $('#locationmap').removeClass('fadedout');
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
