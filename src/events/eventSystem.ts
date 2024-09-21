import { IEvent, IEventSystem, IWithEvents } from "./types";
import { Event } from "./event";

export class EventSystem implements IEventSystem {
    private events: { [key: string]: IEvent }
    constructor() {
        this.events = {}
    }
    del(tag: string): IEventSystem {
        delete this.events[tag]
        return this
    }
    add(tag: string): IEventSystem {
        this.events[tag] = new Event(tag)
        return this
    }
    get(tag: string): IEvent | null {
        return this.events[tag] ?? null
    }
    initiate<DT>(tag: string, data: DT): void {
        if (!this.isEventExists(tag)) {
            throw new Error('Event is not exists')
        }
        this.events[tag].initiate(data)
        return
    }
    subscribe(tag: string, entitie: IWithEvents): IEventSystem {
        this.events[tag].subscribe(entitie)
        return this
    }
    unsub(tag: string, id: string): IEventSystem {
        this.events[tag].unsub(id)
        return this
    }
    private isEventExists(tag: string): boolean {
        return this.events[tag] ? true : false
    }
}