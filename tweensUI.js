/*

    The MIT License (MIT)

    Copyright (c) 2016 Miguel Ángel Pérez Martínez

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.

*/

(function () {

    var paletteCanvasW = 150;
    var paletteCanvasH = 150;
    var paletteCanvasMargin = 25;

    var tweens;


    function plotTweenInCanvas(tweenName, canvas, width, height) {
        canvas.width = width;
        canvas.height = height;

        var tween = tweens[tweenName];
        var ctx = canvas.getContext("2d");

        var gWidth = width - 2 * paletteCanvasMargin;
        var gHeight = height - 2 * paletteCanvasMargin;

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(paletteCanvasMargin, paletteCanvasMargin + (1.0 - tween.func(0)) * gHeight);

        for (var i = 1; i < gWidth; i++) {
            ctx.lineTo(paletteCanvasMargin + i, paletteCanvasMargin + (1.0 - tween.func(i / (gWidth - 1))) * gHeight);
        }

        ctx.stroke();
    }

    function generatePaletteCanvases() {

        var tweensPalette = document.getElementById("tweensPalette");

        for (var tweenName in tweens) {
            var div = document.createElement("div");

            var canvas = document.createElement("canvas");
            plotTweenInCanvas(tweenName, canvas, paletteCanvasW, paletteCanvasH);
            canvas.style.display = "block";
            div.appendChild(canvas);

            var span = document.createElement("span");
            span.innerText = tweenName;
            div.appendChild(span);

            tweensPalette.appendChild(div);
        }
    }

    // Init
    window.onload = function () {
        tweens = getTweens();
        generatePaletteCanvases();

    };









})();