import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PatientRepository } from '../repositories/patient.repository';
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
    const patient = await this.patientRepository.findByIdentification(data.id);
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
   * Busca un paciente por su id (documento).
   * @param id Documento del paciente
   * @throws NotFoundException si el paciente no existe
   */
  async findOne(id: string) {
    const patient = await this.patientRepository.findByIdentification(id);
    if (!patient) throw new NotFoundException('Paciente no encontrado');
    return patient;
  }

  /**
   * Actualiza los datos de un paciente existente.
   * @param id Documento del paciente
   * @param data Datos a actualizar
   */
  async update(id: string, data: UpdatePatientDto) {
    const patient = await this.patientRepository.findByIdentification(id);
    if (!patient) throw new NotFoundException('Paciente no encontrado');
    return this.patientRepository.update(patient.patientId, data);
  }

  /**
   * Elimina un paciente por su id (documento).
   * @param id Documento del paciente
   */
  async remove(id: string) {
    const patient = await this.patientRepository.findByIdentification(id);
    if (!patient) throw new NotFoundException('Paciente no encontrado');
    return this.patientRepository.remove(patient.patientId);
  }
}