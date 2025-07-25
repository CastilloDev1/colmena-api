import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AppointmentService } from '../services/appointment.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { UpdateAppointmentStatusDto } from '../dto/update-appointment-status.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

/**
 * Controlador para la gestión de citas médicas.
 * Requiere autenticación JWT para todos los endpoints.
 */
@ApiTags('appointments')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  /**
   * Crea una nueva cita médica.
   * Solo ADMIN y RECEPTIONIST pueden crear citas.
   */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Crear cita' })
  @ApiResponse({ status: 200, description: 'Cita creada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() user: User,
  ) {
    return this.appointmentService.create(createAppointmentDto);
  }

  /**
   * Obtiene todas las citas médicas con filtro opcional por fecha.
   * Todos los roles administrativos pueden ver las citas.
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Obtener todas las citas' })
  @ApiResponse({ status: 200, description: 'Lista de todas las citas.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiQuery({ name: 'date', required: false, description: 'Filtrar citas por fecha (YYYY-MM-DD)' })
  findAll(
    @CurrentUser() user: User,
    @Query('date') date?: string,
  ) {
    return this.appointmentService.findAll(date);
  }

  /**
   * Obtiene citas por identificación de usuario (paciente o doctor).
   * Todos los roles administrativos pueden consultar citas por identificación.
   */
  @Get('identification/:id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Obtener citas por identificación de usuario' })
  @ApiParam({ name: 'id', description: 'Identificación de usuario' })
  @ApiResponse({ status: 200, description: 'Citas encontradas.' })
  @ApiResponse({ status: 404, description: 'Citas no encontradas.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findByUserIdentification(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.appointmentService.findByUserIdentification(id);
  }

  /**
   * Actualiza los datos de una cita médica.
   * Solo ADMIN y RECEPTIONIST pueden actualizar citas.
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Actualizar cita' })
  @ApiParam({ name: 'id', description: 'ID de la cita' })
  @ApiResponse({ status: 200, description: 'Cita actualizada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @CurrentUser() user: User,
  ) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  /**
   * Elimina una cita médica.
   * Solo ADMIN puede eliminar citas.
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar cita' })
  @ApiParam({ name: 'id', description: 'ID de la cita' })
  @ApiResponse({ status: 200, description: 'Cita eliminada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.appointmentService.remove(id);
  }

  /**
   * Actualiza el estado de una cita (SCHEDULED/ATTENDED/MISSED).
   * ADMIN, RECEPTIONIST y NURSE pueden cambiar estados.
   */
  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE)
  @ApiOperation({ summary: 'Actualizar el estado de una cita' })
  @ApiResponse({ status: 200, description: 'Estado de la cita actualizado.' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.appointmentService.updateStatus(id, updateAppointmentStatusDto);
  }

  /**
   * Consulta los médicos disponibles para una fecha dada.
   * Todos los roles administrativos pueden consultar disponibilidad.
   */
  @Get('available-doctors')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Obtener médicos disponibles para una fecha' })
  @ApiResponse({ status: 200, description: 'Lista de médicos disponibles.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  async getAvailableDoctors(
    @Query('date') date: string,
    @CurrentUser() user: User,
  ) {
    return this.appointmentService.findAvailableDoctorsByDate(date);
  }
}
