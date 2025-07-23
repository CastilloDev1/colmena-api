import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DoctorRepository } from '../repositories/doctor.repository';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(private readonly doctorRepository: DoctorRepository) {}

  /**
   * Valida si ya existe un doctor con el id o email proporcionado, 
   * si no existe crea un nuevo doctor en la base de datos.
   */
  async create(data: CreateDoctorDto) {
    const doctor = await this.doctorRepository.findByIdOrEmail(data.id, data.email);
    if (doctor) {
      if (doctor.id === data.id) {
        throw new InternalServerErrorException('Ya existe un doctor con este id');
      }
      if (doctor.email === data.email) {
        throw new InternalServerErrorException('Ya existe un doctor con este email');
      }
    }
    return this.doctorRepository.create(data);
  }

  /**
   * Obtiene la lista de todos los doctores.
   */
  async findAll() {
    return this.doctorRepository.findAll();
  }

  /**
   * Busca un doctor por su id (documento).
   */
  async findOne(id: string) {
    const doctor = await this.doctorRepository.findOne(id);
    if (!doctor) throw new NotFoundException('Doctor no encontrado');
    return doctor;
  }

  /**
   * Actualiza los datos de un doctor existente.
   */
  async update(id: string, data: UpdateDoctorDto) {
    return this.doctorRepository.update(id, data);
  }

  /**
   * Elimina un doctor por su id (documento).
   */
  async remove(id: string) {
    return this.doctorRepository.remove(id);
  }
}
