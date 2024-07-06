/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import axios from 'axios';
import * as AWS from 'aws-sdk';
import { EsgResource } from '../../entitites/esg-resource.entity';
import { PassThrough } from 'stream';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from '../companies/companies.service';
import { CompanyDto } from '../../dtos/company.dto'
import * as url from 'url';

@Injectable()
export class EsgResourceService {
    constructor(private configService: ConfigService,
        private readonly companiesService: CompaniesService,
        @InjectRepository(EsgResource)
        private resourceRepository: Repository<EsgResource>) { }

    private s3 = new AWS.S3({
        accessKeyId: this.configService.get('AWS_ACCESSKEY'),
        secretAccessKey: this.configService.get("AWS_SECRET"),
        region: "eu-central-1",
    });

    // Extrack all the required Links
    async extractLinks(resourceLink: string, company: string): Promise<any> {
        const resourceUrl = resourceLink
        //extract domain here
        let parsedUrl = url.parse(resourceLink)
        const hostname = parsedUrl.hostname
        const protocol = parsedUrl.protocol
        const html = await axios.get(resourceUrl)
        const $ = cheerio.load(html.data);
        const links = $('a');
        //let resourceLists :EsgResourceDto[] = []
        let urlLists: string[] = []
        links.each((index, item) => {
            const link = $(item).attr('href');

            if (link) {

                if (this.linkCheck(link)) {
                    const extractedLink = link
                    const linkDomain = protocol + "//" + hostname
                    let downloadLink = extractedLink.indexOf('http') == -1 ? linkDomain + extractedLink : extractedLink;
                    urlLists.push(downloadLink)
                }
            }
        })
        return await urlLists
    }

    linkCheck(url: string) {

        const checkArray = ['sustain', 'sustainability', 'green', 'environment', 'social', 'governance', 'esg', 'green', 'co2', 'emission']
        let linkAccepted = false
        const transformedUrl = url.toLowerCase();
        if (this.linkExtensionCheck(url)) {
            linkAccepted = checkArray.some(word => transformedUrl.includes(word)) ? true : false;
        }
        return linkAccepted
    }

    linkExtensionCheck(url: string) {
        const extensions = ['.pdf', '.ppt', '.xlsx', '.csv', '.xls']
        const result = extensions.some(word => url.includes(word));
        if (result)
            return true;
        return false;
    }

    async downloadMultipleFiles(resourceLink: string[], company: string): Promise<any> {
        for (const url of resourceLink) {
            await this.saveFiletos3Bucket(url, company)
        }
    }
    async saveFiletos3Bucket(resourceLink: string, companyName: string): Promise<any> {

        const url = resourceLink.toString()
        const bucket = this.configService.get('S3_BUCKET')
        let parts = url.split('/').pop()
        const fileParts = parts.includes("?") ? parts.split('?')[0].split('.'): parts.split('.')
        const fileName = fileParts.join('.');
        const fileExtension = fileParts.pop();
        const year = await this.getYear(fileName)

        const key = `staging/${companyName}/${year}/${fileName}`;

        const company = await this.companiesService.getCompanyByName(companyName)
        if (company) {

            try {

                const stream = await axios.get(resourceLink, { responseType: "stream" });
                const passThrough = new PassThrough();
                const response = this.s3.upload({ Bucket: bucket, Key: key, Body: passThrough });
                stream.data.pipe(passThrough);
                return response.promise().then((data) => {
                    this.saveLinktoDatabase(company, fileName, url, fileExtension, year, data.Location)
                    return { status: "success" };
                })
                    .catch((e) => {
                        console.error(e)
                        return { status: "error" };
                    });
            } catch (error) {
                ``
                console.error(error);
                return { status: "error" };
            }

        }
        return { status: "error" };
    }

    async getYear(fileName: string) {
      
        const result = fileName.match(/(\d{4})/g);
        const year =  result? result.pop()  : "Other" 
        return year
    }

    async saveLinktoDatabase(company: CompanyDto, fileName: string, url: string, extension: string, year: string, location: string) {
        console.log(location)
        return this.resourceRepository.save({
            company: company,
            filename: fileName,
            url: url,
            filelocation: location,
            extension: extension,
            year: year
        })
    }

    async getResourceByCompany(company: CompanyDto) {
        return await this.resourceRepository.findOne({
            where: {
                company: company
            }
        })
    }

    async fileExistsinDb(company: CompanyDto, fileName: string) {

        this.resourceRepository.findOne({
            where: {
                filename: fileName
            }
        })
    }

    async getResourcebyCompanyId(companyId: string) {
        const company: CompanyDto = await this.companiesService.getCompanyById(companyId)
        return await this.resourceRepository.find({
            where: {
                company: company
            }
        })
    }

    async removeResourceDb(id: string, fileLocation: string) {

        await this.deleteFileFromS3Bucket(fileLocation)
        await this.resourceRepository.delete(id)  
        return { success: true };
    }
    async deleteFileFromS3Bucket(fileLink: string): Promise<void> {
        
        const url = fileLink;
        const bucketName = this.configService.get('S3_BUCKET')
        const parts = url.split("/");
        const index = parts.indexOf(bucketName);
        const fileKey = parts.slice(index + 1).join("/");
        const params = {
           Bucket: bucketName,
           Key: fileKey
         };
       
         await this.s3.deleteObject(params).promise();
    }


}
