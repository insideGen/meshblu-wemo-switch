'use strict';
var util          = require('util');
var EventEmitter  = require('events').EventEmitter;
var debug         = require('debug')('meshblu-wemo-switch:index');
var Wemo          = require('wemo-client');
var _             = require('lodash');

var MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
    on: {
      type: 'boolean',
      required: true
    }
  }
};

var OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    friendlyName: {
      type: 'string',
      required: true
    }
  }
};

var Plugin = function() {
  var self = this;
  self.options = {};
  self.messageSchema = MESSAGE_SCHEMA;
  self.optionsSchema = OPTIONS_SCHEMA;
  self.wemo = new Wemo();
  self.client = undefined;
  return self;
}
util.inherits(Plugin, EventEmitter);

Plugin.prototype.onMessage = function(message) {
  var self = this;
  var payload = message.payload;
  if (self.client != undefined && payload.on != undefined) {
    self.client.setBinaryState(payload.on ? 1 : 0, function() {});
  }
};

Plugin.prototype.onConfig = function(device) {
  var self = this;
  self.setOptions(device.options||{});
};

Plugin.prototype.setOptions = function(options) {
  var self = this;
  self.options = options;
  if (self.client && self.wemo._clients[self.client.UDN]) {
    self.wemo._clients[self.client.UDN].removeAllListeners();
    delete self.wemo._clients[self.client.UDN];
    self.client = undefined;
  }
  self.wemo.discover(function(deviceInfo) {
    //console.log(deviceInfo.friendlyName);
    if (deviceInfo.deviceType.split(':')[3] === 'controllee' && deviceInfo.friendlyName === self.options.friendlyName)
    {
      //console.log('Create WeMo client: ', deviceInfo.friendlyName);
      self.client = self.wemo.client(deviceInfo);
      self.client.on('binaryState', function(value) {
        //console.log('state changed: ', value);
        self.emit('message', {devices: ['*'], topic: 'state-changed', payload: {on: (value === "1") ? true : false}});
      });
    }
  });
};

module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
