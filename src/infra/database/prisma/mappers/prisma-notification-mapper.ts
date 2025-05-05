import { UniqueEntityID } from "@/core/entities/unique.entity-id";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { Notification as PrismaNotification, Prisma } from "@prisma/client";

export class PrismaNotificationMapper {
    static toDomain(raw: PrismaNotification): Notification {
        return Notification.create({
            title: raw.title,
            content: raw.content,
            recipientId: new UniqueEntityID(raw.recipientId),
            readAt: raw.readAt,
            createdAt: raw.createdAt
        }, 
        new UniqueEntityID(raw.id))
    }

    static toPrisma(notification: Notification): Prisma.NotificationUncheckedCreateInput {
        return {
            id: notification.id.toString(),
            recipientId: notification.recipientId.toString(),
            title: notification.title.toString(),
            content: notification.content.toString(),
            createdAt: notification.createdAt,
        }
    }
}