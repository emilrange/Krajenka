var net = require('net');

module.exports = function Irc(core)
{
    var onlineData = new Array();
    onlineData.push(1);
    onlineData.push(-1);
    onlineData.push(-1);
    onlineData.push(1);
    onlineData.push(-1);
    var online = true;
    this.getData = function()
    {
        var o = new Object()
        o.online = online;
        o.onlineData = onlineData;
        return o;
    }

}
