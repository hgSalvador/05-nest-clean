import { UseCaseError } from "@/core/errors/use-case-error";

export class InvalidAttachmentType extends Error implements UseCaseError {
    constructor(type: string) {
        super(`File ${type} is not valid.`)
    }
}