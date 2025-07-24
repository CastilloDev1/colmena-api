import { Controller, Post, Body, Param } from '@nestjs/common';
import { MedicalOrderService } from '../services/medical-order.service';
import { CreateMedicalOrderDto } from '../dto/create-medical-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Appointments')
@Controller('appointments')
export class MedicalOrderController {
  constructor(private readonly medicalOrderService: MedicalOrderService) {}

  @Post(':appointmentId/medical-orders')
  @ApiOperation({ summary: 'Adjuntar una orden médica a una cita' })
  @ApiParam({ name: 'appointmentId', description: 'ID de la cita a la que se adjunta la orden' })
  @ApiResponse({ status: 201, description: 'La orden médica ha sido creada exitosamente.' })
  @ApiResponse({ status: 404, description: 'La cita especificada no existe.' })
  create(
    @Param('appointmentId') appointmentId: string,
    @Body() createMedicalOrderDto: CreateMedicalOrderDto,
  ) {
    return this.medicalOrderService.create(appointmentId, createMedicalOrderDto);
  }
}
