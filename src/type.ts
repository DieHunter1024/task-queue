export type ICount = number | string
export interface IQueue {
    fn: Function
    count: ICount
    name?: string
}
export type ITaskQueue = {
    readonly maxLen: number
    queue: IQueue[]
    push: (queue: IQueue) => IQueue
    unshift: (length?: number) => IQueue
    run: () => IQueue
    remove: (count?: ICount) => IQueue
}
