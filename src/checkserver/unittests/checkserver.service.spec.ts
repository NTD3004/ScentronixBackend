import { CheckserverService } from '@src/checkserver/checkserver.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { PriorityQueue } from '@src/commons/data-structures/priority-queue/priority-queue';
import { HttpStatus } from '@nestjs/common';

describe('CheckServerService', () => {
  let checkserverService: CheckserverService;
  let httpService: HttpService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [CheckserverService, PriorityQueue],
    }).compile();
    checkserverService = moduleRef.get<CheckserverService>(CheckserverService);
    httpService = moduleRef.get<HttpService>(HttpService);
  });
  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });
  describe('listOfAvailableSevers', () => {
    const dataProvider = [
      {
        testcase: 'Only one server is available.',
        serverUrl: 'https://gitlab.com',
        timeout: -1,
        expectedResult: [
          { url: 'https://gitlab.com', priority: 4 }
        ]
      },
      {
        testcase: 'All servers are available.',
        serverUrl: [
          'https://does-not-work.perfume.new',
          'https://gitlab.com',
          'https://github.com',
          'https://doesnt-work.github.com',
          'http://app.scnt.me',
          'https://offline.scentronix.com'
        ],
        timeout: -1,
        expectedResult: [
          { url: 'https://does-not-work.perfume.new', priority: 1 },
          { url: 'https://offline.scentronix.com', priority: 2 },
          { url: 'http://app.scnt.me', priority: 3 },
          { url: 'https://doesnt-work.github.com', priority: 4 },
          { url: 'https://github.com', priority: 4 },
          { url: 'https://gitlab.com', priority: 4 }
        ]
      },
      {
        testcase: 'None of the servers are available.',
        serverUrl: [],
        timeout: -1,
        expectedResult: []
      },
      {
        testcase: 'One server is timeout.',
        serverUrl: [
          'https://does-not-work.perfume.new',
          'https://gitlab.com',
          'https://github.com'
        ],
        timeout: 0,
        expectedResult: [
          { url: 'https://gitlab.com', priority: 4 },
          { url: 'https://github.com', priority: 4 }
        ]
      }
    ];
    test.each(dataProvider)('$testcase', async ({ serverUrl, timeout, expectedResult }) => {
      //Given
      const spy = jest.spyOn(httpService.axiosRef, 'get').mockImplementation((url) => {
        if (serverUrl.includes(url)) {
          if (timeout !== -1 && serverUrl[timeout] === url)
            return Promise.resolve({
              data: {},
              headers: {},
              config: {
                url: serverUrl,
                headers: undefined,
              },
              status: HttpStatus.REQUEST_TIMEOUT,
              statusText: 'TIMEOUT',
            });
          return Promise.resolve({
            data: {},
            headers: {},
            config: {
              url: serverUrl,
              headers: undefined,
            },
            status: HttpStatus.OK,
            statusText: 'OK'
          });
        }
        return Promise.reject('Rejected');
      });

      //When
      const result = await checkserverService.listOfAvailableSevers();

      //Then
      expect(spy).toHaveBeenCalled();
      expect(result).toMatchObject(expectedResult);
    });
  });
  describe('getServer', () => {
    const dataProvider = [
      {
        testcase: 'Server is available.',
        serverUrl: [
          'https://does-not-work.perfume.new',
          'https://gitlab.com',
          'https://github.com'
        ],
        dto: {
          priority: 4
        },
        expectedResult: [
          { url: 'https://github.com', priority: 4 },
          { url: 'https://gitlab.com', priority: 4 }
        ]
      },
      {
        testcase: 'Server is not available',
        serverUrl: [],
        dto: {
          priority: 4
        },
        expectedResult: []
      }
    ];
    test.each(dataProvider)('$testcase', async ({ serverUrl, dto, expectedResult }) => {
      //Given
      const spy = jest.spyOn(httpService.axiosRef, 'get').mockImplementation((url) => {
        if (serverUrl.includes(url)) return Promise.resolve({
          data: {},
          headers: {},
          config: {
            url: serverUrl,
            headers: undefined,
          },
          status: HttpStatus.OK,
          statusText: 'OK'
        });
        return Promise.reject('Rejected');
      });

      //When
      const result = await checkserverService.getServer(dto);

      //Then
      expect(spy).toHaveBeenCalled();
      expect(result).toMatchObject(expectedResult);
    });
  });
});