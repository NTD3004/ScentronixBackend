import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PriorityQueue } from '@src/commons/data-structures/priority-queue/priority-queue';
import { PriorityQueueInterface, NodeQueueInterface } from '@src/commons/data-structures/priority-queue/priority-queue.interface';
import { GetServerDto } from '@src/checkserver/dto/GetServer.dto';

@Injectable()
export class CheckserverService {
  private readonly data = [
    {
      "url": "https://does-not-work.perfume.new",
      "priority": 1
    },
    {
      "url": "https://gitlab.com",
      "priority": 4
    },
    {
      "url": "https://github.com",
      "priority": 4
    },
    {
      "url": "https://doesnt-work.github.com",
      "priority": 4
    },
    {
      "url": "http://app.scnt.me",
      "priority": 3
    },
    {
      "url": "https://offline.scentronix.com",
      "priority": 2
    }
  ];

  @Inject(PriorityQueue)
  private priorityQueue: PriorityQueueInterface;

  constructor(
    private readonly httpService: HttpService
  ) {}

  /**
   *  @returns {Promise<any>}
   */
  private callServer(): Promise<any> {
    return Promise.allSettled(this.data.map((item) => this.httpService.axiosRef.get(item.url)));
  }

  private async failureDetection() {
    const responses = await this.callServer();
    responses.forEach((response, index) => {
      const data = this.data[index];
      if (response.status !== 'rejected'
        && (response.value && response.value.status && Math.floor(response.value.status/100) === 2)
      ) this.priorityQueue.enqueue(data, data.priority);
    });
  }

  /**
   * @returns {Promise<any[]>} An array of servers
   */
  async listOfAvailableSevers(): Promise<any[]> {
    await this.failureDetection();
    const result = [];
    while (this.priorityQueue.size() > 0) {
      const item: NodeQueueInterface = this.priorityQueue.dequeue();
      result.push(item.val);
    }
    return result;
  }

  /**
   * @param {GetServerDto} getServerDto
   * @returns {Promise<any[]>} An array of servers
   */
  async getServer(getServerDto: GetServerDto): Promise<any[]> {
    await this.failureDetection();
    const result = [];
    while (this.priorityQueue.size() > 0) {
      const item: NodeQueueInterface = this.priorityQueue.dequeue();
      if (item.val.priority === getServerDto.priority) result.push(item.val);
    }
    return result;
  }
}