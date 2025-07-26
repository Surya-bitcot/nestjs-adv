import { CreateBus } from "./create-bus.dto";
import { PartialType } from '@nestjs/mapped-types'

export class UpdateBus extends PartialType(CreateBus){  }