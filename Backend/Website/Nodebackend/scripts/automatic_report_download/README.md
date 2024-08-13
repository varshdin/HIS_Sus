# Web Scraping for Reports using Python

This software module is Team 4's implementation of the Automatic Report Download feature for Sustainability Monitor project. Using Open sourced library Scrapy,
the program retrieves all company names and download URLs in the maintenance file companies_list.xlsx, scrape each links for all PDF files available, download files
containing keywords of choice and uploads them to S3 bucket.

Currently, the program is able to automatically download reports from 71 companies from the total of 101 in the list.

## Installation

Install all necessary libraries inside requirements.txt, preferably in a virtual environment

```bash
pip install -r /path/to/requirements.txt
```

## Running the program

If you're running the program for the first time, edit some of the necessary variables:

```python
client = boto3.client('s3', 
                    region_name= 'S3-SERVER', 
                    aws_access_key_id= 'YOUR_ACCESS_KEY_ID', 
                    aws_secret_access_key= 'YOUR_SECRET_ACCESS_KEY'
                    )
```
```python
company_list = pd.read_excel("Path/to/maintenance/file/companies_list.xlsx", 
                                 sheet_name="AllCompanies", 
                                 engine="openpyxl")
```

Scrapy use command prompt on Windows, or terminal equivalent on Linux to execute

```bash
scrapy crawl sustain
```

**sustain** is the name of the spider program used. You can change it in Scraper/spiders/sustain.py along with the filename sustain.py

```python
class SustainSpider(scrapy.Spider):
    name = 'sustain'
```

## Optimizing

In order to acquire more reports with the program, you can fine tune the keywords used in names_filter.py.
A strong, more detailed name filter could result in many more reports retrievalbe.

```python
words = ["non_financial", "non-financial", "nonfinancial", "sustainable", "sustainability", 
    "nichtfinanzieller", "NFR", "environmental", "nachhaltig", "nachhaltigkeit", "nhb", "annual", "sr", "cr"]       #list of allowed keywords
exclude_words = ["half", "halb", "quarter", "quartal", "quarterly" "q1", "q2", "q3", "analyst"]         #list of excluded keywords
```
Some of the websites use random filename, such as Evotec.

![Screenshot 2023-03-05 091227](https://user-images.githubusercontent.com/76883116/222949564-5f9563c6-1aa7-4d12-9518-d7b6ad8072b8.png)

Such cases are impossible to generalize, but we can add exceptions into the filter function later on



