'use strict';

const utils = require('./lib/utils');

class Param {

    constructor (json) {
        json = json || {};
        if (typeof json !== 'object' || Array.isArray(json)) {
            console.log(`The incoming parameter must be a json`);
            this._data = {};
            return;
        }
        this._data = JSON.parse(JSON.stringify(json));
    }

    append (json) {
        if (typeof json !== 'object' || Array.isArray(json)) {
            console.log(`The incoming parameter must be a json`);
            return;
        }
        Object.keys(json).forEach((key) => {
            let value = json[key];
            if (value && typeof value === 'object') {
                this._data[key] = JSON.parse(JSON.stringify(value));
            } else {
                this._data[key] = value;
            }
        });
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
    }

}

module.exports = Param;