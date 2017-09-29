'use strict';

/**
 * 循环数组，回传本次的 value 和下次 的 value 两个数据
 * @param {array} array
 * @param {function} handler
 */
exports.forEachWithArray = function (array, handler) {
    for (let i=0; i<array.length; i++) {
        let finish = handler.call(array, array[i], array[i+1], i);
        if (finish === false) {
            break;
        }
    }
};