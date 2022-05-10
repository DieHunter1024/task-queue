import { ITaskQueue, IQueueList, ICount, IQueue, IState } from "./type"
// import { messageCenter } from "event-message-center"
const { MessageCenter } = require("event-message-center")

class TaskQueue implements ITaskQueue {
    maxLen: number
    count: number
    queues: IQueueList
    state: IState
    constructor({ maxLen }) {
        this.maxLen = maxLen
        this.clear()
        console.log(MessageCenter)
    }

    push = (queue: IQueue | IQueueList) => {
        this.checkHandler(queue)
        if (queue instanceof Array) {
            queue = queue.map(i => {
                i.count = ++this.count
                return i
            })
            this.queues = this.queues.concat(queue)
        } else if (typeof queue === "object") {
            this.queues.push({ count: ++this.count, ...queue })
        }
    }
    unshift = () => {
        this.queues.unshift()
    }
    run = async () => {
        const queues = this.queues.length > this.maxLen ? this.queues.splice(0, this.maxLen - 1) : this.queues
        console.log(this.queues.length, queues)
        try {
            const res = await Promise.all(queues.map(i => i.fn))
        } catch (error) {

        }
    }
    remove = (count?: ICount) => {
        count && (this.queues = this.queues.filter((i) => i.count !== count))
        !count && this.clear()
    }
    clear = () => {
        this.count = 0
        this.queues = []
        this.state = "fulfilled"
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
const createFnList = (length) => {
    let arr = []
    while (length--) {
        arr.push({ fn: syncFn })
    }
    return arr
}
const taskQueue = new TaskQueue({ maxLen: 3 })
const list = taskQueue.push(createFnList(10))
taskQueue.run().then(console.log)
// console.log(list)



