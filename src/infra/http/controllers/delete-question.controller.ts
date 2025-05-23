import { BadRequestException, Body, Controller, Delete, HttpCode, Param, Post, Put, UseGuards } from "@nestjs/common"
import { CurrentUser } from "@/auth/current-user-decorator"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { UserPayload } from "@/auth/jwt.strategy"
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question"


@Controller('/questions/:id')
@UseGuards(JwtAuthGuard)
export class DeleteQuestionController {
    constructor(private deleteQuestion: DeleteQuestionUseCase) {}

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') questionId: string
    
    ) {
        const userId = user.sub

        const result = await this.deleteQuestion.execute({
            authorId: userId,
            questionId
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    } 
}