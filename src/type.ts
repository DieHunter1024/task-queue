export type ICount = number | string
export interface IQueue {
    fn: Function
    count: ICount
    name?: string
}
export type IQueueList = IQueue[]
export type ITaskQueue = {
    readonly maxLen: number
    count: number
    queue: IQueueList
    temp: IQueueList
    pushTemp: (queue: IQueue | IQueueList) => IQueueList
    push: (queue: IQueue | IQueueList, queues: IQueueList) => IQueueList
    unshift: () => IQueueList
    run: () => Promise<Function[] | void>
    remove: (count?: ICount) => IQueueList
    clear: () => void
}
