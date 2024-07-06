import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Company {

    @PrimaryGeneratedColumn()
    id: string;
  
    @Column({unique: true})
    name:string;
    
    @Column({nullable: true})
    alias: string;

    @Column()
    url: string;
    @Column()
    category: string;
}