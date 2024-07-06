/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Company } from './entitites/companies.entity';
import { EsgResource } from './entitites/esg-resource.entity';
import { CompaniesModule } from './modules/companies/companies.module';
import { EsgResourceModule } from './modules/esg-resource/esg-resource.module';




@Module({
  imports: [
    EsgResourceModule,
    CompaniesModule,
    TypeOrmModule.forRootAsync({
      imports:[
        ConfigModule.forRoot({
          isGlobal:true,
          envFilePath:".env"
        }
      )],
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => ({
        type:  'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Company,EsgResource],
        synchronize: true,
        autoLoadEntities:true
      }),
    }),
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}