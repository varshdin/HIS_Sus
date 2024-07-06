/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import CompanyDto from '../../dtos/company.dto';
import { CompaniesService } from './companies.service';
@Controller('companies')
export class CompaniesController {

    constructor(private readonly companiesService: CompaniesService) { }

    @Get('company-lists')
    async getCompanies() {
        return this.companiesService.getAllCompanies()
    }

    @Post('create-company')
    async saveCompany(@Body() company: CompanyDto) {

        return await this.companiesService.saveCompany(company)

    }

    @Get('company')
    async getCompany(@Query('id') companyId: string) {
        
        return await this.companiesService.getCompanyById(companyId)
    }

}
