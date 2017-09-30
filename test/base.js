'use strict';

const assert = require('assert');

const Param = require('../index');

describe('Param', () => {

    it('instantiation', () => {
        new Param();
        new Param({});
        new Param({a:''});
        new Param({a:{}});
    });

    it('get', () => {
        let param = new Param({
            foo: 'bar',
        });

        assert.equal(param.get('foo'), 'bar');
        assert.equal(param.get('foo.bar'), null);
        assert.equal(param.get('foo.bar.t'), null);
        assert.equal(param.get('a.b'), null);
    });

    it('set', () => {
        let param = new Param({
            foo: 'bar',
        });

        param.set('foo', 'bar2');
        assert.equal(param.get('foo'), 'bar2');
        param.set('foo.bar2', 'bar');
        assert.equal(param.get('foo.bar2'), 'bar');
        param.set('a.b.c', '');
        assert.equal(param.get('a.b.c'), '');
    });

    it('append', () => {
        let param = new Param({
            foo: 'bar',
        });

        assert.equal(param.get('foo'), 'bar');
        assert.equal(param.get('a.b'), null);
        assert.equal(param.get('a.b.c'), null);

        param.append({
            a: { b: 0 },
        });
        assert.equal(param.get('a.b'), 0);
        assert.equal(param.get('a.b.c'), null);
    });

    it('append - Incoming wrong data', (done) => {
        let param = new Param({
            foo: 'bar',
        });
        param.append('').then(() => {
            done('Failure to catch error');
        }).catch((error) => {
            done();
        });
    });

    it('delete', () => {
        let param = new Param({
            foo: 'bar',
            a: { b: { c: 0 } },
        });

        param.delete('foo.bar.a');
        assert.equal(param.get('foo'), 'bar');
        param.delete('foo');
        assert.equal(param.get('foo'), null);

        assert.equal(param.get('a.b.c'), 0);
        param.delete('a');
        assert.equal(param.get('a.b.c'), null);
        assert.equal(param.get('a.b'), null);
        assert.equal(param.get('a'), null);

    });

    it('setSchema', () => {
        let param = new Param({
            foo: 'bar',
            obj: { a: '' },
        });

        param.setSchema({
            'properties': {
                foo: {
                    type: 'string',
                },
                obj: {
                    type: 'object',
                    properties: {
                        a: { type: 'string' }
                    },
                    required: [ 'a' ],
                }
            },
            required: [ 'foo', 'obj' ],
        });

        param.delete('foo').catch(() => {});
        assert.equal(param.get('foo'), 'bar');
    });

    it('setSchema - The metadata is not up to standard', (done) => {
        let param = new Param({
            obj: { a: '' },
        });
        param.setSchema({
            'properties': {
                foo: {
                    type: 'string',
                },
            },
            required: [ 'foo' ],
        })
        .then(() => {
            done('Failure to catch error');
        }).catch((error) => {
            done();
        });
    });

    it('setSchema - append', (done) => {
        let param = new Param({
            foo: '',
        });
        param.setSchema({
            'properties': {
                foo: {
                    type: 'string',
                },
            },
            required: [ 'foo' ],
        }).catch((error) => {
            done(`Set the sechema error`);
        });
        param.append({
            foo: {},
        }).then(() => {
            done('Failure to catch error');
        }).catch(() => {
            done();
        });
    });

    it('setSchema - set', (done) => {
        let param = new Param({
            foo: '',
        });
        param.setSchema({
            'properties': {
                foo: {
                    type: 'string',
                },
            },
            required: [ 'foo' ],
        }).catch((error) => {
            done(`Set the sechema error`);
        });
        param.set('foo', {}).then(() => {
            done('Failure to catch error');
        }).catch(() => {
            done();
        });
    });

    it('setDefault', () => {
        let param = new Param({
            obj: { a: '' },
        });
        param.setDefault({
            foo: 'bar',
        });
        assert.equal(param.get('foo'), 'bar');
    });
});