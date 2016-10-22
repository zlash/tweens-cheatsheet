/*

    The MIT License (MIT)

    Copyright (c) 2016 Miguel Ángel Pérez Martínez

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.

*/

function syntHigh(str) {

    return str.replace(/(t|y|=|([A-Za-z_]\w+)|(\d+(\.\d+)?))/g, function (match, g1) {
        var extraClass = '';
        return '<span class="synt ' + extraClass + '">' + g1 + '</span>';
    });

}

function fmt() {
    var retstr = '';
    for (var i = 0; i < arguments.length; i++) {
        if (i > 0) {
            retstr += '<br />';
        }
        retstr += syntHigh(arguments[i].toString());
    }
    return retstr;
}

function getTweens() {
    var arr = [];

    arr.push({
        "name": 'linear',
        "expression": fmt('y = t'),
        "func": function (t) { return t; }
    });


    arr.push({
        "name": 'quad',
        "expression": fmt('y = t * t'),
        "func": function (t) { return t * t; }
    });

    arr.push({
        "name": 'cubic',
        "expression": fmt('y = t * t * t'),
        "func": function (t) { return t * t * t; }
    });

    arr.push({
        "name": 'quartic',
        "expression": fmt('y = t * t * t * t'),
        "func": function (t) { return t * t * t * t; }
    });

    arr.push({
        "name": 'hermite',
        "expression": fmt('y = t * t * ( 3 - 2 * t )'),
        "func": function (t) { return t * t * (3 - 2 * t); }
    });

    arr.push({
        "name": 'overshoot hermite',
        "expression": fmt('y = t * t * ( 3 - 2 * t )'),
        "func": function (t) {
            var a = 0.25; // Overshoot factor
            return (t * t * (3 - 2 * (a + 1) * t)) / (3 - 2 * (a + 1));
        }
    });

    arr.push({
        "name": 'sine',
        "expression": fmt('y = sin( t * pi / 2 )'),
        "func": function (t) { return Math.sin(t * Math.PI * 0.5); }
    });

    arr.push({
        "name": 'overshoot sine',
        "expression": fmt('y = sin( t * pi / 2 )'),
        "func": function (t) {
            var a = 0.3; // Overshoot factor
            return Math.sin((1 + a) * t * Math.PI * 0.5) / Math.sin((1 + a) * Math.PI * 0.5);
        }
    });

    arr.push({
        "name": 'step',
        "expression": fmt('y = floor(t * 5) / 5'),
        "func": function (t) { return Math.floor(t * 5) / 5; }
    });

    arr.push({
        "name": 'circular',
        "expression": fmt('y = sin( acos( 1 - t) )'),
        "func": function (t) { return Math.sin(Math.acos(1 - t)); }
    });

    arr.push({
        "name": 'spring',
        "expression": fmt('y = sin( acos( 1 - t) )'),
        "func": function (t) {
            var a = 0.2; //            
            if (t < a) {
                nt = t / a;
                return nt * nt * 2;
            } else {
                nt = (t - a) / (1 - a);
                return 1 +  (1 - nt) * Math.cos(nt * Math.PI * 2 * 3);
            }

        } //(1-((1-t)*(1-t)*(1-t)*(1-t)))

    });




    var tweens = {};

    for (var i = 0; i < arr.length; i++) {
        tweens[arr[i].name] = arr[i];
    }

    return tweens;
}
