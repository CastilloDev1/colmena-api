import { Controller, Post, Body, Param, Get, Delete, ParseUUIDPipe } from '@nestjs/common';
import { MedicalOrderService } from '../services/medical-order.service';
import { CreateMedicalOrderDto } from '../dto/create-medical-order.dto';
import { AttachMedicationDto } from '../../medication/dto/attach-medication.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Medical Orders')
@Controller('medical-orders')
export class MedicalOrderController {
  constructor(private readonly medicalOrderService: MedicalOrderService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear una orden médica',
    description: 'Crea una nueva orden médica asociada a una cita existente'
  })
  @ApiBody({ type: CreateMedicalOrderDto })
  @ApiResponse({ 
    status: 201, 
    description: 'La orden médica ha sido creada exitosamente.',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        appointmentId: '456e7890-e89b-12d3-a456-426614174000',
        description: 'Realizar exámenes de sangre completos',
        specialty: 'Cardiología',
        expirationDate: '2024-12-31T00:00:00.000Z',
        createdAt: '2024-01-15T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 404, description: 'La cita especificada no existe.' })
  async create(@Body() createMedicalOrderDto: CreateMedicalOrderDto) {
    const { appointmentId, ...dto } = createMedicalOrderDto;
    return this.medicalOrderService.create(appointmentId, dto as Omit<CreateMedicalOrderDto, 'appointmentId'>);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener una orden médica por ID',
    description: 'Recupera los detalles de una orden médica específica'
  })
  @ApiParam({ name: 'id', description: 'ID único de la orden médica', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Orden médica encontrada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Orden médica no encontrada.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.medicalOrderService.findById(id);
  }

  @Get('by-appointment/:appointmentId')
  @ApiOperation({ 
    summary: 'Obtener órdenes médicas por ID de cita',
    description: 'Recupera todas las órdenes médicas asociadas a una cita específica'
  })
  @ApiParam({ name: 'appointmentId', description: 'ID de la cita', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de órdenes médicas obtenida exitosamente.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          appointmentId: '456e7890-e89b-12d3-a456-426614174000',
          description: 'Realizar exámenes de sangre completos',
          specialty: 'Cardiología',
          expirationDate: '2024-12-31T00:00:00.000Z',
          createdAt: '2024-01-15T10:30:00.000Z',
          appointment: {
            id: '456e7890-e89b-12d3-a456-426614174000',
            date: '2024-01-15T09:00:00.000Z',
            patient: { name: 'Juan Pérez' },
            doctor: { name: 'Dr. María García' }
          },
          medications: []
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Cita no encontrada.' })
  async findByAppointment(@Param('appointmentId', ParseUUIDPipe) appointmentId: string) {
    return this.medicalOrderService.findByAppointmentId(appointmentId);
  }

  @Post(':medicalOrderId/medications/:medicationId')
  @ApiOperation({ 
    summary: 'Adjuntar medicamento a orden médica',
    description: 'Asocia un medicamento específico a una orden médica con detalles de dosificación'
  })
  @ApiParam({ name: 'medicalOrderId', description: 'ID de la orden médica', format: 'uuid' })
  @ApiParam({ name: 'medicationId', description: 'ID del medicamento', format: 'uuid' })
  @ApiBody({ type: AttachMedicationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Medicamento adjuntado exitosamente a la orden médica.',
  })
  @ApiResponse({ status: 404, description: 'Orden médica o medicamento no encontrado.' })
  @ApiResponse({ status: 409, description: 'El medicamento ya está adjunto a esta orden médica.' })
  async attachMedication(
    @Param('medicalOrderId', ParseUUIDPipe) medicalOrderId: string,
    @Param('medicationId', ParseUUIDPipe) medicationId: string,
    @Body() attachMedicationDto: AttachMedicationDto,
  ) {
    return this.medicalOrderService.attachMedication(medicalOrderId, {
      ...attachMedicationDto,
      medicationId,
    });
  }

  @Get(':medicalOrderId/medications')
  @ApiOperation({ 
    summary: 'Obtener medicamentos de una orden médica',
    description: 'Lista todos los medicamentos asociados a una orden médica específica'
  })
  @ApiParam({ name: 'medicalOrderId', description: 'ID de la orden médica', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de medicamentos obtenida exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Orden médica no encontrada.' })
  async getMedications(@Param('medicalOrderId', ParseUUIDPipe) medicalOrderId: string) {
    return this.medicalOrderService.getMedications(medicalOrderId);
  }

  @Delete(':medicalOrderId/medications/:medicationId')
  @ApiOperation({ 
    summary: 'Desadjuntar medicamento de orden médica',
    description: 'Remueve la asociación entre un medicamento y una orden médica'
  })
  @ApiParam({ name: 'medicalOrderId', description: 'ID de la orden médica', format: 'uuid' })
  @ApiParam({ name: 'medicationId', description: 'ID del medicamento', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Medicamento desadjuntado exitosamente de la orden médica.',
  })
  @ApiResponse({ status: 404, description: 'Orden médica o medicamento no encontrado.' })
  async detachMedication(
    @Param('medicalOrderId', ParseUUIDPipe) medicalOrderId: string,
    @Param('medicationId', ParseUUIDPipe) medicationId: string,
  ) {
    return this.medicalOrderService.detachMedication(medicalOrderId, medicationId);
  }
}
