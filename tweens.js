/*

    The MIT License (MIT)

    Copyright (c) 2016 Miguel Ángel Pérez Martínez

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.

*/

function syntHigh(str) {

    return str.replace(/(>|<|-|\/|\+|\*|=|([A-Za-z_]\w*)|(\d+(\.\d+)?))/g, function (match, g1) {
        var className = undefined;

        if (g1 === "-" || g1 === "+" || g1 === "/" || g1 === "*" || g1 === "=" || g1 === ">" || g1 === "<") {
            className = "operator";
        } else if (/[A-Za-z_]/.test(g1[0])) {
            if (g1 === "if" || g1 === "else" || g1 === "sin" || g1 === "cos" || g1 === "acos" || g1 === "floor") {
                className = "reserved";
            } else {
                className = "identifier";
            }
        } else if (/\d/.test(g1[0])) {
            className = "number";
        }

        if (className) {
            return '<span class="' + className + '">' + g1 + '</span>';
        } else {
            return g1;
        }

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
        "expression": fmt('y = t * t * (3 - 2 * t)'),
        "func": function (t) { return t * t * (3 - 2 * t); }
    });

    arr.push({
        "name": 'overshoot hermite',
        "expression": fmt('o = 1 + 0.499 * O', 'y = (t * t * (3 - 2 * o * t)) / (3 - 2 * o)'),
        "params": {
            "O": {
                "name": "Overshoot factor",
                "value": 0.5,
                "min": 0,
                "max": 1,
            }
        },
        "func": function (t, p) {
            var o = 1 + 0.499 * p.O.value;
            return (t * t * (3 - 2 * o * t)) / (3 - 2 * o);
        }
    });

    arr.push({
        "name": 'sine',
        "expression": fmt('y = sin( t * pi * 0.5 )'),
        "func": function (t) { return Math.sin(t * Math.PI * 0.5); }
    });

    arr.push({
        "name": 'overshoot sine',
        "expression": fmt('o = 1 + 0.999 * O', 'y = sin(o * t * pi * 0.5) / sin(o * pi * 0.5)'),
        "params": {
            "O": {
                "name": "Overshoot factor",
                "value": 0.5,
                "min": 0,
                "max": 1,
            }
        },
        "func": function (t, p) {
            var o = 1 + 0.999 * p.O.value;
            return Math.sin(o * t * Math.PI * 0.5) / Math.sin(o * Math.PI * 0.5);
        }
    });

    arr.push({
        "name": 'step',
        "expression": fmt('y = floor(t * N) / N'),
        "params": {
            "N": {
                "name": "Number of steps",
                "value": 4,
                "min": 1,
                "max": 20,
                "int": true
            }
        },
        "func": function (t, p) { return Math.floor(t * p.N.value) / p.N.value; }
    });

    arr.push({
        "name": 'circular',
        "expression": fmt('y = sin(acos(1 - t))'),
        "func": function (t) { return Math.sin(Math.acos(1 - t)); }
    });

    arr.push({
        "name": 'spring',
        "expression": fmt(
            'if t < A {',
            'y = 2 * (t * t) / (A * A)',
            '} else {',
            'nt = (t - A) / (1 - A)',
            'y = 1 + (1 - nt) * cos(nt * pi * 2 * N)',
            '}'
        ),
        "params": {
            "N": {
                "name": "Number of oscilations",
                "value": 3,
                "min": 1,
                "max": 10,
                "int": true
            },
            "A": {
                "name": "Attack",
                "value": 0.2,
                "min": 0.001,
                "max": 0.999,
            }
        },
        "func": function (t, p) {
            var a = p.A.value;
            if (t < a) {
                return 2 * (t * t) / (a * a);
            } else {
                nt = (t - a) / (1 - a);
                return 1 + (1 - nt) * Math.cos(nt * Math.PI * 2 * p.N.value);
            }
        }

    });


    var tweens = {};

    for (var i = 0; i < arr.length; i++) {
        tweens[arr[i].name] = arr[i];
    }

    return tweens;
}
