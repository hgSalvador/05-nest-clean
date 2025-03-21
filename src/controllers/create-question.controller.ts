import { Body, Controller, Post, UseGuards } from "@nestjs/common"
import { CurrentUser } from "@/auth/current-user-decorator"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { UserPayload } from "@/auth/jwt.strategy"
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe"
import { PrismaService } from "@/prisma/prisma.service"
import { z } from "zod"


const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>


@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    constructor(private prisma: PrismaService) {}

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
        @CurrentUser() user: UserPayload
    
    ) {
        const { title, content } = body
        const userId = user.sub

        const slug = this.convertToSlug(title)

        await this.prisma.question.create({
            data: {
                authorId: userId,
                title,
                content,
                slug
            }
        })
    }

    private convertToSlug(title: string): string {
        return title
          .toLowerCase() // Converte tudo para minúsculas
          .normalize('NFD') // Normaliza caracteres acentuados para decomposição
          .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas (acentos)
          .replace(/[^\w\s-]/g, '') // Remove caracteres não alfanuméricos, exceto hífens
          .replace(/\s+/g, '-') // Substitui espaços por hífens
          .replace(/^-+|-+$/g, ''); // Remove hífens no início ou fim
    }
      
}