/*
 * Basic
 */

export const id = x => x;

export const noop = () => undefined;

/*
 * Curry / Partial
 */

export const partial = (fn) => {
	let len = fn.length,
		arbitary;

	arbitary = (cur_args, left_arg_cnt) => (...args) => {
		if (args.length >= left_arg_cnt) {
			return fn.apply(null, cur_args.concat(args));
		}

		return arbitary(cur_args.concat(args), left_arg_cnt - args.length);
	};

	return arbitary([], len);
};

/*
 * List Operations
 */

export const reduce = partial((fn, initial, list) => {
  let ret = initial;

  for (let i = 0, len = list.length; i < len; i += 1) {
    ret = fn(ret, list[i], i, list);
  }

  return ret;
});

export const reduce_right = partial((fn, initial, list) => {
  let ret = initial;

  for (let i = list.length - 1; i >= 0; i -= 1) {
    ret = fn(list[i], ret, i, list);
  }

  return ret;
});

export const map = partial((fn, list) => {
  return reduce((prev, cur, i, list) => {
    return (prev.push(fn(cur, i, list)), prev);
  }, [], list);
});

export const filter = partial((predicate, list) => {
  return reduce((prev, cur, i, list) => {
    if (predicate(cur, i, list))  prev.push(cur);
    return prev;
  }, [], list);
});

export const without = partial((value, list) => {
  return filter(x => x !== value, list);
});

export const pluck = partial((key, list) => map(x => x[key], list));

export const is_array = (() => {
  let MAX_SAFE_INTEGER = 9007199254740991,
    objToString = Object.prototype.toString,
    arrayTag = '[object Array]',
    isObjectLike = (value) => {
      return !!value && typeof value == 'object';
    },
    isLength = (value) => {
      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    };

  return function(value) {
    return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
  };
})();

export const zipWith = partial((fn, ...args) => {
  let len = Math.max.apply(null, args.map(x => x.length)),
    ret = [];

  for (let i = 0; i < len; i += 1) {
    ret.push(fn.apply(null, args.map(x => x[i])));
  }

  return ret;
});

export const flatten = (list) => {
  return reduce((prev, cur) => {
    return prev.concat(cur);
  }, [], list);
};

export const deep_flatten = (list) => {
  let helper = (list) => {
    return reduce((prev, cur) => {
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

export const range = function (start, end, step_) {
  let ret = [],
    step = step_ || 1;

  for (let i = start; i < end; i += step) {
    ret.push(i);
  }

  return ret;
};

/*
 * Object Operations
 */

export const obj_map = partial((fn, obj) => reduce((prev, key) => {
  prev[key] = fn(obj[key], key);
  return prev;
}, {}, Object.keys(obj)));

export const pick = partial((key_list, obj) => {
  return reduce((prev, cur) => {
    prev[cur] = obj[cur];
    return prev;
  }, {}, key_list);
});

export const at = partial((key, fn, dict) => {
	return fn(dict[key]);
});


export const on = partial((key, fn, dict) => {
  return {
    ...dict,
    [key]: fn(dict[key])
  };
});

/*
 * Function Operations
 */

export const compose = (...fns) => {
  return reduce_right((cur, prev) => x => cur(prev(x)), id, fns);
};

export const compose_promise = (...fns) => {
  return reduce_right((cur, prev) => x => Promise.resolve(prev(x)).then(cur), id, fns);
};


export const promisify = (fn, context) => (...args) => {
  return new Promise((resolve, reject) => {
    fn.apply(context, [...args, (err, data) => {
      if (err)  reject(err);
      else    	resolve(data || true);
    }]);
  });
};

/*
 * Lift
 */

export const array_lift = map;

export const array_lift2 = compose(map, map);

/*
 * String Operations
 */

export const trim = (str) => {
  return str.replace(/^\s*|\s*$/g, '');
};

export const repeat = partial((n, str) => {
  let ret = '';

  while (n-- > 0) {
    ret += str;
  }

  return ret;
});

export const n_digits = partial((n, num) => {
  let str = num + '';
  return str.length >= n ? str : (repeat(1, '0') + str);
});

export const sprintf = partial((str, data) => {
  return reduce((prev, cur) => {
    let reg = new RegExp("\\$\\{" + cur + "\\}", "g");
    return prev.replace(reg, data[cur]);
  }, str, Object.keys(data));
});

export const propPath = partial((objFn, arrFn, str) => {
	var parts = str.split('.');
	var reg = /\[\]$/
	var isArrayPart = (str) => reg.test(str);

	var fns = parts.reduce((prev, cur) => {
		return isArrayPart(cur)
					? [...prev, objFn(cur.replace(reg, '')), arrFn]
					: [...prev, objFn(cur)];
	}, []);

	return compose(...fns);
});

export const syncPropPath = propPath(on, map);

export const asyncPropPath = propPath(async_on, async_array_lift);

/*
 * Async Operations
 */

export const async_on = partial((key, fn, dict) => {
 	return Promise.resolve(fn(dict[key]))
 	.then(value => ({
 		...dict,
 		[key]: value
 	}));
 });

export const async_at = partial((key, fn, dict) => {
 	return Promise.resolve(fn(dict[key]));
});

export const async_array_lift = partial((fn, list) => Promise.all(map(fn, list)));

export const async_array_lift2 = partial((fn, list) => Promise.all(map(list2 => Promise.all(map(fn, list2)), list)));

export const async_reduce = (predicate, next_index, start_index, fn, initial, list) => {
  let run;

  run = (cur_index, list, result) => {
    return fn(result, list[cur_index])
    .then(ret => predicate(cur_index, list, ret) ? run(next_index(cur_index), list, ret) : ret);
  };

  return run(start_index, list, initial);
};

export const async_take_while_right = partial((async_predicate, list) => {
  return async_reduce(
    // predicate
    (index, list, [pass, ret]) => index > 0 && pass,

    // next_index
    (index) => index - 1,

    // start_index
    list.length - 1,

    // reducer fn
    ([some, prev], cur) => {
      return async_predicate(cur)
      .then(pass => [
        pass,
        pass ? (prev.unshift(cur), prev) : prev
      ]);
    },

    // initial
    [true, []],

    // list
    list
  )
  .then((ret) => ret[1]);
});

export const async_flow = partial((fn, list) => {
  return async_reduce(
    (index, list) => index < list.length - 1,
    (index) => index + 1,
    0,
    (prev, cur) => {
      return fn(cur)
      .then(ret => {
        return [...prev, ret];
      });
    },
    [], list
  );
});

export const async_limit = partial((limit, tasks) => {
  return new Promise((resolve, reject) => {
    let count = 0,
      cur = 0,
      ret = [],
      len = tasks.length,
      run = (task, i) => {
        count ++;
        return task().then(x => {
          count --;
          ret.push([x, i]);
          return check();
        });
      },
      check = () => {
        if (ret.length === tasks.length) {
          ret.sort((a, b) => a[1] - b[1]);
          resolve(pluck(0, ret));
          return;
        }

        if (count < limit && cur < len) {
          cur ++;
          return Promise.all([
            run(tasks[cur - 1], cur - 1),
            check()
          ]);
        }
      };

    check()
    .catch(e => console.log('error', e, e.stack));
  });
});

export const async_map_limit = partial((limit, fn, list) => {
  return async_limit(limit, map(x => () => fn(x), list));
});
