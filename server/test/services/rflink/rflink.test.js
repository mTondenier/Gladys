const { expect } = require('chai');
const EventEmitter = require('events');
const proxyquire = require('proxyquire').noCallThru();
const SerialPort = require('serialport');
const RflinkMock = require('./rflinkMock.test');


const RflinkService = proxyquire('../../../services/rflink/index', {
  'SerialPort': SerialPort,
});

const gladys = {
  event: new EventEmitter(),
  variable: {
    getValue: () => Promise.resolve('test'),
  },
};

describe('rflinkService', () => {
  const rflinkService = RflinkService(gladys, 'be86c4db-489f-466c-aeea-1e262c4ee720');
  it('should have controllers', () => {
    expect(rflinkService)
      .to.have.property('controllers')
      .and.be.instanceOf(Object);
  });
  it('should start service', async () => {
    await rflinkService.start();
  });
  it('should stop service', async () => {
    await rflinkService.stop();
  });
});
