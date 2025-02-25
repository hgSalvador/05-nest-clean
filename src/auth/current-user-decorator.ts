import { ExecutionContext, createParamDecorator } from "@nestjs/common"
import { UserPayload } from "./jwt.strategy"


export const CurrentUser = createParamDecorator(
    (_: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest() 
        console.log('oi')
        console.log(request)

        return request.user as UserPayload
    }
)