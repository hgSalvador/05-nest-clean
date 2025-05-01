import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common"
import { CurrentUser } from "@/auth/current-user-decorator"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { UserPayload } from "@/auth/jwt.strategy"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import { z } from "zod"
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question"


const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    attachments: z.array(z.string().uuid())
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>


@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    constructor(private createQuestion: CreateQuestionUseCase) {}

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
        @CurrentUser() user: UserPayload
    
    ) {
        const { title, content, attachments } = body
        const userId = user.sub

        const result = await this.createQuestion.execute({
            title,
            content,
            authorId: userId,
            attachmentsIds: attachments,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    } 
}