"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
// import { messageCenter } from "event-message-center"
var messageCenter = require("event-message-center");
var TaskQueue = /** @class */ (function () {
    function TaskQueue(_a) {
        var maxLen = _a.maxLen;
        var _this = this;
        this.pushTemp = function (queue) {
            return _this.push(queue, _this.temp);
        };
        this.push = function (queue, queues) {
            if (queues === void 0) { queues = _this.queue; }
            _this.checkHandler(queue);
            if (queue instanceof Array) {
                queue = queue.map(function (i) {
                    i.count = ++_this.count;
                    return i;
                });
                queues = queues.concat(queue);
            }
            else if (typeof queue === "object") {
                queues.push(__assign({ count: ++_this.count }, queue));
            }
            return queues;
        };
        this.unshift = function () {
            _this.queue.unshift();
            return _this.queue;
        };
        this.run = function () {
            var _a = _this.defer(), promise = _a.promise, resolve = _a.resolve, reject = _a.reject;
            return Promise.all(_this.queue.map(function (i) { return i.fn; }));
        };
        this.remove = function (count) {
            count && (_this.queue = _this.queue.filter(function (i) { return i.count !== count; }));
            !count && _this.clear();
            return _this.queue;
        };
        this.clear = function () {
            _this.count = 0;
            _this.queue = [];
        };
        this.maxLen = maxLen;
        this.clear();
        console.log(messageCenter);
    }
    TaskQueue.prototype.defer = function () {
        var resolve, reject;
        return {
            promise: new Promise(function (_resolve, _reject) {
                resolve = _resolve;
                reject = _reject;
            }),
            resolve: resolve,
            reject: reject
        };
    };
    /**
     * 检查参数是否符合标准
     * @param queue 队列或队列集合
     */
    TaskQueue.prototype.checkHandler = function (queue) {
        if (!queue) {
            throw new ReferenceError('queue is not defined');
        }
        if (!(queue instanceof Array) || typeof queue !== "object") {
            throw new TypeError("queue should be an object or an array");
        }
        var noFn = function (i) { return !i.fn || typeof i.fn !== "function"; };
        if (queue instanceof Array) {
            if ((queue === null || queue === void 0 ? void 0 : queue.length) === 0)
                throw new Error('queue.length can not be 0');
            if (queue.find(function (i) { return noFn(i); }))
                throw new Error('queueList should have fn');
        }
        else if (typeof queue === "object") {
            if (noFn(queue))
                throw new Error('queue should have fn');
        }
    };
    return TaskQueue;
}());
var syncFn = function () {
    return new Promise(function (res) {
        setTimeout(res, 1000);
    });
};
var taskQueue = new TaskQueue({ maxLen: 3 });
var list = taskQueue.pushTemp([{ fn: syncFn }, { fn: syncFn }, { fn: syncFn }, { fn: syncFn }, { fn: syncFn }, { fn: syncFn }]);
console.log(list);
