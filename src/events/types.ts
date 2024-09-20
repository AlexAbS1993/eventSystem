export interface IEventSystem {
    add(tag: string): IEventSystem
    get(tag: string): IEvent | null
    initiate<DT>(tag: string, data: DT): void
    subscribe(tag: string, entitie: IWithEvents): IEventSystem
    unsub(tag: string, id: string): IEventSystem
}

export interface IEvent {
    tag: string
    subscribers: IWithEvents[]
    subscribe(entitie: IWithEvents): void
    unsub(id: string): void
    initiate<DT>(data: DT): void
}

export interface IWithEvents {
    id: string
    eventSystem: IEventSystem
    initiate<DT>(tag: string, data: DT): void
    handle<DT>(tag: string, data: DT): void
}