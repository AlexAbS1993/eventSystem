import { IEventSystem, IWithEvents } from '../src/events/types';
import { beforeEach, describe, test, expect, jest } from '@jest/globals';
import { EventSystem, Event } from '../src'

describe("EventSystem позволяет хранить и добавлять эвенты, а также инициировать их, будучи частью IWithEvents", () => {
    let eventSystem: IEventSystem
    let mockEntitie: IWithEvents
    beforeEach(() => {
        eventSystem = new EventSystem()
        mockEntitie = {
            id: '1',
            eventSystem: eventSystem as IEventSystem,
            initiate: function <DT>(tag: string, data: DT): void {
                mockEntitie.eventSystem.initiate(tag, data)
                return
            },
            handle: jest.fn((tag: string, data: any) => {
                let { user } = data
                return user + ' declined'
            })
        }
    })
    test('eventSystem является инстансом EventSystem', () => {
        expect(eventSystem instanceof EventSystem).toBe(true)
    })
    test("Может добавлять и получать эвенты", () => {
        eventSystem.add('mock_2')
        expect(eventSystem.get("mock_2") instanceof Event).toBe(true)
        expect(eventSystem.get('mock_2')?.tag).toBe('mock_2')
        expect(eventSystem.get('hello')).toBe(null)
    })
    test("Можно удалять эвенты из системы", () => {
        eventSystem.add('mock')
        eventSystem.del('mock')
        expect(eventSystem.get('mock')).toBe(null)
    })
    test("Можно подписываться на эвенты и отписываться от них", () => {
        eventSystem.add('mock')
        eventSystem.subscribe('mock', mockEntitie)
        expect(eventSystem.get('mock')!.subscribers.length).toBe(1)
        eventSystem.unsub('mock', mockEntitie.id)
        expect(eventSystem.get('mock')!.subscribers.length).toBe(0)
    })
    test("event system может инициировать эвент, но выдает ошибку, если эвента не существует", () => {
        eventSystem.add('mock')
        eventSystem.subscribe('mock', mockEntitie)
        eventSystem.initiate('mock', {})
        expect(mockEntitie.handle).toBeCalledTimes(1)
        expect(eventSystem.initiate.bind(eventSystem, 'fake', {})).toThrow()
    })
})