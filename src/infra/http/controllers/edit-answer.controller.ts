import { BadRequestException, Body, Controller, HttpCode, Param, Post, Put, UseGuards } from "@nestjs/common"
import { CurrentUser } from "@/auth/current-user-decorator"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { UserPayload } from "@/auth/jwt.strategy"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe"
import { z } from "zod"
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer"



const editAnswerBodySchema = z.object({
    content: z.string(),
    attachments: z.array(z.string().uuid()).default([])
})

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>


@Controller('/answers/:id')
@UseGuards(JwtAuthGuard)
export class EditAnswerController {
    constructor(private editAnswer: EditAnswerUseCase) {}

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body:EditAnswerBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') answerId: string
    
    ) {
        const { content, attachments } = body
        const userId = user.sub

        const result = await this.editAnswer.execute({
            content,
            answerId,
            authorId: userId,
            attachmentsIds: attachments
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    } 
}