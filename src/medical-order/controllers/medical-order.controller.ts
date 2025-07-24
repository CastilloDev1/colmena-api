import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { MedicalOrderService } from '../services/medical-order.service';
import { CreateMedicalOrderDto } from '../dto/create-medical-order.dto';
import { AttachMedicationDto } from '../../medication/dto/attach-medication.dto';
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

  @Post(':appointmentId/medical-orders/:medicalOrderId/medications')
  @ApiOperation({ summary: 'Adjuntar un medicamento a una orden médica' })
  @ApiParam({ name: 'appointmentId', description: 'ID de la cita' })
  @ApiParam({ name: 'medicalOrderId', description: 'ID de la orden médica' })
  @ApiResponse({ status: 201, description: 'Medicamento adjuntado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Orden médica o medicamento no encontrado.' })
  @ApiResponse({ status: 409, description: 'El medicamento ya está adjunto a esta orden.' })
  attachMedication(
    @Param('appointmentId') appointmentId: string,
    @Param('medicalOrderId') medicalOrderId: string,
    @Body() attachMedicationDto: AttachMedicationDto,
  ) {
    return this.medicalOrderService.attachMedication(medicalOrderId, attachMedicationDto);
  }

  @Delete(':appointmentId/medical-orders/:medicalOrderId/medications/:medicationId')
  @ApiOperation({ summary: 'Desadjuntar un medicamento de una orden médica' })
  @ApiParam({ name: 'medicalOrderId', description: 'ID de la orden médica' })
  @ApiParam({ name: 'medicationId', description: 'ID del medicamento a desadjuntar' })
  @ApiResponse({ status: 200, description: 'Medicamento desadjuntado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Orden médica o medicamento no encontrado.' })
  detachMedication(
    @Param('medicalOrderId') medicalOrderId: string,
    @Param('medicationId') medicationId: string,
  ) {
    return this.medicalOrderService.detachMedication(medicalOrderId, medicationId);
  }

  @Get(':appointmentId/medical-orders/:medicalOrderId/medications')
  @ApiOperation({ summary: 'Obtener todos los medicamentos de una orden médica' })
  @ApiParam({ name: 'appointmentId', description: 'ID de la cita' })
  @ApiParam({ name: 'medicalOrderId', description: 'ID de la orden médica' })
  @ApiResponse({ status: 200, description: 'Lista de medicamentos obtenida exitosamente.' })
  @ApiResponse({ status: 404, description: 'Orden médica no encontrada.' })
  getMedications(
    @Param('appointmentId') appointmentId: string,
    @Param('medicalOrderId') medicalOrderId: string,
  ) {
    return this.medicalOrderService.getMedications(medicalOrderId);
  }
}
