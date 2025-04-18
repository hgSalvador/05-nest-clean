import { faker } from '@faker-js/faker'

import { UniqueEntityID } from "@/core/entities/unique.entity-id"
import { AnswerComment, AnswerCommentProps } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comments-mapper'

export function makeAnswerComment(
    override: Partial<AnswerCommentProps> = {},
    id?: UniqueEntityID
) {
    const answerComment = AnswerComment.create({
        authorId: new UniqueEntityID(),
        answerId: new UniqueEntityID(),
        content: faker.lorem.text(),
        ...override,
    }, id)

    return answerComment
}

@Injectable()
export class AwnserCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerCommentProps> = {}): Promise<AnswerComment> {
    const awnserComment = makeAnswerComment(data)

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(awnserComment)
    })

    return awnserComment
  }
}