import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PatientRepository } from './patient.repository';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  /**
   * Valida si ya existe un paciente con el id o email proporcionado, 
   * si no existe crea un nuevo paciente en la base de datos.
   * @param data Datos del paciente a crear
   */
  async create(data: CreatePatientDto) {
    const patient = await this.patientRepository.findByIdOrEmail(data.id, data.email);
    if (patient) {
      if (patient.id === data.id) {
        throw new InternalServerErrorException('Ya existe un paciente con este id');
      }
      if (patient.email === data.email) {
        throw new InternalServerErrorException('Ya existe un paciente con este email');
      }
    }
    return this.patientRepository.create(data);
  }

  /**
   * Obtiene la lista de todos los pacientes.
   */
  async findAll() {
    return this.patientRepository.findAll();
  }

  /**
   * Busca un paciente por su patientId (UUID).
   * @param patientId UUID del paciente
   * @throws NotFoundException si el paciente no existe
   */
  async findOne(patientId: string) {
    const patient = await this.patientRepository.findOne(patientId);
    if (!patient) throw new NotFoundException('Paciente no encontrado');
    return patient;
  }

  /**
   * Actualiza los datos de un paciente existente.
   * @param patientId UUID del paciente
   * @param data Datos a actualizar
   */
  async update(patientId: string, data: UpdatePatientDto) {
    return this.patientRepository.update(patientId, data);
  }

  /**
   * Elimina un paciente por su patientId (UUID).
   * @param patientId UUID del paciente
   */
  async remove(patientId: string) {
    return this.patientRepository.remove(patientId);
  }
}