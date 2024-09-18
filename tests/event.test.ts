import { IWithEvents } from '../src/events/types';
import { IEvent, Event } from './../src';
import { beforeEach, describe, test, expect } from '@jest/globals';

const mockTag = 'test_run'
describe("Сущность IEvent представляет собой объект с методами для одного эвента", () => {
    let event: IEvent
    beforeEach(() => {
        event = new Event(mockTag)
    })
    test("event является инстансом класса Event", () => {
        expect(event instanceof Event).toBe(true)
    })
    test("event может подписывать новые сущности", () => {
        //@ts-ignore
        const mockEntitie = { handle: 1, eventSystem: 1, id: 1, initiate: 1 } as IWithEvents
        event.subscribe(mockEntitie)
        expect(event.subscribers.length).toBe(1)
    })
    test("event не допускает передачу в subscribers сущности неподходящего интерфейса", () => {
        const mockEntitie = {} as IWithEvents
        expect(event.subscribe.bind(event, mockEntitie)).toThrow()
    })
    test("event не против передачи в subscribers той же сущности. Она просто будет проигнорирована", () => {
        //@ts-ignore
        const mockEntitie = { handle: 1, eventSystem: 1, id: 1, initiate: 1 } as IWithEvents
        event.subscribe(mockEntitie)
        expect(event.subscribers.length).toBe(1)
        event.subscribe(mockEntitie)
        expect(event.subscribers.length).toBe(1)
    })
    test("Удаляет подписчика по id", () => {
        //@ts-ignore
        const mockEntitie = { handle: 1, eventSystem: 1, id: "1", initiate: 1 } as IWithEvents
        event.subscribe(mockEntitie)
        event.unsub("1")
        expect(event.subscribers.length).toBe(0)
    })
})