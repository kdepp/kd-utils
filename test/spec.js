import {syncPropPath, asyncPropPath, propPath, at, on, map, async_on, async_at, async_array_lift} from '../index';

var expect = require('chai').expect;

describe('propPath', function () {
  var data = {
    a: {
      b: [
        {c: 1},
        {c: 2},
        {c: 3}
      ]
    }
  };
  var atResult = [2,4,6];
  var onResult = {
    a: {
      b: [
        {c: 2},
        {c: 4},
        {c: 6}
      ]
    }
  }

  it('sync', function () {
    expect(propPath(at, map, 'a.b[].c')(x => x * 2)(data)).to.eql(atResult);
    expect(propPath(on, map, 'a.b[].c')(x => x * 2)(data)).to.eql(onResult);
  });

  it('async', function (done) {
    var asyncSet = x => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(x * 2), 200);
      });
    }

    Promise.all([
      propPath(async_at, async_array_lift, 'a.b[].c')(asyncSet)(data),
      propPath(async_on, async_array_lift, 'a.b[].c')(asyncSet)(data)
    ])
    .then(([fst, snd]) => {
      expect(fst).to.eql(atResult);
      expect(snd).to.eql(onResult);
      done();
    });
  });
});
