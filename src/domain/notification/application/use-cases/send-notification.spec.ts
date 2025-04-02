import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notification-repository"
import { SendNotificationUseCase } from "./send-notification"

let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let sut: SendNotificationUseCase


describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be to send a notification', async () => {
    const result = await sut.execute({
        recipientId: '1',
        title: 'Nova notificacao',
        content: 'Conteudo da notificacao'
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(result.value?.notification)
  })
  
})