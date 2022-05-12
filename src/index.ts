import { decoratorMessageCenter, MessageCenter } from "event-message-center"
import { ITaskQueue, IQueueList, IQueues, IState } from "./type"
@decoratorMessageCenter
class TaskQueue implements ITaskQueue {
    maxLen: number
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
        this.messageCenter.on("run:success:handler", this.run)
        this.messageCenter.on("run:error:handler", this.run)
    }
    push = (queue: IQueues) => {
        this.checkHandler(queue)
        this.queues = this.queues.concat(queue.children)
        this.messageCenter.emit("push:handler", null)
    }
    unshift = (length) => {
        return this.queues.splice(0, length)
    }
    run = async () => {
        if (this.state === 'pending') return void 0
        if (this.queues.length === 0) return this.state = "idle"
        const queues = this.unshift(this.maxLen)
        this.state = "pending"
        try {
            const res = await Promise.all(queues.map(async i => await i.fn(i.params)))
            console.log(res, queues)
            this.state = "fulfilled"
            return this.messageCenter.emit("run:success:handler", res)
        } catch (error) {
            this.state = "rejected"
            return this.messageCenter.emit("run:error:handler", error)
        }
    }
    clear = () => {
        this.queues = []
        this.state = "idle"
        this.messageCenter.clear()
    }
    /**
     * 检查参数是否符合标准
     * @param queue 队列或队列集合
     */
    private checkHandler(queue: IQueues) {
        console.log(queue)
        if (!queue) {
            throw new ReferenceError('queue is not defined')
        }
        if (!(queue.children instanceof Array) || typeof queue !== "object") {
            throw new TypeError(`queue should be an object and queue.children should be an array`);
        }
        const noFn = i => !i.fn || typeof i.fn !== "function"
        if (queue.children?.length === 0) throw new Error('queue.children.length can not be 0')
        if (queue.children?.find((i) => noFn(i))) throw new Error('queueList should have fn')
    }
    private fixStr(str) {
        return `@~&$${str}`
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
const syncFn = (args) => {
    const { resolve, promise } = defer()
    setTimeout(() => {
        resolve(args)
    }, 1000);
    return promise
};

const createFnList = (length) => {
    const task1 = { name: 'task1', children: [] }
    while (length--) {
        task1.children.push({ fn: syncFn, params: 'args' })
    }
    return task1
}
const taskQueue = new TaskQueue({ maxLen: 3 })
const task = createFnList(10)
taskQueue.push(task)
// setTimeout(() => {
//     taskQueue.push(createFnList(20))
// }, 1000)
// setTimeout(() => {
//     taskQueue.push(createFnList(20))
// }, 1000)
// taskQueue.run().then(console.log)
// console.log(list)



