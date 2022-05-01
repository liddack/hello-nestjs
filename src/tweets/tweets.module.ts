import { CacheModule, Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tweet } from './entities/tweet.entity';
import { TweetCountService } from './tweet-count/tweet-count.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    CacheModule.register(),
    SequelizeModule.forFeature([Tweet]),
    BullModule.registerQueue({ name: 'emails' }),
  ],
  controllers: [TweetsController],
  providers: [TweetsService, TweetCountService],
})
export class TweetsModule {}
