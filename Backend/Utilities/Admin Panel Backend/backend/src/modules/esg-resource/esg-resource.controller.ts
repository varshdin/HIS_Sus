/* eslint-disable prettier/prettier */
import {
  Controller,
  Delete,
  Get,
  ParseArrayPipe,
  Query,
} from '@nestjs/common';
import { EsgResourceService } from './esg-resource.service';

@Controller('esg-resource')
export class EsgResourceController {
  constructor(private esgResourceService: EsgResourceService) { }

  @Get('get-resource')
  async getResourceLinks(
    @Query('resourceLink') resourceLink: string,
    @Query('company') company: string
  ): Promise<any> {
    return await this.esgResourceService.extractLinks(resourceLink, company);
  }

  @Get('multiple')
  async downloadMultipleFiles(
    @Query('resourceLinks', new ParseArrayPipe()) resourceLinks: string[],
    @Query('company') company: string
  ): Promise<any> {
    return this.esgResourceService.downloadMultipleFiles(
      resourceLinks,
      company
    );
  }

  @Get('single')
  async downloadSingleFiles(@Query('resourceLink') resourceLink: string, @Query('company') company: string): Promise<any> {

    const response = await this.esgResourceService.saveFiletos3Bucket(
      resourceLink,
      company
    );
    return response;
    
  }

  @Get('resource')
  async getResourceByCompany(@Query('companyId') companyId: string): Promise<any> {

    return await this.esgResourceService.getResourcebyCompanyId(companyId);

  }

  @Delete('remove-resource')
  async removeResource(@Query('id') id: string, @Query('s3Link') s3Link: string) {

    return await this.esgResourceService.removeResourceDb(id, s3Link);

  }
}
