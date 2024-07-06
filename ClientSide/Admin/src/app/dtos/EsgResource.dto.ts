import { CompanyDto } from "./Company.dto";

export interface EsgResourceDto{
    id?: number;
    
    company: CompanyDto;

    filename:string;
     
    url: string;

    filelocation: string;

    extension: string;

    year: string;
}