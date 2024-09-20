import { IEventSystem, IWithEvents } from '../src/events/types';
import { IEvent, Event } from './../src';
import { beforeEach, describe, test, expect, jest } from '@jest/globals';

const mockTag = 'test_run'
let mockSubscriber: IWithEvents = {
    id: '1',
    eventSystem: {} as IEventSystem,
    initiate: function <DT>(tag: string, data: DT): void {
        throw new Error('Function not implemented.');
    },
    handle: jest.fn((tag: string, data: any) => {
        let { user } = data
        return user + ' declined'
    })
}
let mockSubscriber2: IWithEvents = {
    id: '2',
    eventSystem: {} as IEventSystem,
    initiate: function <DT>(tag: string, data: DT): void {
        throw new Error('Function not implemented.');
    },
    handle: jest.fn((tag: string, data: any) => {
        let { status } = data
        return status + ' accepted'
    })
}
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
    test("event проходит по всем подписчикам и передаёт им объект data. Подписчики обрабатывают данные, реагируя на сигнал эвента", () => {
        event.subscribe(mockSubscriber)
        event.subscribe(mockSubscriber2)
        let mockData = {
            user: "Alex",
            status: "Tester"
        }
        event.initiate<typeof mockData>(mockData)
        expect(mockSubscriber.handle).toBeCalledTimes(1)
        expect(mockSubscriber2.handle).toBeCalledTimes(1)
        expect(mockSubscriber.handle(event.tag, mockData)).toBe("Alex declined")
    })
})