import { BadRequestException, Controller, Get, HttpCode, Param, Patch } from "@nestjs/common";
import { QuestionPresenter } from "../presenters/question-presenter";
import { QuestionDetailsPresenter } from "../presenters/question-details-presenter";
import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notification";
import { CurrentUser } from "@/auth/current-user-decorator";
import { UserPayload } from "@/auth/jwt.strategy";

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
    constructor(private readNotification: ReadNotificationUseCase) {}

    @Patch()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('notificationId') notificationId: string
    ) {
        const result = await this.readNotification.execute({
            notificationId,
            recipientId: user.sub
        })
        
        if(result.isLeft()) {
            throw new BadRequestException()
        }
    }
}