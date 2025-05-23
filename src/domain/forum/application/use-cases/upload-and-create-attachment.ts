import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { StudentsRepository } from '../repositories/students-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'
import { Attachment } from '../../enterprise/entities/attachment'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateAttachmentUseCaseRequest {
    fileName: string
    fileType: string
    body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentType,
  {
    attachment: Attachment  
  }
> 

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader
  ) {}

  async execute({
    fileName,
    fileType,
    body
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {

    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
        return left(new InvalidAttachmentType(fileType))
    }

    const { url } = await this.uploader.upload({
        fileName,
        fileType,
        body
    })

    const attachment = Attachment.create({
        title: fileName,
        url: fileName
    })

    await this.attachmentsRepository.create(attachment)

    return right({
        attachment
    })
  }
}
