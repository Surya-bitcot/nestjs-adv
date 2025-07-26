import { IsString } from "class-validator";

export class CreateRouteDto {

    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsString()
    startLocation: string;

    @IsString()
    endLocation: string;

    @IsString()
    distance: number;

    @IsString()
    duration: number;
}
