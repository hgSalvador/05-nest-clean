import { BadRequestException, Body, Controller, Delete, HttpCode, Param, Post, Put, UseGuards } from "@nestjs/common"
import { CurrentUser } from "@/auth/current-user-decorator"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { UserPayload } from "@/auth/jwt.strategy"
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment"


@Controller('/questions/comments/:id')
@UseGuards(JwtAuthGuard)
export class DeleteQuestionCommentController {
    constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') questionCommentId: string
    
    ) {
        const userId = user.sub

        const result = await this.deleteQuestionComment.execute({
            authorId: userId,
            questionCommentId
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    } 
}