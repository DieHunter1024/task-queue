import { type } from "os"

export type ICount = number | string
export interface IQueue {
    fn: Function
    count: ICount
    name?: string
}
export type IQueueList = IQueue[]
export type IState = "pending" | "fulfilled" | "rejected"
export type ITaskQueue = {
    readonly maxLen: number
    count: number
    queues: IQueueList
    state: IState
    push: (queue: IQueue | IQueueList) => void
    unshift: (length: number) => IQueueList
    run: () => Promise<Function[] | void>
    remove: (count?: ICount) => void
    clear: () => void
}
