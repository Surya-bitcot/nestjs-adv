import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import {  plainToInstance } from "class-transformer";

export function Serialize(dto: any) {
    return UseInterceptors(new SerializeInterceptor(dto))
}


export class SerializeInterceptor implements NestInterceptor {

    constructor(private dto:any){}

    intercept(context: ExecutionContext, handler: CallHandler) : Observable<any> {
        // it runs before a request is handled by the request handler
        return handler.handle().pipe(
            map((data:any)=> {
                // Run something before the response is sent out
               
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues : true,
                })
            })
        )
    }
}