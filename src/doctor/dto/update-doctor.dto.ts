import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateDoctorDto } from './create-doctor.dto';

export class UpdateDoctorDto extends OmitType(
  PartialType(CreateDoctorDto),
  ['id'] as const
) {}
