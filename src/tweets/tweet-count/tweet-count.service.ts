import { InjectQueue } from '@nestjs/bull';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Queue } from 'bull';
import { Cache } from 'cache-manager';
import { Tweet } from '../entities/tweet.entity';

@Injectable()
export class TweetCountService {
  private limit = 10;
  constructor(
    @InjectModel(Tweet)
    private tweetModel: typeof Tweet,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectQueue('emails')
    private emailsQueue: Queue,
  ) {}

  @Interval(5000)
  async getTweetCount() {
    console.log('looking for tweets');
    let offset = await this.cacheManager.get<number>('tweet-offset');
    offset = offset === undefined ? 0 : offset;
    console.log(`this.limit: ${this.limit}`);
    console.log(`offset: ${offset}`);
    const tweets = await this.tweetModel.findAll({
      offset,
      limit: this.limit,
    });
    console.log(`tweets found: ${tweets.length}`);
    if (tweets.length === this.limit) {
      await this.cacheManager.set('tweet-offset', offset + this.limit, {
        ttl: 1 * 60 * 10,
      });
      console.log('found ' + this.limit, ' more tweets');
      this.emailsQueue.add({ tweets: tweets.map((t) => t.toJSON()) });
    }
  }
}
