import { IEvent, IWithEvents } from "./types";

export class Event implements IEvent {
    tag: string;
    subscribers: IWithEvents[];
    constructor(tag: string) {
        this.subscribers = []
        this.tag = tag
    }
    /**
     * Метод позволяет совершать подписку на данный эвент
     * @param entitie подписчик должен соответствовать интерфейсу IWithEvents. Он добавляется в массив подписчиков.
     * При инициации эвента через систему активирует у подписчиков метод initiate
     */
    subscribe(entitie: IWithEvents): void {
        this.isIwithEvents(entitie)
        if (this.alreadyInSubs(entitie)) {
            return
        }
        else {
            this.subscribers.push(entitie)
            return
        }
    }
    unsub(id: string): void {
        this.subscribers = this.subscribers.filter(sub => sub.id !== id)
        return
    }
    initiate<DT>(data: DT): void {
        this.subscribers.forEach(sub => sub.handle(this.tag, data))
        return
    }
    private isIwithEvents(entitie: any) {
        if (entitie.eventSystem && entitie.handle && entitie.id && entitie.initiate) {
            return true
        }
        else {
            throw new Error("Не соответствует интерфейсу IWithEvents")
        }
    }
    private alreadyInSubs(entitie: IWithEvents) {
        return this.subscribers.some(sub => sub.id === entitie.id)
    }
}