import { BadRequestException, Body, Controller, Delete, HttpCode, Param, Post, Put, UseGuards } from "@nestjs/common"
import { CurrentUser } from "@/auth/current-user-decorator"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { UserPayload } from "@/auth/jwt.strategy"
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment"



@Controller('/answers/comments/:id')
@UseGuards(JwtAuthGuard)
export class DeleteAnswerCommentController {
    constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') answerCommentId: string
    
    ) {
        const userId = user.sub

        const result = await this.deleteAnswerComment.execute({
            authorId: userId,
            answerCommentId
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    } 
}