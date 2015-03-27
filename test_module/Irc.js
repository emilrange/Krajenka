var net = require('net');

module.exports = function Irc(core)
{
    var onlineData = new Array();
    var online = true;
    this.getData = function()
    {
        var o = new Object()
        o.online = online;
        o.onlineData = onlineData;
        return o;
    }

    this.message = function(msg)
    {
        console.log(">"+msg);
    }

    this.knockOnDoor = function()
    {
        if(onlineData.length==0) return;
        onlineData[onlineData.length-1].knockedDoor = true;
    }

    setInterval(function(){ var o = new Object(); o.online =  parseInt(Math.random()*2); onlineData.push( o ); },3000);


    setInterval(function(){ core.web.message("tteesstt"); },5000);
}
