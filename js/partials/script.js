(function () {
    'use strict';
    window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function( /* function */ callback, /* DOMElement */ element) {
              window.setTimeout(callback, 1000 / 60);
        };
    })();
    var galaxy = document.getElementById('galaxy'),
        space = new CanvasSpaceAdventure({
            galaxy: galaxy,
            numberOfStars: 1000,
            maxStarRadius: 1.5,
            meteoroidWaiting: 1000,
            meteoroidDuration: 15,
            milkyway: true// coming soon
        }).render(true),
        addEvent = (function () {
                if (typeof window.addEventListener === 'function') {
                    return function (element, eventType, callback) {
                        element.addEventListener(eventType, callback);
                    };
                }
                if (typeof window.attachEvent === 'function') {
                    return function (element, eventType, callback) {
                        element.attachEvent('on' + eventType, callback);
                    };
                }
                return function (element, eventType, callback) {
                    element['on' + eventType] = callback;
                };
            }());

        addEvent(window, 'resize', space.resize);
        addEvent(window, 'click', space.meteoroid);
}());