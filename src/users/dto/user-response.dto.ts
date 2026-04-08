import { Company } from 'src/companies/company.entity';

export class UserResponseDto {
  id: number;
  name: string;
  lastname: string;
  username: string;
  email: string;
  role: number;
  active: boolean;
  phone: string;
  cedula: number;
  icon?: string;
  mobileVersion?: string;
  company?: Company;
}
