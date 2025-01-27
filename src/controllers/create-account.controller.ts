import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { hash } from "bcryptjs"
import { z } from "zod"
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe"

const createAccoutBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
})

type CreateAccountBodySchema = z.infer<typeof createAccoutBodySchema>

@Controller('/accounts')
export class CreateAccountController {
    constructor(private prisma: PrismaService) {}

    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createAccoutBodySchema))
    async handle(@Body() body: CreateAccountBodySchema) {
        const { name, email, password} = body

        const userWithSameEmail = await this.prisma.user.findUnique({
            where: {
                email,
            }
        })

        if (userWithSameEmail) {
            throw new ConflictException(
                'User with same e-mail address already exist'
            )
        }

        const hashedPassword = await hash(password, 8)

        await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
    }
}