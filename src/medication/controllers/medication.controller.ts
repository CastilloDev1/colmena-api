import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { MedicationService } from '../services/medication.service';
import { CreateMedicationDto } from '../dto/create-medication.dto';
import { UpdateMedicationDto } from '../dto/update-medication.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

/**
 * Controlador para la gestión del catálogo de medicamentos.
 * Requiere autenticación JWT para todos los endpoints.
 */
@ApiTags('Medications')
@ApiBearerAuth()
@Controller('medications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  /**
   * Crea un nuevo medicamento en el catálogo.
   * Solo ADMIN puede crear medicamentos.
   */
  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo medicamento' })
  @ApiResponse({ status: 201, description: 'Medicamento creado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiResponse({ status: 409, description: 'Ya existe un medicamento con ese nombre.' })
  create(
    @Body() createMedicationDto: CreateMedicationDto,
    @CurrentUser() user: User,
  ) {
    return this.medicationService.create(createMedicationDto);
  }

  /**
   * Obtiene todos los medicamentos con filtro opcional por enfermedad.
   * Todos los roles administrativos pueden consultar el catálogo.
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Obtener todos los medicamentos' })
  @ApiQuery({ name: 'disease', required: false, description: 'Filtrar por enfermedad' })
  @ApiResponse({ status: 200, description: 'Lista de medicamentos obtenida exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findAll(
    @CurrentUser() user: User,
    @Query('disease') disease?: string,
  ) {
    if (disease) {
      return this.medicationService.findByDisease(disease);
    }
    return this.medicationService.findAll();
  }

  /**
   * Obtiene un medicamento por ID.
   * Todos los roles administrativos pueden ver detalles de medicamentos.
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Obtener un medicamento por ID' })
  @ApiParam({ name: 'id', description: 'ID del medicamento' })
  @ApiResponse({ status: 200, description: 'Medicamento encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiResponse({ status: 404, description: 'Medicamento no encontrado.' })
  findById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.medicationService.findById(id);
  }

  /**
   * Actualiza un medicamento del catálogo.
   * Solo ADMIN puede actualizar medicamentos.
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar un medicamento' })
  @ApiParam({ name: 'id', description: 'ID del medicamento' })
  @ApiResponse({ status: 200, description: 'Medicamento actualizado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiResponse({ status: 404, description: 'Medicamento no encontrado.' })
  @ApiResponse({ status: 409, description: 'Ya existe un medicamento con ese nombre.' })
  update(
    @Param('id') id: string,
    @Body() updateMedicationDto: UpdateMedicationDto,
    @CurrentUser() user: User,
  ) {
    return this.medicationService.update(id, updateMedicationDto);
  }

  /**
   * Elimina un medicamento del catálogo.
   * Solo ADMIN puede eliminar medicamentos.
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un medicamento' })
  @ApiParam({ name: 'id', description: 'ID del medicamento' })
  @ApiResponse({ status: 200, description: 'Medicamento eliminado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiResponse({ status: 404, description: 'Medicamento no encontrado.' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar porque está en uso.' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.medicationService.remove(id);
  }
}
