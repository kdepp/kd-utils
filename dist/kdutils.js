/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _utils = __webpack_require__(2);

	var utils = _interopRequireWildcard(_utils);

	var _async = __webpack_require__(3);

	var async = _interopRequireWildcard(_async);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var kit = _extends({}, utils, async);

	exports.default = kit;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/*
	 * Basic
	 */

	var id = exports.id = function id(x) {
	    return x;
	};

	var noop = exports.noop = function noop() {
	    return undefined;
	};

	/*
	 * Curry / Partial
	 */

	var partial = exports.partial = function partial(fn) {
	    var len = fn.length,
	        _arbitary = undefined;

	    _arbitary = function arbitary(cur_args, left_arg_cnt) {
	        return function () {
	            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                args[_key] = arguments[_key];
	            }

	            if (args.length >= left_arg_cnt) {
	                return fn.apply(null, cur_args.concat(args));
	            }

	            return _arbitary(cur_args.concat(args), left_arg_cnt - args.length);
	        };
	    };

	    return _arbitary([], len);
	};

	/*
	 * List Operations
	 */

	var reduce = exports.reduce = partial(function (fn, initial, list) {
	    var ret = initial;

	    for (var i = 0, len = list.length; i < len; i += 1) {
	        ret = fn(ret, list[i]);
	    }

	    return ret;
	});

	var reduce_right = exports.reduce_right = partial(function (fn, initial, list) {
	    var ret = initial;

	    for (var i = list.length - 1; i >= 0; i -= 1) {
	        ret = fn(list[i], ret);
	    }

	    return ret;
	});

	var map = exports.map = partial(function (fn, list) {
	    return reduce(function (prev, cur) {
	        return prev.push(fn(cur)), prev;
	    }, [], list);
	});

	var filter = exports.filter = partial(function (predicate, list) {
	    return reduce(function (prev, cur) {
	        if (fn(cur)) prev.push(cur);
	        return prev;
	    }, [], list);
	});

	var without = exports.without = partial(function (value, list) {
	    return filter(function (x) {
	        return x !== value;
	    }, list);
	});

	var pluck = exports.pluck = partial(function (key, list) {
	    return map(function (x) {
	        return x[key];
	    }, list);
	});

	var is_array = exports.is_array = function () {
	    var MAX_SAFE_INTEGER = 9007199254740991,
	        objToString = Object.prototype.toString,
	        arrayTag = '[object Array]',
	        isObjectLike = function isObjectLike(value) {
	        return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
	    },
	        isLength = function isLength(value) {
	        return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	    };

	    return function (value) {
	        return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	    };
	}();

	var zipWith = exports.zipWith = partial(function (fn) {
	    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        args[_key2 - 1] = arguments[_key2];
	    }

	    var len = Math.max.apply(null, args.map(function (x) {
	        return x.length;
	    })),
	        ret = [];

	    var _loop = function _loop(i) {
	        ret.push(fn.apply(null, args.map(function (x) {
	            return x[i];
	        })));
	    };

	    for (var i = 0; i < len; i += 1) {
	        _loop(i);
	    }

	    return ret;
	});

	var deep_flatten = exports.deep_flatten = function deep_flatten(list) {
	    var helper = function helper(list) {
	        return reduce(function (prev, cur) {
	            if (is_array(cur)) {
	                prev = prev.concat(helper(cur));
	            } else {
	                prev.push(cur);
	            }

	            return prev;
	        }, [], list);
	    };

	    return helper(list);
	};

	var range = exports.range = function range(start, end, step_) {
	    var ret = [],
	        step = step_ || 1;

	    for (var i = start; i < end; i += step) {
	        ret.push(i);
	    }

	    return ret;
	};

	/*
	 * Object Operations
	 */

	var obj_map = exports.obj_map = partial(function (fn, obj) {
	    return reduce(function (prev, key) {
	        prev[key] = fn(obj[key], key);
	        return prev;
	    }, {}, Object.keys(obj));
	});

	/*
	 * Function Operations
	 */

	var compose = exports.compose = function compose() {
	    for (var _len3 = arguments.length, fns = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        fns[_key3] = arguments[_key3];
	    }

	    return reduce_right(function (cur, prev) {
	        return function (x) {
	            return cur(prev(x));
	        };
	    }, id, fns);
	};

	var promisify = exports.promisify = function promisify(fn, context) {
	    return function () {
	        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	            args[_key4] = arguments[_key4];
	        }

	        return new Promise(function (resolve, reject) {
	            fn.apply(context, [].concat(args, [function (err, data) {
	                if (err) reject(err);else resolve(data || true);
	            }]));
	        });
	    };
	};

	/*
	 * Lift
	 */

	var array_lift = exports.array_lift = map;

	var array_lift2 = exports.array_lift2 = compose(map, map);

	/*
	 * String Operations
	 */

	var trim = exports.trim = function trim(str) {
	    return str.replace(/^\s*|\s*$/g, '');
	};

	var repeat = exports.repeat = partial(function (n, str) {
	    var ret = '';

	    while (n-- > 0) {
	        ret += str;
	    }

	    return ret;
	});

	var n_digits = exports.n_digits = partial(function (n, num) {
	    var str = num + '';
	    return str.length >= n ? str : repeat(1, '0') + str;
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.async_map_limit = exports.async_limit = exports.async_flow = exports.async_take_while_right = exports.async_reduce = exports.async_array_lift2 = exports.async_array_lift = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _utils = __webpack_require__(2);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var async_array_lift = exports.async_array_lift = (0, _utils.partial)(function (fn, list) {
	    return Promise.all((0, _utils.map)(fn, list));
	});

	var async_array_lift2 = exports.async_array_lift2 = (0, _utils.partial)(function (fn, list) {
	    return Promise.all((0, _utils.map)(function (list2) {
	        return Promise.all((0, _utils.map)(fn, list2));
	    }, list));
	});

	var async_reduce = exports.async_reduce = function async_reduce(predicate, next_index, start_index, fn, initial, list) {
	    var _run = undefined;

	    _run = function run(cur_index, list, result) {
	        return fn(result, list[cur_index]).then(function (ret) {
	            return predicate(cur_index, list, ret) ? _run(next_index(cur_index), list, ret) : ret;
	        });
	    };

	    return _run(start_index, list, initial);
	};

	var async_take_while_right = exports.async_take_while_right = (0, _utils.partial)(function (async_predicate, list) {
	    return async_reduce(
	    // predicate
	    function (index, list, _ref) {
	        var _ref2 = _slicedToArray(_ref, 2);

	        var pass = _ref2[0];
	        var ret = _ref2[1];
	        return index > 0 && pass;
	    },

	    // next_index
	    function (index) {
	        return index - 1;
	    },

	    // start_index
	    list.length - 1,

	    // reducer fn
	    function (_ref3, cur) {
	        var _ref4 = _slicedToArray(_ref3, 2);

	        var some = _ref4[0];
	        var prev = _ref4[1];

	        return async_predicate(cur).then(function (pass) {
	            return [pass, pass ? (prev.unshift(cur), prev) : prev];
	        });
	    },

	    // initial
	    [true, []],

	    // list
	    list).then(function (ret) {
	        return ret[1];
	    });
	});

	var async_flow = exports.async_flow = (0, _utils.partial)(function (fn, list) {
	    return async_reduce(function (index, list) {
	        return index < list.length - 1;
	    }, function (index) {
	        return index + 1;
	    }, 0, function (prev, cur) {
	        return fn(cur).then(function (ret) {
	            return [].concat(_toConsumableArray(prev), [ret]);
	        });
	    }, [], list);
	});

	var async_limit = exports.async_limit = (0, _utils.partial)(function (limit, tasks) {
	    return new Promise(function (resolve, reject) {
	        var count = 0,
	            cur = 0,
	            ret = [],
	            len = tasks.length,
	            run = function run(task, i) {
	            count++;
	            return task().then(function (x) {
	                count--;
	                ret.push([x, i]);
	                return check();
	            });
	        },
	            check = function check() {
	            if (ret.length === tasks.length) {
	                ret.sort(function (a, b) {
	                    return a[1] - b[1];
	                });
	                resolve((0, _utils.pluck)(0, ret));
	                return;
	            }

	            if (count < limit && cur < len) {
	                cur++;
	                return Promise.all([run(tasks[cur - 1], cur - 1), check()]);
	            }
	        };

	        check().catch(function (e) {
	            return console.log('error', e, e.stack);
	        });
	    });
	});

	var async_map_limit = exports.async_map_limit = (0, _utils.partial)(function (limit, fn, list) {
	    return async_limit(limit, (0, _utils.map)(function (x) {
	        return function () {
	            return fn(x);
	        };
	    }, list));
	});

/***/ }
/******/ ]);