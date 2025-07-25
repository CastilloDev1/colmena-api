import { Controller, Get, Post, Body, Param, Patch, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { DoctorService } from '../services/doctor.service';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

/**
 * Controlador para la gestión de doctores.
 * Requiere autenticación JWT para todos los endpoints.
 */
@ApiTags('Doctors')
@ApiBearerAuth()
@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  /**
   * Crea un nuevo doctor.
   * Solo ADMIN y RECEPTIONIST pueden crear doctores.
   */
  @Post()
  @HttpCode(201)
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Crear doctor' })
  @ApiBody({ type: CreateDoctorDto })
  @ApiResponse({ status: 201, description: 'Doctor creado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  create(
    @Body() createDoctorDto: CreateDoctorDto,
    @CurrentUser() user: User,
  ) {
    return this.doctorService.create(createDoctorDto);
  }

  /**
   * Obtiene todos los doctores.
   * Todos los roles administrativos pueden ver la lista de doctores.
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Listar doctores' })
  @ApiResponse({ status: 200, description: 'Lista de doctores.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findAll(@CurrentUser() user: User) {
    return this.doctorService.findAll();
  }

  /**
   * Busca un doctor por su ID (documento).
   * Todos los roles administrativos pueden ver detalles de doctores.
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.NURSE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Obtener doctor por ID' })
  @ApiParam({ name: 'id', description: 'id (documento) del doctor' })
  @ApiResponse({ status: 200, description: 'Doctor encontrado.' })
  @ApiResponse({ status: 404, description: 'Doctor no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.doctorService.findOne(id);
  }

  /**
   * Actualiza los datos de un doctor.
   * Solo ADMIN y RECEPTIONIST pueden actualizar doctores.
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Actualizar doctor' })
  @ApiParam({ name: 'id', description: 'id (documento) del doctor' })
  @ApiResponse({ status: 200, description: 'Doctor actualizado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
    @CurrentUser() user: User,
  ) {
    return this.doctorService.update(id, updateDoctorDto);
  }

  /**
   * Elimina un doctor por su ID (documento).
   * Solo ADMIN puede eliminar doctores.
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar doctor' })
  @ApiParam({ name: 'id', description: 'id (documento) del doctor' })
  @ApiResponse({ status: 200, description: 'Doctor eliminado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.doctorService.remove(id);
  }
}
