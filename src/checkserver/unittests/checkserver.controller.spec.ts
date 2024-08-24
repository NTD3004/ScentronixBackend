import { CheckserverController } from '@src/checkserver/checkserver.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { PriorityQueue } from '@src/commons/data-structures/priority-queue/priority-queue';
import { HttpStatus } from '@nestjs/common';
import { CheckserverService } from '@src/checkserver/checkserver.service';
import { createRequest, createResponse } from 'node-mocks-http';

describe('CheckserverController', () => {
  let checkserverController: CheckserverController;
  let checkserverService: CheckserverService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [CheckserverController],
      providers: [CheckserverService, PriorityQueue]
    }).compile();
    checkserverService = moduleRef.get<CheckserverService>(CheckserverService);
    checkserverController = moduleRef.get<CheckserverController>(CheckserverController);
  });
  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  describe('listServer', () => {
    const dataProviders = [
      {
        testcase: 'Servers are available.',
        apiResponse: [
          {
            "url": "https://does-not-work.perfume.new",
            "priority": 1
          },
          {
            "url": "http://app.scnt.me",
            "priority": 3
          },
          {
            "url": "https://doesnt-work.github.com",
            "priority": 4
          }
        ],
        expectedResult: [
          {
            "url": "https://does-not-work.perfume.new",
            "priority": 1
          },
          {
            "url": "http://app.scnt.me",
            "priority": 3
          },
          {
            "url": "https://doesnt-work.github.com",
            "priority": 4
          }
        ]
      },
      {
        testcase: 'None of the servers are available.',
        apiResponse: [],
        expectedResult: []
      }
    ];
    test.each(dataProviders)('$testcase', async ({ apiResponse, expectedResult }) => {
      //Given
      const spy = jest.spyOn(checkserverService, 'listOfAvailableSevers').mockResolvedValue(apiResponse);
      const response = createResponse();

      //When
      await checkserverController.listServer(response);

      //Then
      expect(spy).toHaveBeenCalled();
      expect(response._getJSONData()).toMatchObject(expectedResult);
    });
  });
  describe('getServerByPriority', () => {
    const dataProviders = [
      {
        testcase: 'Server is available.',
        dto: {
          priority: 1
        },
        apiResponse: [
          {
            "url": "https://does-not-work.perfume.new",
            "priority": 1
          }
        ],
        expectedResult: [
          {
            "url": "https://does-not-work.perfume.new",
            "priority": 1
          }
        ]
      },
      {
        testcase: 'Server is not available.',
        dto: {
          priority: 4
        },
        apiResponse: [
          {
            "url": "https://does-not-work.perfume.new",
            "priority": 1
          }
        ],
        expectedResult: [
          {
            "url": "https://does-not-work.perfume.new",
            "priority": 1
          }
        ]
      }
    ];
    test.each(dataProviders)('$testcase', async ({ dto, apiResponse, expectedResult }) => {
      //Given
      const spy = jest.spyOn(checkserverService, 'getServer').mockResolvedValue(apiResponse);
      const response = createResponse();

      //When
      await checkserverController.getServerByPriority(dto, response);

      //Then
      expect(spy).toHaveBeenCalled();
      expect(response._getJSONData()).toMatchObject(expectedResult);
    });
  });
});