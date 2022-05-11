import { decoratorMessageCenter, MessageCenter } from "event-message-center"
import { ITaskQueue, IQueueList, ICount, IQueue, IState } from "./type"
@decoratorMessageCenter
class TaskQueue implements ITaskQueue {
    maxLen: number
    count: number
    queues: IQueueList
    state: IState
    messageCenter: MessageCenter
    constructor({ maxLen }) {
        this.maxLen = maxLen
        this.clear()
        this.initEvent()
    }
    initEvent = () => {
        this.messageCenter.on("push:handler", this.run)
        this.messageCenter.on("run:handler", this.run)
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
        this.messageCenter.emit("push:handler", null)
    }
    unshift = (length) => {
        return this.queues.splice(0, length)
    }
    run = async () => {
        if (this.state === 'pending' || this.queues.length === 0) return
        const queues = this.unshift(this.maxLen)
        this.state = "pending"
        try {
            const res = await Promise.all(queues.map(async i => await i.fn()))
            this.state = "fulfilled"
            this.messageCenter.emit("run:handler", res)
        } catch (error) {
            this.state = "fulfilled"
            this.messageCenter.emit("run:handler", error)
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
        this.messageCenter.clear()
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
const defer = () => {
    let resolve, reject
    return {
        promise: new Promise<void>((_resolve, _reject) => {
            resolve = _resolve
            reject = _reject
        }),
        resolve, reject
    }
}
const syncFn = (r: any) => {
    const { resolve, promise } = defer()
    setTimeout(resolve.bind(this, r), 5000);
    return promise
};

const createFnList = (length) => {
    let arr = []
    while (length--) {
        arr.push({ fn: syncFn })
    }
    return arr
}
const taskQueue = new TaskQueue({ maxLen: 3 })
// taskQueue.push(createFnList(10))
async function init() {
    await syncFn('bbb')
    console.log('aaa')
}
init()
// setTimeout(() => {
//     taskQueue.push(createFnList(20))
// }, 1000)
// setTimeout(() => {
//     taskQueue.push(createFnList(20))
// }, 1000)
// taskQueue.run().then(console.log)
// console.log(list)



