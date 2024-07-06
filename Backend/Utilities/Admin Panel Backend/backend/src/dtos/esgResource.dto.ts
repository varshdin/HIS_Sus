import { Company } from "../entitites/companies.entity";
import CompanyDto from "./company.dto";
import { ResourceDto } from "./resource.dto";

export class EsgResourceDto {

    id?: number;
    
    company: CompanyDto;

    filename:string;
     
    url: string;

    filelocation: string;

    extension: string;

    year: string;

  
}
export default EsgResourceDto;