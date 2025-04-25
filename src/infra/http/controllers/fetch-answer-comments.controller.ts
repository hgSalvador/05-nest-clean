import { BadRequestException, Controller, Get, Param, Query, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import { CommentPresenter } from "../presenters/comment-presenter"
import { z } from "zod"
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments"

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))


const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/answers/:answerId/comments')
@UseGuards(JwtAuthGuard)
export class FetchAnswerCommentsController {
    constructor(private fetchAnswersAnswers: FetchAnswerCommentsUseCase) {}

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('answerId') answerId: string
    ) {
        const result = await this.fetchAnswersAnswers.execute({
            page,
            answerId
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const answerComments = result.value.answerComments

        return { comments: answerComments.map(CommentPresenter.toHTTP) }
    }      
}