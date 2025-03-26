import { AppModule } from "@/app.module"
import { PrismaService } from "@/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { Prisma } from "@prisma/client"
import request from 'supertest'

describe('Create question (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)

        await app.init()
    })

    test('[POST] /questions', async () => {
        await prisma.user.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })
        
        const response = await request(app.getHttpServer()).post('/questions').send({
            title:'New Question',
            content: 'Question content'
        })

        expect(response.statusCode).toBe(201)
    })
})
