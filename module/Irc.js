var net = require('net');

module.exports = function Irc(core)
{
    var config = core.config;

    if(config.irc_port=="") throw "invalid irc_port";
    if(config.irc_server=="") throw "irc_server";
    if(config.check_online_nickname=="") throw "invalid check_online_nickname";
    if(config.user_irc_nickname=="") throw "invalid user_irc_nickname";
 

    var onlineData = new Array();
    var online = null;
    irc = new net.Socket();
    irc.connect(config.irc_port,config.irc_server,function(){});
    irc.on('data',function(data)
    {
        var dataStr = ""+data;
        var messages = dataStr.split("\r\n");

        console.log(dataStr);
    
        for(var i=0; i<messages.length; i++)
        {
            var msg = messages[i];
            var parameters = msg.split(" ");
            if(msg.substr(0,4)=="PING")
            {
                var parameters = msg.split(" ");
                var t = "PONG "+parameters[1]+"\r\n";
                irc.write(t);
            }
            if(parameters[1]=="303")
            {
                online = ( parameters[3] == ":"+config.user_irc_nickname );
                var o = new Object();
                o.online = ( online ? 1 : -1 );
                onlineData.push(o);
            }
            if(parameters[1]=="PRIVMSG")
            {
                if(parameters[2]==config.check_online_nickname)
                {
                    var b = msg.split(":");
                    core.web.message(b[2]);
                }
            }
        }
    });
    irc.write("NICK "+config.check_online_nickname+"\r\n");
    irc.write("USER "+config.check_online_nickname+" 0 * :"+config.chech_online_nickname+"\r\n");
    setInterval(function(){ irc.write("ISON "+config.user_irc_nickname+"\r\n");},15000);

    this.knockOnDoor = function()
    {
        if(onlineData.length==0) return;
        onlineData[onlineData.length-1].knockedDoor = true;
    }

    this.message = function(msg)
    {
        irc.write("PRIVMSG "+config.user_irc_nickname+" :"+msg+"\r\n");
    }

    this.getData = function()
    {
        var o = new Object()
        o.online = online;
        o.onlineData = onlineData;
        return o;
    }

}
