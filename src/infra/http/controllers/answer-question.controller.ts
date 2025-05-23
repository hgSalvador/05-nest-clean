import { BadRequestException, Body, Controller, Param, Post, UseGuards } from "@nestjs/common"
import { CurrentUser } from "@/auth/current-user-decorator"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { UserPayload } from "@/auth/jwt.strategy"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import { z } from "zod"
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question"


const answerQuestionBodySchema = z.object({
    content: z.string(),
    attachments: z.array(z.string().uuid())
})

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>


@Controller('/questions/:questionId/answers')
@UseGuards(JwtAuthGuard)
export class AnswerQuestionController {
    constructor(private answerQuestion: AnswerQuestionUseCase) {}

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('questionId') questionId: string
    
    ) {
        const { content, attachments } = body
        const userId = user.sub

        const result = await this.answerQuestion.execute({
            content,
            questionId,
            authorId: userId,
            attachmentsIds: attachments
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    } 
}