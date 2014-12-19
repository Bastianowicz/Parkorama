/**
 *
 * Created by Bastian on 19.12.2014.
 */

(function(){
    var Config = [
        {
            coordinates : {
                x: 2650,
                y: 135
            },
            img : "1.JPG",
            caption : "Erstes Bild"
        },
        {
            coordinates : {
                x: 2611,
                y: 154
            },
            img : "2.JPG",
            caption : "Zweites Bild"
        },
        {
            coordinates : {
                x: 2542,
                y: 190
            },
            img : "3.JPG",
            caption : ""
        },
        {
            coordinates : {
                x: 2602,
                y: 129
            },
            img : "4.JPG",
            caption : ""
        },
    ];


    var speed = 10;


    //----------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------


    /**
    *
    * @constructor
    */
    var Parkorama = function(){
        /**
         * Referenz auf alle erstellten Knoten
         * @type {Array}
         */
        var nodes = [];

        /**
         * @type {Parkorama}
         */
        var that = this;

        /**
         * Box, die mit Panoramabildern gefüllt wird
         * @type {Jquery}
         */
        this.$panoramaViewport = {};

        /**
         * JQuery-Referenz auf Overlay
         * @type {{}}
         */
        var $overlay = {};

        /**
         * jQuery Referenz auf Container
         * @type {{}}
         */
        var $container = {};

        /**
         * Konstruktor
         */
        this.init = function() {
            $container = $('#map');
            $overlay = $('#overlay');
            that.$panoramaViewport = $('#panorama-viewport');

            if($container.length > 0) {
                for(i in Config) {
                    nodes[i] = new Node( Config[i], i );
                    nodes[i].init();
                    $container.append(nodes[i].$element);
                }
            }

            $overlay.click(function() {
                that.fadeOutOverlay();
            });

            bindKeys();
        };

        /**
         * Tastaturbefehle
         */
        var bindKeys = function(){
            $(document).keydown(function(e){
                switch( e.which ){
                    case 27:
                        e.preventDefault();
                        that.fadeOutOverlay();
                        break;
                    case 39:
                        e.preventDefault();
                        nodes[$('.panorama-img.active').data('i')].moveImgRight();
                        break;
                    case 37:
                        e.preventDefault();
                        nodes[$('.panorama-img.active').data('i')].moveImgLeft();
                        break;
                    default:
                        console.log(e.which);
                        break;
                }
            });
        }

        /**
         * Blendet das Overlay ein
         */
        this.fadeInOverlay = function(){
            $overlay.fadeIn(300);
        }

        /**
         * Blendet das Overlay aus
         */
        this.fadeOutOverlay = function(){
            $overlay.fadeOut(300);
        }

        /**
         * Blendet alle Panoramabilder aus
         */
        this.hideAllPanoramas = function() {
            for(i in nodes) {
                nodes[i].$panoramaImg.css({
                    display: 'none',
                    marginLeft: 0
                });
                nodes[i].$panoramaImg.removeClass('active');
            }
        }
    };


    /**
     * Repräsentation jedes Knotens
     * @param config (Array)
     * @constructor
     */
    var Node = function( config, i ) {
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
        var imgSrc = "";

        /**
         * Bildunterschrift
         * @type {string}
         */
        var caption = "";

        /**
         * Referenz auf den Kartenknoten
         * @type {jQuery}
         */
        this.$element = {};

        this.$panoramaImg = {};

        /**
         * Konstruktor
         */
        this.init = function() {
            coordinates = config.coordinates;
            imgSrc = "img/panoramas/" + config.img;
            caption = config.caption;

            createElement();

        };

        /**
         * Bewegt das PanoramaBild nach links
         */
        this.moveImgRight = function(){
            if(parseInt(that.$panoramaImg.css('margin-left')) <= 0 ) {
                console.log("!");
                that.$panoramaImg.css('margin-left', function (index, curValue) {
                    return parseInt(curValue, 10) + speed + 'px';
                });
            }
        };

        /**
         * Bewegt das PanoramaBild nach rechts
         */
        this.moveImgLeft = function() {
            var margin = parseInt(that.$panoramaImg.css('margin-left'));
            var imgWidth = parseInt(that.$panoramaImg.children().width());
            var viewportWidth = parseInt(tds.parkorama.$panoramaViewport.width());

            if(imgWidth + margin > viewportWidth ) {
                that.$panoramaImg.css('margin-left', function (index, curValue) {
                    return parseInt(curValue, 10) - speed + 'px';
                });
            }
        };

        /**
         * Erstellt das jQuery-Element
         */
        var createElement = function() {
            // Kartenknoten erstellen
            that.$element = $('<a class="node">');
            that.$element.css({
                top: coordinates.y,
                left: coordinates.x
            });

            // Panorama-Bild erstellen
            var $img = $('<img>');
            $img.attr('src', imgSrc);
            that.$panoramaImg = $('<div class="panorama-img">');
            that.$panoramaImg.data('i', i);
            that.$panoramaImg.append($img);
            tds.parkorama.$panoramaViewport.append(that.$panoramaImg);

            // Bei Klick einblenden
            that.$element.click(function(){
                tds.parkorama.hideAllPanoramas();
                that.$panoramaImg.css('display','block');
                that.$panoramaImg.addClass('active');
                tds.parkorama.fadeInOverlay();
            });
        };
    };

    $(document).ready(function(){
        tds = {
            parkorama : {}
        };
        tds.parkorama = new Parkorama();
        tds.parkorama.init();
    });
})();
