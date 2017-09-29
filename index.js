'use strict';

const jsen = require('jsen');
const utils = require('./lib/utils');

class Param {

    constructor (json) {
        json = json || {};
        this._schema = null;
        if (typeof json !== 'object' || Array.isArray(json)) {
            console.log(`The incoming parameter must be a json`);
            this._data = {};
            this._cache = JSON.string;
            return;
        }
        this._cache = JSON.stringify(json);
        this._data = JSON.parse(this._cache);
    }

    append (json) {
        if (typeof json !== 'object' || Array.isArray(json)) {
            console.log(`The incoming parameter must be a json`);
            return false;
        }
        Object.keys(json).forEach((key) => {
            let value = json[key];
            if (value && typeof value === 'object') {
                this._data[key] = JSON.parse(JSON.stringify(value));
            } else {
                this._data[key] = value;
            }
        });

        if (this._schema) {
            let error = this._schema(this._data);
            if (error === false) {
                console.warn(this._schema.errors);
                this._data = JSON.parse(this._cache);
                return false;
            } 
        }

        this._cache = JSON.stringify(this._data);
        return true;
    }

    get (path) {
        let paths = path.split('.');
        let target = this._data;
        utils.forEachWithArray(paths, (current, next, index) => {
            if (target && typeof target === 'object' && current in target) {
                target = target[current];
                return true;
            } else {
                target = null;
                return false;
            }
        });

        if (target && typeof target === 'object') {
            target = JSON.parse(JSON.stringify(target));
        }

        return target;
    }

    set (path, value) {
        let paths = path.split('.');
        let target = this._data;
        utils.forEachWithArray(paths, (current, next, index) => {
            // 最后一个数据了
            if (!next) {
                target[current] = value;
                return;
            }

            if (!target || !(current in target) || typeof target[current] !== 'object') {
                if (parseInt(next) == next) {
                    target[current] = [];
                } else {
                    target[current] = {};
                }
            }
            target = target[current];
        });

        if (this._schema) {
            let error = this._schema(this._data);
            if (error === false) {
                console.warn(this._schema.errors);
                this._data = JSON.parse(this._cache);
                return false;
            } 
        }

        this._cache = JSON.stringify(this._data);
        return true;
    }

    delete (path) {
        let paths = path.split('.');
        let last = paths.pop();
        let target = this.get(paths.join('.'));
        if (paths.length === 0) {
            target = this._data;
        }
        if (target && typeof target === 'object') {
            delete target[last];
        }

        if (this._schema) {
            let error = this._schema(this._data);
            if (error === false) {
                console.warn(this._schema.errors);
                this._data = JSON.parse(this._cache);
                return false;
            } 
        }

        this._cache = JSON.stringify(this._data);
        return true;
    }

    setSchema (schema, options) {
        options = options || {};
        options.version = options.version || 'draft-06';
        // options.errorHandler: function(){}, options.formats: {}
        this._schema = new jsen(schema, options);

        let error = this._schema(this._data);
        if (error === false) {
            console.warn(this._schema.errors);
            this._schema = null;
            console.warn(`Schema Settings fail because the original data does not meet the requirements`);
        }
    }
}

module.exports = Param;