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

    var currentMode = "none";

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

        for (var i = 0; i < gWidth; i++) {
            ctx[i == 0 ? "moveTo" : "lineTo"](paletteCanvasMargin + i, paletteCanvasMargin + (1.0 - tween.func(i / (gWidth - 1), tween.params)) * gHeight);
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



            if (currentTween.params) {
                var newParametersHtml = "";

                for (var paramName in currentTween.params) {
                    var param = currentTween.params[paramName];
                    newParametersHtml += "<b>" + paramName + "</b> (" + param.name + ")";
                    if (param.int) {
                        newParametersHtml += ' = <b id="param_' + paramName + '_value">' + param.value + "</b><br />";
                        newParametersHtml += '<input value="' + param.value + '" id="param_' + paramName + '_range" type="range" min="' + param.min + '" max="' + param.max + '"><br />';
                    } else {
                        newParametersHtml += ' = <b id="param_' + paramName + '_value">' + param.value.toFixed(2) + "</b><br /> ";
                        newParametersHtml += '<input value="' + 100 * (param.value - param.min) / (param.max - param.min) + '" id="param_' + paramName + '_range" type="range" min="0" max="100"><br />';
                    }
                }

                document.getElementById("parametersDiv").innerHTML = newParametersHtml;

                for (var paramName in currentTween.params) {
                    var range = document.getElementById('param_' + paramName + '_range');
                    (function (key, param) {
                        range.oninput = function () {

                            if (param.int) {
                                param.value = this.value;
                                document.getElementById('param_' + key + '_value').innerText = this.value;
                            } else {
                                param.value = param.min + (param.max - param.min) * (this.value / 100);
                                document.getElementById('param_' + key + '_value').innerText = param.value.toFixed(2);
                            }
                        }
                    })(paramName, currentTween.params[paramName]);
                }

                document.getElementById("parametersDiv").parentNode.style.display = "block";
            } else {
                document.getElementById("parametersDiv").parentNode.style.display = "none";
            }


        }
    }

    function setCurrentMode(mod) {
        currentMode = mod;

        document.getElementById("modeNormal").className = "modeButton" + ((mod === "normal") ? " modeButtonOn" : "");
        document.getElementById("modeComplement").className = "modeButton" + ((mod === "complement") ? " modeButtonOn" : "");
        document.getElementById("modeOut").className = "modeButton" + ((mod === "out") ? " modeButtonOn" : "");
        document.getElementById("modeOutComplement").className = "modeButton" + ((mod === "outComplement") ? " modeButtonOn" : "");

        setTween(currentTween.name);
    }


    function strokeLine(ctx, color, width, x0, y0, x1, y1) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }

    function doCurrentTweenWithModes(t) {
        var y = currentTween.func((currentMode === "out" || currentMode === "outComplement") ? (1 - t) : t, currentTween.params);

        if (currentMode === "out" || currentMode === "complement") {
            y = 1 - y;
        }

        return y;
    }

    function renderPanel(t) {
        var dt = t - baseTime;
        var ctx = panelCanvas.getContext("2d");

        var w = panelCanvas.width;
        var h = panelCanvas.height;

        var ct = dt / 2000;
        ct = ct - Math.floor(ct);
        ct = Math.max(0, Math.min(1, (ct * 2) - 0.5));

        var y = doCurrentTweenWithModes(ct);

        ctx.clearRect(0, 0, w, h);

        ////////
        // Plot Indicators
        ////////////////////////////

        ctx.beginPath();
        ctx.fillStyle = "#510273";
        ctx.arc(505, 100, Math.abs(y * 60), 0, 2 * Math.PI);
        ctx.fillRect(420, 220, 80, y * 150);
        ctx.fillRect(510, 220 + y * 150, 80, (1 - y) * 150);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = "#3F0259";
        ctx.lineWidth = 3;
        ctx.arc(505, 100, 60, 0, 2 * Math.PI);
        ctx.strokeRect(420, 220, 80, 150);
        ctx.strokeRect(510, 220, 80, 150);
        ctx.stroke();

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

        strokeLine(ctx, "#000000", 1, gX, gY + gH - gPadding, gX + gW, gY + gH - gPadding);
        strokeLine(ctx, "#000000", 1, gX + gPadding, gY, gX + gPadding, gY + gH);


        ctx.beginPath();
        ctx.strokeStyle = "#3F0259";
        ctx.lineWidth = 2;

        for (var i = 0; i < gPW; i++) {
            ctx[i == 0 ? "moveTo" : "lineTo"](gX + gPadding + i, gY + gPadding + (1.0 - doCurrentTweenWithModes(i / (gPW - 1))) * gPH);
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
        panelCanvas = document.getElementById("panelCanvas");
        generatePaletteCanvases();

        document.getElementById("modeNormal").onclick = function () { setCurrentMode("normal"); };
        document.getElementById("modeComplement").onclick = function () { setCurrentMode("complement"); };
        document.getElementById("modeOut").onclick = function () { setCurrentMode("out"); };
        document.getElementById("modeOutComplement").onclick = function () { setCurrentMode("outComplement"); };

        setTween("linear");
        setCurrentMode("normal");


        window.requestAnimationFrame(mainLoop);
    };









})();