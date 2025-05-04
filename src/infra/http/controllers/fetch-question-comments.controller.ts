import { BadRequestException, Controller, Get, Param, Query, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import { z } from "zod"
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments"
import { CommentPresenter } from "../presenters/comment-presenter"
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter"


const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))


const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions/:questionId/comments')
@UseGuards(JwtAuthGuard)
export class FetchQuestionCommentsController {
    constructor(private fetchQuestionsAnswers: FetchQuestionCommentsUseCase) {}

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('questionId') questionId: string
    ) {
        const result = await this.fetchQuestionsAnswers.execute({
            page,
            questionId
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const questionComments = result.value.comments

        return { comments: questionComments.map(CommentWithAuthorPresenter.toHTTP) }
    }      
}