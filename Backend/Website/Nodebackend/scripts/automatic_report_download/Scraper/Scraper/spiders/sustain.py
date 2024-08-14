from scrapy.spiders import CrawlSpider, Rule
import pandas as pd
import Scraper.name_filter as filter
import scrapy
import os
import boto3
from botocore.exceptions import ClientError


## SETUP AWS CLIENT ##
client = boto3.client(
    's3',
    # Default region if not set
    region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)


def check_s3_bucket_connection(bucket_name):
    try:
        client.head_bucket(Bucket=bucket_name)
        print(f"Successfully connected to the S3 bucket: {bucket_name}")
        return True
    except ClientError as e:
        print(f"Failed to connect to the S3 bucket: {bucket_name}")
        print(f"Error: {e}")
        return False


class Companies:
    # set directory to companies_list.xlsx file
    company_list = pd.read_excel(
        os.getenv('COMPANY_LISTS_FILE_PATH'),
        sheet_name="AllCompanies",
        engine="openpyxl"
    )
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
    bucket_name = 'internal.sustainabilitymonitor.org'  # Set your S3 bucket name

    def start_requests(self):
        # Check if the S3 bucket is connected before making requests
        if check_s3_bucket_connection(self.bucket_name):
            for url in self.start_urls:
                yield scrapy.Request(url, self.parse)
        else:
            self.logger.error(
                f"Cannot proceed as the S3 bucket '{self.bucket_name}' is not accessible.")

    ## PARSING FUNCTION OF SCRAPY ##
    def parse(self, response):
        url = response.url  # get response from start_urls
        if url is not None:
            index = self.start_urls.index(url)
            current_company = self.company_name[index]
            # get all elements containing pdf download link
            links = response.xpath(
                '//a[contains(@href, "pdf")]/@href').getall()
            if not links:
                # get all URLs if pdf download link not found
                links = response.css('a::attr(href)').extract()
                for pdfurl in links:
                    pdfurl = response.urljoin(pdfurl)
                    yield scrapy.Request(
                        pdfurl,
                        callback=self.download_pdf_to_s32,
                        meta={'url': url, 'path': pdfurl,
                              'Company': current_company}
                    )  # download files
            else:
                for pdfurl in links:
                    pdfurl = response.urljoin(pdfurl)
                    yield scrapy.Request(
                        pdfurl,
                        callback=self.download_pdf_to_s3,
                        meta={'url': url, 'path': pdfurl,
                              'Company': current_company}
                    )  # download files

    ## DOWNLOAD TO S3 BUCKET FUNCTION ##
    def download_pdf_to_s3(self, response):
        filename = response.url.split('/')[-1]  # get filename from URL
        current_company = response.meta.get('Company')
        key = f'staging/{current_company}/{filename}'

        if filter.name_filter(filename):
            try:
                client.put_object(
                    Body=response.body,
                    Bucket=self.bucket_name,
                    Key=key,
                    ContentType='application/pdf'
                )
                self.logger.info(
                    f'Successfully uploaded {filename} to {self.bucket_name}/{key}')
            except ClientError as e:
                self.logger.error(f'Failed to upload {filename} to S3: {e}')

    ## DOWNLOAD TO S3 BUCKET, FOR DOWNLOAD LINKS LACKING FILENAME ##
    def download_pdf_to_s32(self, response):
        content_type = response.headers.get('Content-Type').decode('utf-8')
        if content_type == "application/pdf":
            header = response.headers.get('Content-Disposition')
            if header:
                filename = header.decode(
                    'utf-8').split('filename=')[-1].strip('"')
                current_company = response.meta.get('Company')
                key = f'staging/{current_company}/{filename}'

                if filter.name_filter(filename):
                    try:
                        client.put_object(
                            Body=response.body,
                            Bucket=self.bucket_name,
                            Key=key,
                            ContentType='application/pdf'
                        )
                        self.logger.info(
                            f'Successfully uploaded {filename} to {self.bucket_name}/{key}')
                    except ClientError as e:
                        self.logger.error(
                            f'Failed to upload {filename} to S3: {e}')
            else:
                self.logger.warning(
                    f'No Content-Disposition header found for {response.url}')
