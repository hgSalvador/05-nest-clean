import { Body, Controller, Get, Query, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "@/auth/jwt-auth.guard"
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe"
import { PrismaService } from "@/prisma/prisma.service"
import { z } from "zod"


const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))


const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
    constructor(private prisma: PrismaService) {}

    @Get()
    async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
        const perPage = 20  
        console.log('Valor:', page)

        const calculate = (page - 1) * perPage
        console.log(calculate)
        const questions = await this.prisma.question.findMany({
            take: perPage,
            skip: (page - 1) * perPage,
            orderBy: {
                createdAt: 'desc'
            }
        })

        return { questions }
    }      
}