import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { ConfigService } from './config.service';

@Module({
  imports: [ConfigModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigurationModule {}