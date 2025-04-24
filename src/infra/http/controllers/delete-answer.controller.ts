import { BadRequestException, Body, Controller, Delete, HttpCode, Param, Post, Put, UseGuards } from "@nestjs/common"
import { CurrentUser } from "@/auth/current-user-decorator"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { UserPayload } from "@/auth/jwt.strategy"
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer"


@Controller('/answers/:id')
@UseGuards(JwtAuthGuard)
export class DeleteAnswerController {
    constructor(private deleteAnswer: DeleteAnswerUseCase) {}

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') answerId: string
    
    ) {
        const userId = user.sub

        const result = await this.deleteAnswer.execute({
            authorId: userId,
            answerId
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    } 
}