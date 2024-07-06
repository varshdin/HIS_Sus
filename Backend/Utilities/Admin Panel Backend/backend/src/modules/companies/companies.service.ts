/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CompanyDto from '../../dtos/company.dto';
import { Company } from '../../entitites/companies.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>
  ) {}

  getAllCompanies() {
    return this.companiesRepository.find();
  }

 async saveCompany(company: CompanyDto){

   return await this.companiesRepository.save(company)
}
  async getCompanyByName(companyName:string):Promise<Company | undefined>{

    return  await this.companiesRepository.findOne({where:{
      name:companyName
    }})

  }
  async getCompanyById(companyId:string):Promise<Company | undefined>{ 

    return  await this.companiesRepository.findOne({where:{
      id:companyId
    }})
  }
  
}
