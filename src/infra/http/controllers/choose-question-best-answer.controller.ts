import { BadRequestException, Controller, HttpCode, Param, Patch, UseGuards } from "@nestjs/common"
import { CurrentUser } from "@/auth/current-user-decorator"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { UserPayload } from "@/auth/jwt.strategy"
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer"


@Controller('/answers/:answerId/choose-as-best')
@UseGuards(JwtAuthGuard)
export class ChooseQuestionBestAnswerController {
    constructor(private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase) {}

    @Patch()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('answerId') answerId: string
    
    ) {
        const userId = user.sub


        const result = await this.chooseQuestionBestAnswer.execute({
            authorId: userId,
            answerId
        })


        if (result.isLeft()) {
            throw new BadRequestException()
        }
    } 
}