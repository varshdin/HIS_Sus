import { Type } from 'class-transformer';
import { Entity, Column, JoinColumn, OneToOne, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Company } from './companies.entity';

@Entity()
export class EsgResource {
    @PrimaryGeneratedColumn()
    id: string;
    @ManyToOne(() => Company)
    @JoinColumn()
    company: Company;

    @Column()
    filename: string;

    @Column()
    url: string;

    @Column()
    filelocation: string;

    @Column()
    extension: string;

    @Column()
    year: string;
   
}
