import { type } from "os"

export interface IQueue {
    fn: Function
    params?: any[]
    result?: any
}
export interface IQueues {
    children: Array<IQueue>
    name?: string
}
export type IQueueList = Array<IQueue>
export type IState = "idle" | "pending" | "fulfilled" | "rejected"
export type ITaskQueue = {
    readonly maxLen: number
    queues: IQueueList
    state: IState
    push: (queue: IQueues) => void
    unshift: (length: number) => IQueueList
    run: () => unknown
    clear: () => void
}
