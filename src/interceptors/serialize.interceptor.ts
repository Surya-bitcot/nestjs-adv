import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToInstance } from "class-transformer";

interface ClassConstructor {
    new(...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor) { }

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(
            map((data: any) => {
                // If data contains a "message" field, assume it's not a user object and skip transformation.
                if (data && typeof data === 'object' && data.hasOwnProperty('message')) {
                    return data;
                }
                // Otherwise transform to the provided DTO, exposing only its declared properties
                return plainToInstance(this.dto, data, { excludeExtraneousValues: true });
            }),
        );
    }
}
