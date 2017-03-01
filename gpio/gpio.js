module.exports = function(RED) {
  "use strict";

  //prefix is the path for basic filesystem operations
  // var prefix = ""; // Running on the machine
  // var prefix = "/somewhere/you/mount/the/remote/filesystem" // E.g. when you mount the remote filesystem with sshfs
  var prefix = "/tmp/ssh/angeloyun2";

  var fs = require("fs-extra");
  var os = require("os");
  var spawn = require('child_process').spawn;
  var plat = require('os').platform();
  //var Epoll = require('epoll').Epoll;

    function GpioOut(config) {
        RED.nodes.createNode(this,config);
        this.pin = config.pin || "D13";
        var node = this;
        this.log("Something happened Out");

        fs.writeFile(prefix + "/sys/class/gpio/" + node.pin + "/direction", "out", function(err) {
          if(err) { node.error(RED._("file.errors.writefail",{error:err.toString()}),msg); }
        });

        this.on('input', function(msg) {
          this.log(node.pin);
            fs.writeFile(prefix + "/sys/class/gpio/" + node.pin + "/value", msg.payload.toString(), function(err) {
              if(err) { node.error(RED._("file.errors.writefail",{error:err.toString()}),msg); }
            });
        });
    }
    RED.nodes.registerType("gpio-out",GpioOut);

    function GpioIn(config) {
      RED.nodes.createNode(this,config);
      this.pin = config.pin || "D2";
      var node = this;
      valuefd = fs.openSync(prefix+"/sys/class/gpio/" + node.pin + "/value", 'r'),
      buffer = new Buffer(1);
      this.log("Something happened In");

      fs.writeFile(prefix+"/sys/class/gpio/" + node.pin + "/direction", "in", function(err) {
        //if(err) { node.error(RED._("file.errors.writefail",{error:err.toString()}),msg); }
      });

/*      this.log(prefix+"/sys/class/gpio/" + node.pin + "/value");
      var poller = new Epoll(function (err, fd, events) {
        fs.readSync(fd, buffer, 0, 1, 0);
        var msg = { };
        msg.payload = buffer.toString();
        node.send(msg);
      });

      /*
      var tail = spawn("tail", ["-F", "-n", "0", prefix+"/sys/class/gpio/" + node.pin + "/value"]);

      tail.stdout.on("data", function (data) {
        var msg = { };
        msg.payload = data;
        node.send(msg);
      }
      tail.stderr.on("data", function(data) {
        node.error(data.toString());
      });
      this.on("close", function() {
        if (tail) { tail.kill(); }
      });*/
    }
    RED.nodes.registerType("gpio-in",GpioIn);
}
