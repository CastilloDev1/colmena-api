import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdatePatientDto extends OmitType(
    PartialType(CreatePatientDto),
    ['id'] as const
) {}