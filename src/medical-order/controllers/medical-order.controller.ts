import { Controller, Post, Body, Param, Get, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { MedicalOrderService } from '../services/medical-order.service';
import { CreateMedicalOrderDto } from '../dto/create-medical-order.dto';
import { AttachMedicationDto } from '../../medication/dto/attach-medication.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

/**
 * Controlador para la gestión de órdenes médicas.
 * Requiere autenticación JWT para todos los endpoints.
 */
@ApiTags('Medical Orders')
@ApiBearerAuth()
@Controller('medical-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalOrderController {
  constructor(private readonly medicalOrderService: MedicalOrderService) {}

  /**
   * Crea una nueva orden médica.
   * Solo ADMIN y RECEPTIONIST pueden crear órdenes médicas.
   */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
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
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiResponse({ status: 404, description: 'La cita especificada no existe.' })
  async create(
    @Body() createMedicalOrderDto: CreateMedicalOrderDto,
    @CurrentUser() user: User,
  ) {
    const { appointmentId, ...dto } = createMedicalOrderDto;
    return this.medicalOrderService.create(appointmentId, dto as Omit<CreateMedicalOrderDto, 'appointmentId'>);
  }

  /**
   * Obtiene una orden médica por ID.
   * Todos los roles administrativos pueden ver órdenes médicas.
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.VIEWER)
  @ApiOperation({ 
    summary: 'Obtener una orden médica por ID',
    description: 'Recupera los detalles de una orden médica específica'
  })
  @ApiParam({ name: 'id', description: 'ID único de la orden médica', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Orden médica encontrada exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiResponse({ status: 404, description: 'Orden médica no encontrada.' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.medicalOrderService.findById(id);
  }

  /**
   * Obtiene órdenes médicas por ID de cita.
   * Todos los roles administrativos pueden consultar órdenes por cita.
   */
  @Get('by-appointment/:appointmentId')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.VIEWER)
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
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada.' })
  async findByAppointment(
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
    @CurrentUser() user: User,
  ) {
    return this.medicalOrderService.findByAppointmentId(appointmentId);
  }

  /**
   * Adjunta un medicamento a una orden médica.
   * Solo ADMIN y NURSE pueden gestionar medicamentos en órdenes.
   */
  @Post(':medicalOrderId/medications/:medicationId')
  @Roles(UserRole.ADMIN, UserRole.NURSE)
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
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiResponse({ status: 404, description: 'Orden médica o medicamento no encontrado.' })
  @ApiResponse({ status: 409, description: 'El medicamento ya está adjunto a esta orden médica.' })
  async attachMedication(
    @Param('medicalOrderId', ParseUUIDPipe) medicalOrderId: string,
    @Param('medicationId', ParseUUIDPipe) medicationId: string,
    @Body() attachMedicationDto: AttachMedicationDto,
    @CurrentUser() user: User,
  ) {
    return this.medicalOrderService.attachMedication(medicalOrderId, {
      ...attachMedicationDto,
      medicationId,
    });
  }

  /**
   * Obtiene medicamentos de una orden médica.
   * Todos los roles administrativos pueden ver medicamentos asociados.
   */
  @Get(':medicalOrderId/medications')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.VIEWER)
  @ApiOperation({ 
    summary: 'Obtener medicamentos de una orden médica',
    description: 'Lista todos los medicamentos asociados a una orden médica específica'
  })
  @ApiParam({ name: 'medicalOrderId', description: 'ID de la orden médica', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de medicamentos obtenida exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiResponse({ status: 404, description: 'Orden médica no encontrada.' })
  async getMedications(
    @Param('medicalOrderId', ParseUUIDPipe) medicalOrderId: string,
    @CurrentUser() user: User,
  ) {
    return this.medicalOrderService.getMedications(medicalOrderId);
  }

  /**
   * Desadjunta un medicamento de una orden médica.
   * Solo ADMIN puede remover medicamentos de órdenes.
   */
  @Delete(':medicalOrderId/medications/:medicationId')
  @Roles(UserRole.ADMIN)
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
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiResponse({ status: 404, description: 'Orden médica o medicamento no encontrado.' })
  async detachMedication(
    @Param('medicalOrderId', ParseUUIDPipe) medicalOrderId: string,
    @Param('medicationId', ParseUUIDPipe) medicationId: string,
    @CurrentUser() user: User,
  ) {
    return this.medicalOrderService.detachMedication(medicalOrderId, medicationId);
  }
}
