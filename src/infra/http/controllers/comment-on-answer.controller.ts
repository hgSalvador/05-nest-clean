import { BadRequestException, Body, Controller, Param, Post, UseGuards } from "@nestjs/common"
import { CurrentUser } from "@/auth/current-user-decorator"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { UserPayload } from "@/auth/jwt.strategy"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import { z } from "zod"
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer"


const commentOnAnswerBodySchema = z.object({
    content: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>


@Controller('/answers/:answerId/comments')
@UseGuards(JwtAuthGuard)
export class CommentOnAnswerController {
    constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('answerId') answerId: string
    
    ) {
        const { content } = body
        const userId = user.sub

        const result = await this.commentOnAnswer.execute({
            content,
            answerId,
            authorId: userId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    } 
}