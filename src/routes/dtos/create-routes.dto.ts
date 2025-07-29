import { IsString, IsNumber, Min, IsNotEmpty } from "class-validator";

export class CreateRouteDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    startLocation: string;

    @IsString()
    @IsNotEmpty()
    endLocation: string;

    @IsNumber()
    @Min(0.1)
    distance: number;

    @IsNumber()
    @Min(1)
    duration: number;
}
