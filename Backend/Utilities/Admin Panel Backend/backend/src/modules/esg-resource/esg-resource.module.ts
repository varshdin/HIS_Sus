import { Module } from '@nestjs/common';
import { EsgResourceController } from './esg-resource.controller';
import { EsgResourceService } from './esg-resource.service';
import { HttpModule} from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm';
import { EsgResource } from '../../entitites/esg-resource.entity';
import { Company } from '../../entitites/companies.entity';
import { CompaniesModule } from '../companies/companies.module';
import { CompaniesService } from '../companies/companies.service';
@Module({
  
  imports:[HttpModule,TypeOrmModule.forFeature([EsgResource,Company]),CompaniesModule],
  controllers: [EsgResourceController],
  providers: [EsgResourceService,CompaniesService],
})
export class EsgResourceModule {}
