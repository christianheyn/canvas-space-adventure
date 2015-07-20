/*jslint browser: true*/
/*global requestAnimationFrame*/
window.CanvasSpaceAdventure = (function (document) {
    'use strict';
    return function (settings) {
        var that = this,
            // get a random number in a range
            random = function (minimum, maximum) {
                return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
            },
            animationStatus = false,
            // the parent element for the canvas
            galaxy,
            // save current width of galaxy
            currentWidth,
            // save current height of galaxy
            currentHeight,
            // The canvas
            canvas,
            // canvas.style
            canvasStyle,
            // canvas-context
            ctx,
            // how much stars you want to explore
            numberOfStars = settings.numberOfStars || 100,
            maxStarRadius = settings.maxStarRadius || 3,
            // All Stars
            stars,
            // meteoroid
            meteoroidWaiting = settings.meteoroidWaiting || 1000,
            meteoroidDuration = settings.meteoroidDuration || 1000,
            // all meteoroidSettings
            meteoroidSettings = {
                wait: 0,
                status: false
            },
            meteoroid = function () {
                var x,
                    y;
                // Wait
                if (meteoroidSettings.wait >= meteoroidWaiting) {
                    if (meteoroidSettings.wait === meteoroidWaiting) {
                        meteoroidSettings.y1 = random(0, currentHeight);
                        meteoroidSettings.y2 = random(0, currentHeight);
                        meteoroidSettings.direction = random(0, 1);
                        meteoroidSettings.before = [];
                        meteoroidSettings.step = (currentWidth / meteoroidDuration);
                        meteoroidSettings.prop = (function () {
                            var differenz = meteoroidSettings.y1 - meteoroidSettings.y2;
                            if (differenz / currentWidth) {
                                return -(differenz / currentWidth);
                            }
                            return (differenz / currentWidth);
                        }());
                        //console.log(meteoroidSettings.direction);
                    }
                    // Do it!
                    if (meteoroidSettings.direction === 0) {
                        x = (meteoroidSettings.wait - meteoroidWaiting) * meteoroidSettings.step;
                        y = (x * meteoroidSettings.prop) + meteoroidSettings.y1;
                    } else {
                        x = currentWidth - (meteoroidSettings.wait - meteoroidWaiting) * meteoroidSettings.step;
                        y = (x * meteoroidSettings.prop) + meteoroidSettings.y1;
                    }
                    if (!!meteoroidSettings.before[1]) {
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(meteoroidSettings.before[1].x, meteoroidSettings.before[1].y);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                        ctx.stroke();
                    }
                    meteoroidSettings.before.unshift({
                        x: x,
                        y: y
                    });
                    if (meteoroidSettings.wait > (meteoroidWaiting + meteoroidDuration)) {
                        meteoroidSettings.wait = random(0, meteoroidWaiting - (meteoroidWaiting * 0.2));
                    }
                }
                meteoroidSettings.wait += 1;
            },
            //
            starType = {
                'default': function (star) {
                    var radius,
                        minColor = 190,
                        step = 0.02;
                        //maxRadius = 100;
                    if (star.status === undefined) {
                        star.status = {
                            radius: random(0, maxStarRadius),
                            direction: true,
                            color: {
                                r: random(minColor, 255),
                                g: random(minColor, 255),
                                b: random(minColor, 255),
                                a: random(0, 8)
                            }
                        };
                    }
                    if (!!star.status.direction) {
                        if (star.status.radius < maxStarRadius) {
                            radius = star.status.radius + step;
                            star.status.radius += step;
                        } else {
                            radius = star.status.radius - step;
                            star.status.radius -= step;
                            star.status.direction = false;
                        }
                    } else {
                        if (star.status.radius > step) {
                            radius = star.status.radius - step;
                            star.status.radius -= step;
                        } else {
                            radius = star.status.radius + step;
                            star.status.radius += step;
                            star.status.direction = true;
                            star.x = random(0, currentWidth);
                            star.y = random(0, currentHeight);
                        }
                    }
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, radius, 0, 2 * Math.PI, false);
                    //ctx.ellipse(star.x, star.y, radius, radius, 0, 0, 2 * Math.PI);
                    ctx.fillStyle = 'rgba(' + star.status.color.r + ', ' + star.status.color.g + ', ' + star.status.color.b + ', ' + (star.status.color.a / 10) + ')';
                    ctx.fill();
                }
            },
            createStarKoor = function () {
                var i = numberOfStars - 1;
                stars = [];
                currentWidth = galaxy.offsetWidth;
                currentHeight = galaxy.offsetHeight;
                canvas.width = currentWidth;
                canvas.height = currentHeight;
                for (i; i >= 0; i -= 1) {
                    stars.push({
                        x: random(0, currentWidth),
                        y: random(0, currentHeight)
                    });
                }
            },
            // draw my space-adventure
            drawInterval = function () {
                var i = numberOfStars - 1;
                // clear
                ctx.clearRect(0, 0, currentWidth, currentHeight);
                for (i; i >= 0; i -= 1) {
                    //console.log(stars[i]);
                    starType['default'](stars[i]);
                }
                meteoroid();
            },
            rekursiv = function () {
                if (!!animationStatus) {
                    requestAnimationFrame(rekursiv);
                    drawInterval();
                }
            };
        // If a galaxy (DOM-element) is given
        if (!!settings.galaxy) {
            // create canvas and put it in the galaxy
            canvas = document.createElement('canvas');
            canvas.id = 'canvas-space-adventure';
            //TO DO Style
            canvasStyle = canvas.style;
            canvasStyle.position = 'absolute';
            canvasStyle.left = 0;
            canvasStyle.top = 0;
            settings.galaxy.appendChild(canvas);
            galaxy = settings.galaxy;
            ctx = canvas.getContext('2d');
            // init
            createStarKoor();
            that.resize = function () {
                createStarKoor();
                return that;
            };
            that.render = function (status) {
                if (typeof status === 'boolean') {
                    animationStatus = status;
                    if (!!status) {
                        rekursiv();
                    }
                }
                return that;
            };
            that.meteoroid = function () {
                meteoroidSettings.wait = meteoroidWaiting;
                return that;
            };
        }
    };
}(document));