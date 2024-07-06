import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { EsgResourceDto } from '../../dtos/esgResource.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../../entitites/companies.entity';

@Module({
  
  imports:[TypeOrmModule.forFeature([Company])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}