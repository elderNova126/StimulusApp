import { Module } from '@nestjs/common';
import { ScenarioResolver } from './scenario.resolver';
import { ScenarioService } from './scenario.service';

@Module({
  controllers: [],
  providers: [ScenarioResolver, ScenarioService],
})
export class ScenarioModule {}
