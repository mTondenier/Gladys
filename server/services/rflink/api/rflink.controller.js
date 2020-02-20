/* eslint-disable prefer-destructuring */
const asyncMiddleware = require('../../../api/middlewares/asyncMiddleware');
const { ServiceNotConfiguredError } = require('../../../utils/coreErrors');
const logger = require('../../../utils/logger');

module.exports = function RFlinkController(gladys, RFlinkManager, serviceID) {
    /**
     * @api {get} /api/v1/service/rflink/devices get rflink devices
     * @apiName getDevices
     * @apiGroup RFlink
     */
    async function getDevices(req, res) {
        res.json(RFlinkManager.getDevices());
    }

    /**
     * @api {get} /api/v1/service/rflink/connect connect to the gateway
     * @apiName connect
     * @apiGroup RFlink
     */
    async function connect(req, res) {
        const rflinkPath = await gladys.variable.getValue('RFLINK_PATH');
        if (!rflinkPath) {
            throw new ServiceNotConfiguredError('RFLINK_PATH_NOT_FOUND');
          }
        RFlinkManager.connect(rflinkPath);
        res.json({succes: true, });
    }
    /**
     * @api {get} /api/v1/service/rflink/disconnect discconnect the gateway
     * @apiName disconnect
     * @apiGroup RFlink
     */
    async function disconnect(req, res) {
        RFlinkManager.disconnect();
        res.json({
            success: true,
          });
    }
    /**
     * @api {get} /api/v1/service/rflink/status get the gateway's status
     * @apiName getStatus
     * @apiGroup RFlink
     */
    async function getStatus(req, res) {
    res.json({
      currentMilightGateway : RFlinkManager.currentMilightGateway,
      connected: RFlinkManager.connected,
      scanInProgress: RFlinkManager.scanInProgress,
      ready: RFlinkManager.ready,
    });
  }
  

    /**
     * @api {get} /api/v1/service/rflink/pair send a milight pairing command
     * @apiName pair
     * @apiGroup RFlink
     */
  async function pair(req, res) {
    const milightZone =  req.body.zone;
    let currentMilightGateway = await gladys.variable.getValue('CURRENT_MILIGHT_GATEWAY', serviceID);
    if (currentMilightGateway === null) {
        currentMilightGateway = RFlinkManager.currentMilightGateway;
    }
    RFlinkManager.currentMilightGateway = currentMilightGateway;

      RFlinkManager.pair(currentMilightGateway , milightZone);

      res.json({
          succes : true,
          currentMilightGateway,
          milightZone
      });
  }

    /**
     * @api {get} /api/v1/service/rflink/pair send a milight unpairing command
     * @apiName unpair
     * @apiGroup RFlink
     */
async function unpair(req, res) {
    const milightZone =  req.body.zone;
    let currentMilightGateway = await gladys.variable.getValue('CURRENT_MILIGHT_GATEWAY', serviceID);
    if (currentMilightGateway === null) {
        currentMilightGateway = RFlinkManager.currentMilightGateway;
    }
    RFlinkManager.currentMilightGateway = currentMilightGateway;

    RFlinkManager.unpair(currentMilightGateway, milightZone);
          res.json({
          succes : true,
          currentMilightGateway,
          milightZone
      });
}
    /** 
     * @apiName unpair
     * @apiGroup RFlink
     * @api {post} /api/v1/service/rflink/remove remove a device from the device list
     */
  async function remove(req, res) {
        logger.log(req);
        res.json({
            success : true,
        });
   }

    return {
        'post /api/v1/service/rflink/pair' : {
            authenticated: true,
            controller: asyncMiddleware(pair)
        },
        'post /api/v1/service/rflink/unpair' : {
            authenticated: true,
            controller: asyncMiddleware(unpair)
        },
        'get /api/v1/service/rflink/devices' : {
            authenticated: true,
            controller: asyncMiddleware(getDevices)
        },
        'post /api/v1/service/rflink/connect' : {
            authenticated: true,
            controller: asyncMiddleware(connect)
        },
        'post /api/v1/service/rflink/disconnect' : {
            authenticated: true,
            controller: asyncMiddleware(disconnect)
        },
        'get /api/v1/service/rflink/status' : {
            authenticated: true,
            controller: asyncMiddleware(getStatus)
        },
        'get /api/v1/service/rflink/remove' : {
            authenticated: true,
            controller: asyncMiddleware(remove)
        },

    };
};