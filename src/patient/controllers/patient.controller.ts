import { Controller, Get, Post, Body, Param, Patch, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { PatientService } from '../services/patient.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

/**
 * Controlador para la gestión de pacientes.
 * Requiere autenticación JWT para todos los endpoints.
 */
@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patient')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  /**
   * Crea un nuevo paciente.
   * Solo ADMIN y RECEPTIONIST pueden crear pacientes.
   */
  @Post()
  @HttpCode(200)
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Crear paciente' })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({ status: 200, description: 'Paciente creado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  create(
    @Body() createPatientDto: CreatePatientDto,
    @CurrentUser() user: User,
  ) {
    return this.patientService.create(createPatientDto);
  }

  /**
   * Obtiene todos los pacientes.
   * ADMIN, RECEPTIONIST y NURSE pueden ver todos los pacientes.
   * VIEWER solo puede ver (sin modificar).
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Listar pacientes' })
  @ApiResponse({ status: 200, description: 'Lista de pacientes.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findAll(@CurrentUser() user: User) {
    return this.patientService.findAll();
  }

  /**
   * Busca un paciente por su UUID.
   * Todos los roles administrativos pueden ver detalles de pacientes.
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Obtener paciente por ID' })
  @ApiParam({ name: 'id', description: 'ID del paciente' })
  @ApiResponse({ status: 200, description: 'Paciente encontrado.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.patientService.findOne(id);
  }

  /**
   * Actualiza los datos de un paciente.
   * Solo ADMIN y RECEPTIONIST pueden actualizar pacientes.
   * NURSE puede actualizar algunos campos específicos.
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE)
  @ApiOperation({ summary: 'Actualizar paciente' })
  @ApiParam({ name: 'id', description: 'ID del paciente' })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({ status: 200, description: 'Paciente actualizado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @CurrentUser() user: User,
  ) {
    return this.patientService.update(id, updatePatientDto);
  }

  /**
   * Elimina un paciente por su UUID.
   * Solo ADMIN puede eliminar pacientes.
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar paciente' })
  @ApiParam({ name: 'id', description: 'ID del paciente' })
  @ApiResponse({ status: 200, description: 'Paciente eliminado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.patientService.remove(id);
  }
}