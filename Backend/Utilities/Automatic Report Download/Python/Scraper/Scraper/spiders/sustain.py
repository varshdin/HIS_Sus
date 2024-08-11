from scrapy.spiders import CrawlSpider, Rule
import pandas as pd
import Scraper.name_filter as filter
import scrapy
import os
import boto3

## SETUP AWS CLIENT ##
# client = boto3.client('s3',
#                       region_name='eu-central-1',
#                       aws_access_key_id='AKIA3ZRSYJMXJIEEX77N',
#                       aws_secret_access_key='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'
#                       )

client = boto3.client('s3',
                      region_name='',
                      aws_access_key_id='',
                      aws_secret_access_key=''
                      )


class Companies():
    # set directory to companies_list.xlsx file"
    company_list = pd.read_excel("/home/sbarvaliya/Documents/HIS_Sus/Backend/Utilities/Automatic Report Download/Python/companies_list.xlsx",
                                 sheet_name="AllCompanies",
                                 engine="openpyxl")
    report_urls = company_list['Page containing report'].tolist()
    company_name = company_list['Company Name'].tolist()
    root_path = "./File_filtered/"

    def make_company_folder(self):
        for names in self.company_name:
            company_folder = os.path.join(self.root_path, names)
            if not os.path.exists(company_folder):
                os.makedirs(company_folder)
        return self.company_name


class SustainSpider(scrapy.Spider):
    name = 'sustain'
    companies = Companies()
    company_name = companies.make_company_folder()
    start_urls = companies.report_urls

    ## PARSING FUNCTION OF SCRAPY ##
    def parse(self, response):
        url = response.url  # get response from start_urls
        index = self.start_urls.index(url)
        current_company = self.company_name[index]
        # get all elements containing pdf download link
        links = response.xpath('//a[contains(@href, "pdf")]/@href').getall()
        if links == []:
            # get all URLs if pdf download link not found
            links = response.css('a::attr(href)').extract()
            for pdfurl in links:
                pdfurl = response.urljoin(pdfurl)
                yield scrapy.Request(pdfurl, callback=self.download_pdf_to_s32, meta={'url': url, 'path': pdfurl,
                                                                                      'Company': current_company})  # download files
        else:
            for pdfurl in links:
                pdfurl = response.urljoin(pdfurl)
                yield scrapy.Request(pdfurl, callback=self.download_pdf_to_s3, meta={'url': url, 'path': pdfurl,
                                                                                     'Company': current_company})  # download files

    ## DOWNLOAD PDF TO LOCAL MACHINE FUNCTION ##
    # def download_pdf(self, response):
    #     current_company = response.meta.get('Company')
    #     savepath = "./File_filtered/" + current_company             #file save location
    #     path = response.url.split('/')[-1]                          #file name
    #     if filter.name_filter(path, current_company) == True:               #find key words in filename
    #         self.logger.info('Saving PDF %s', path)
    #         completeName = os.path.join(savepath, path)
    #         with open(completeName, 'wb') as f:
    #             f.write(response.body)                              #write pdf file into folder
    #     else: return

    ## DOWNLOAD TO S3 BUCKET FUNCTION ##
    def download_pdf_to_s3(self, response):
        filename = response.url.split('/')[-1]  # get filename from URL
        current_company = response.meta.get('Company')
        bucket = 'files.sustainabilitymonitor.org'
        key = 'sustainability-reports/g4/' + current_company + '/' + filename
        # result = client.list_objects_v2(Bucket=bucket, Prefix=key)
        # if 'Contents' in result:
        #     print("Key exists in the bucket.")
        # else:
        #     print("Key doesn't exist in the bucket.")
        if filter.name_filter(filename) == True:
            try:
                client.put_object(Body=response.body,
                                  Bucket=bucket,
                                  Key=key,
                                  ContentType='application/pdf')
            except ClientError as e:
                print(e)

    ## DOWNLOAD TO S3 BUCKET, FOR DOWNLOAD LINKS LACK FILENAME ##
    def download_pdf_to_s32(self, response):
        # if URL does not contain filename
        type = response.headers.getlist('Content-Type')
        type = type[0].decode('utf-8')
        print(type)
        if type == "application/pdf":
            # get filename from response header
            header = response.headers.getlist('Content-Disposition')
            filename = header[0].decode('utf-8').split('"')[1]
            current_company = response.meta.get('Company')
            bucket = 'files.sustainabilitymonitor.org'  # set bucket
            key = 'sustainability-reports/g4/' + current_company + '/' + filename  # set key
            if filter.name_filter(filename) == True:
                try:
                    client.put_object(Body=response.body,
                                      Bucket=bucket,
                                      Key=key,
                                      ContentType='application/pdf')
                except ClientError as e:
                    print(e)
