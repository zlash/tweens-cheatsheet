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

    var baseTime = undefined;

    var tweens;
    var panelCanvas;

    var currentTween;

    function plotTweenInCanvas(tweenName, canvas, width, height) {
        canvas.width = width;
        canvas.height = height;

        var tween = tweens[tweenName];
        var ctx = canvas.getContext("2d");

        var gWidth = width - 2 * paletteCanvasMargin;
        var gHeight = height - 2 * paletteCanvasMargin;

        ctx.fillStyle = "#B3BF99";
        ctx.fillRect(0, 0, width, height);

        ctx.beginPath();
        ctx.moveTo(paletteCanvasMargin, paletteCanvasMargin + (1.0 - tween.func(0)) * gHeight);

        for (var i = 1; i < gWidth; i++) {
            ctx.lineTo(paletteCanvasMargin + i, paletteCanvasMargin + (1.0 - tween.func(i / (gWidth - 1))) * gHeight);
        }

        ctx.stroke();
    }

    function generatePaletteCanvases() {

        var tweensPalette = document.getElementById("tweensPalette");

        var pCount = 1;

        for (var tweenName in tweens) {
            var div = document.createElement("div");

            div.className = "tweenPaletteEntry";
            div.style.order = pCount++;

            var canvas = document.createElement("canvas");
            plotTweenInCanvas(tweenName, canvas, paletteCanvasW, paletteCanvasH);
            div.appendChild(canvas);

            var span = document.createElement("span");
            span.innerText = tweenName;
            div.appendChild(span);

            (function (tn) {
                div.onclick = function () {
                    setTween(tn);
                }
            })(tweenName);

            tweensPalette.appendChild(div);
        }
    }

    function setTween(name) {
        if (tweens[name]) {
            currentTween = tweens[name];

            document.getElementById("tweenPanelTitle").innerHTML = name;
            document.getElementById("tweenPanelFormula").innerHTML = currentTween.expression;
            			
			//<div id="tweenPanelFormula">Here goes stuff</div>

        }
    }


    function strokeLine(ctx, color, width, x0, y0, x1, y1) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }

    function renderPanel(t) {
        var dt = t - baseTime;
        var ctx = panelCanvas.getContext("2d");

        var w = panelCanvas.width;
        var h = panelCanvas.height;

        var ct = dt / 2000;
        ct = ct - Math.floor(ct);
        ct = Math.max(0, Math.min(1, (ct * 2) - 0.5));

        var y = currentTween.func(ct);

        ctx.clearRect(0, 0, w, h);



        ////////
        // Plot Indicators
        ////////////////////////////
        ctx.beginPath();
        ctx.fillStyle = "#510273";
        ctx.arc(505, 100, y * 60, 0, 2 * Math.PI);
        ctx.fillRect(420, 220, 80, y * 150);
        ctx.fillRect(510, 220 + y * 150, 80, (1-y) * 150);
        ctx.fill();

        ////////
        // Plot graph
        ////////////////////////////
        var gX = 10;
        var gY = 10;
        var gW = w * 0.6;
        var gH = gW;
        var gPadding = 80;
        var gPW = gW - 2 * gPadding;
        var gPH = gH - 2 * gPadding;

        ctx.fillStyle = "#B3BF99";
        ctx.fillRect(gX, gY, gW, gH);


        strokeLine(ctx, "#AAAAAA", 2, gX + gW - gPadding, gY, gX + gW - gPadding, gY + gH);
        strokeLine(ctx, "#AAAAAA", 2, gX, gY + gPadding, gX + gW, gY + gPadding);

        strokeLine(ctx, "#000000", 2, gX, gY + gH - gPadding, gX + gW, gY + gH - gPadding);
        strokeLine(ctx, "#000000", 2, gX + gPadding, gY, gX + gPadding, gY + gH);


        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.moveTo(gX + gPadding, gY + gPadding + (1.0 - currentTween.func(0)) * gPH);

        for (var i = 1; i < gPW; i++) {
            ctx.lineTo(gX + gPadding + i, gY + gPadding + (1.0 - currentTween.func(i / (gPW - 1))) * gPH);
        }

        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "#510273";
        ctx.arc(gX + gPadding + ct * gPW, gY + gPadding + (1.0 - y) * gPH, 10, 0, 2 * Math.PI);
        ctx.fill();



    }

    function mainLoop(t) {
        window.requestAnimationFrame(mainLoop);

        if (!baseTime) { baseTime = t; }

        renderPanel(t);
    }

    // Init
    window.onload = function () {
        tweens = getTweens();
        setTween("linear");
        panelCanvas = document.getElementById("panelCanvas");
        generatePaletteCanvases();

        window.requestAnimationFrame(mainLoop);
    };









})();