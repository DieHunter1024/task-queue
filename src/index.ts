import { ITaskQueue, IQueueList, ICount, IQueue } from "./type"
// import { messageCenter } from "event-message-center"
const messageCenter = require("event-message-center")

class TaskQueue implements ITaskQueue {
    maxLen: number
    count: number
    queue: IQueueList
    temp: IQueueList
    constructor({ maxLen }) {
        this.maxLen = maxLen
        this.clear()
        console.log(messageCenter)
    }
    pushTemp = (queue) => {
        return this.push(queue, this.temp)
    }
    push = (queue: IQueue | IQueueList, queues: IQueueList = this.queue) => {
        this.checkHandler(queue)
        if (queue instanceof Array) {
            queue = queue.map(i => {
                i.count = ++this.count
                return i
            })
            queues = queues.concat(queue)
        } else if (typeof queue === "object") {
            queues.push({ count: ++this.count, ...queue })
        }
        return queues
    }
    unshift = () => {
        this.queue.unshift()
        return this.queue
    }
    run = () => {
        const { promise, resolve, reject } = this.defer()
        return Promise.all(this.queue.map(i => i.fn))
    }
    remove = (count?: ICount) => {
        count && (this.queue = this.queue.filter((i) => i.count !== count))
        !count && this.clear()
        return this.queue
    }
    clear = () => {
        this.count = 0
        this.queue = []
    }
    private defer() {
        let resolve, reject
        return {
            promise: new Promise<void>((_resolve, _reject) => {
                resolve = _resolve
                reject = _reject
            }),
            resolve, reject
        }
    }
    /**
     * 检查参数是否符合标准
     * @param queue 队列或队列集合
     */
    private checkHandler(queue: IQueue | IQueueList) {
        if (!queue) {
            throw new ReferenceError('queue is not defined')
        }
        if (!(queue instanceof Array) || typeof queue !== "object") {
            throw new TypeError(`queue should be an object or an array`);
        }
        const noFn = i => !i.fn || typeof i.fn !== "function"
        if (queue instanceof Array) {
            if (queue?.length === 0) throw new Error('queue.length can not be 0')
            if (queue.find((i) => noFn(i))) throw new Error('queueList should have fn')
        } else if (typeof queue === "object") {
            if (noFn(queue)) throw new Error('queue should have fn')
        }
    }
}
const syncFn = () => {
    return new Promise((res) => {
        setTimeout(res, 1000);
    });
};
const taskQueue = new TaskQueue({ maxLen: 3 })
const list = taskQueue.pushTemp([{ fn: syncFn }])


