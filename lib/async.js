import {map, partial, pluck} from './utils';

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

