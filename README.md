# Meshblu Wemo switch Plugin #
A plugin for connecting your Belkin Wemo switch to Meshblu.

It's intended to be used with Gateblu, but works great as a standalone application as well.

The options schema and the message schema is auto published to the meshblu device when the plugin starts.

This plugin can send event messages when the device's state is changed. An example of event message is given in the bottom of this document.

## Installation ##
It's recommend to be used with Gateblu, but if you want to run it by itself, you'll need to register a device with Meshblu and create a meshblu.json in the root of the meshblu-wemo-switch directory that looks like the following:

```
{
  "uuid":   "<your meshblu-wemo-switch uuid>",
  "token":  "<your meshblu-wemo-switch token>",
  "server": "meshblu.octoblu.com",
  "port":   "80"
}
```

Then run:
```
npm install
npm start
```

## Options Schema ##
```
{
  "type": "object",
  "properties": {
    "friendlyName": {
      "type": "string",
      "required": true
    }
  }
}
```

## Message Schema ##
```
{
  "type": "object",
  "properties": {
    "on": {
      "type": "boolean",
      "required": true
    }
  }
}
```
Which means a message will look like:
```
{
  "devices": ["<uuid of meshblu-wemo-switch>"],
  "payload": {
    "on": true
  }
}
```

## Event Message ##
A event message will look like:
```
{
  "devices": [ "*" ],
  "payload": {
    "on": true
  },
  "topic": "state-changed",
  "fromUuid": "<uuid of meshblu-wemo-switch>"
}
```