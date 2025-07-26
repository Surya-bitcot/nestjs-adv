import { PartialType } from "@nestjs/mapped-types";
import { CreateRouteDto } from "./create-routes.dto";

export class UpdateRouteDto extends PartialType(CreateRouteDto) {

}
