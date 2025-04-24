import { BadRequestException, Controller, Get, Param, Query, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import { z } from "zod"
import { QuestionPresenter } from "../presenters/question-presenter"
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers"
import { AnswerPresenter } from "../presenters/answer-presenter"


const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))


const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions/:questionId/answers')
@UseGuards(JwtAuthGuard)
export class FetchQuestionAnswersController {
    constructor(private fetchQuestionsAnswers: FetchQuestionAnswersUseCase) {}

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

        const answers = result.value.answers

        return { answers: answers.map(AnswerPresenter.toHTTP) }
    }      
}