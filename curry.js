function curry(f) {
    function get_name(f) {
        var count = 0;
        for (var fn in this) {
            count += 1;
            var name = fn;
            fn = this[fn];
            if (typeof(fn) !== "function") continue;
            if (fn === f) return name;
        }
        return "$cfunc__" + count;
    }

    function get_args(f) {
        var fjs = f.toString();
        var args_js = fjs.replace(/^function\s*\((.*)\).*$/, "[$1]");
        args_js = args_js.replace(/([a-zA-Z_0-9$]+)/g, '"$1"');
        var args = eval(args_js);
        return args;
    }

    var js = "";
    var args = get_args(f);

    for (var arg in args) {
        arg = args[arg];
        var lastArg = args[args.length - 1];

        js += "function (" + arg + ") { " 
            + (arg === lastArg ? "" : "return ");
    }

    var body = f.toString().replace(/^.*\{(.*)\}.*$/, "$1");
    js += body;
    
    for (var i = 0; i < args.length; i++) {
        js += "} ";
    }

    var fname = get_name(f);
    js = fname + ' = ' + js;
    var cfunc = eval(js);
    return cfunc;
}


// add a b = a + b
// add a = (b = a + b)
// add2 = add 2
// five = add2 3
// five' = add 1 4

var add = function (a, b) { return a + b; };
var cadd = curry(add); // curry(function (a, b) { return a + b; });
var add2 = cadd(2);
var five = add2(3);
five = cadd(1)(4);
