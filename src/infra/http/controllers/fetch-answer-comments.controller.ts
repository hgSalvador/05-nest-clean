import { BadRequestException, Controller, Get, Param, Query, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import { z } from "zod"
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments"
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter"

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

        const answerComments = result.value.comments

        return { comments: answerComments.map(CommentWithAuthorPresenter.toHTTP) }
    }      
}