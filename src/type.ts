/**
 * 单条队列
 * defer: 待运行的异步函数
 * params?: defer的参数，也可以用bind直接传递
 * 
 */
export interface IQueue {
    defer: Function
    params?: any
}
/**
 * 队列参数
 * children: 队列列表
 * name: 队列唯一标识
 * result: 运行完成后的结果
 * 
 */
export interface IQueues {
    children: Array<IQueue>
    name: string
    result?: any[]
}
/**
 * 队列缓存
 */
export type IQueueTemp = {
    [key: string]: IQueues
}
/**
 * 系统队列
 */
export type IQueueList = Array<IQueue>
/**
 * 队列状态
 */
export type IState = "idle" | "pending" | "fulfilled" | "rejected"
/**
 * 任务队列
 */
export type ITaskQueue = {
    readonly fix: string
    readonly maxLen: number
    queueTemp: IQueueTemp
    queues: IQueueList
    state: IState
    push: (queue: IQueues) => Promise<void>
    unshift: (length: number) => IQueueList
    run: (reject: any) => unknown
    clear: () => void
}
