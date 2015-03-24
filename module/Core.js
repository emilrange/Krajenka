var Irc = require('../module/Irc');
var Web = require('./Web');
var fs = require('fs');

module.exports = function Core()
{
    var _this = this;
    this.config = eval("("+fs.readFileSync("config",{encoding: 'utf-8'})+")");
    this.irc = false;
    this.web = false;
    this.run = function()
    {
        _this.web = new Web(_this);
        _this.irc = new Irc(_this);
    }
}
