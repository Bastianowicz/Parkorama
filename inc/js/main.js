/**
 *
 * Created by Bastian on 19.12.2014.
 */

(function(){
    var Config = [
        {
            coordinates : {
                x: 10,
                y: 10
            },
            img : "1.jpg",
            caption : "Erstes Bild"
        }
    ];

    /**
     * Referenz auf alle erstellten Knoten
     * @type {Array}
     */
    var nodes = [];

    /**
     *
     * @constructor
     */
    var Parkorama = function(){

        /**
         * jQuery Referenz auf Container
         * @type {{}}
         */
        var $container = {};

        /**
         * Konstruktor
         */
        var init = function() {
            $container = $('#viewport');

            if($container.length > 0) {
                for(i in Config) {
                    nodes[i] = new Node( Config[i] );

                    $container.append(nodes[i].$element);
                }
            }
        };
        // Call Konstruktor
        init();
    };


    /**
     * Repräsentation jedes Knotens
     * @param config (Array)
     * @constructor
     */
    var Node = function( config ) {
        /**
         * @type {Node}
         */
        var that = this;
        /**
         * Koordinaten auf der Karte
         * @type {{}}
         */
        var coordinates = {};

        /**
         * Bildpfad
         * @type {string}
         */
        var img = "";

        /**
         * Bildunterschrift
         * @type {string}
         */
        var caption = "";

        this.$element = {};

        /**
         * Konstruktor
         */
        var init = function() {
            coordinates = config.coordinates;
            img = config.img;
            caption = config.caption;

            createElement();

        };

        /**
         * Erstellt das jQuery-Element
         */
        var createElement = function() {
            that.$element = $('<a class="node">');
            that.$element.css({
                top: coordinates.y,
                left: coordinates.x
            });
            that.$element.attr('href', config.img);
        };

        // Call Konstruktor
        init();
    };

    $(document).ready(function(){
        window.tds = {};
        window.tds.parkorama = new Parkorama();
    });
})();
