var http = require('http');
var fs = require('fs');

module.exports = function Web(core)
{
    var config = core.config;
    var img01 = fs.readFileSync("img/img01.png");
    var img02 = fs.readFileSync("img/img02.png");
    var imgload = fs.readFileSync("img/load.gif");
    var standardHtml = fs.readFileSync("html/standard.html");
    var _this = this;
    this.getStartHtml = function()
    {
        return standardHtml;
    }

    this.getStatus = function()
    {
        var onlineStatus = 0;
        if(core.irc)
        {
            var online = core.irc.getData().online;
            if(online===true) onlineStatus = 1;
            if(online===false) onlineStatus = -1;
        }
        return "{s:"+onlineStatus+"}";
    }

    this.getStatusPeriod = function()
    {
        if(!core.irc) return "[]";
        var a = core.irc.getData().onlineData;
        
        var f = new Array();
        for(var i=a.length-68; i<a.length; i++)
        {
            if(i>-1) f.push(new Array(a[i].online,( a[i].knockedDoor ? 1 : 0)));
        }
        return JSON.stringify(f);
    }

    if(config===false) throw "config failed to load";
    if(config.http_accept_connect_on_hostname=="") throw "invalid http_accept_connect_on_hostname";
    if(config.http_port=="") throw "invalid http_port";

    http.createServer(function(req,res)
    {
        var requestType = 0;
        var url = req.url;

        if(url=="/") requestType=1;
        else if(url=="/status") requestType=2;
        else if(url=="/img01.png") requestType=3;
        else if(url=="/img02.png") requestType=4;
        else if(url=="/load.gif") requestType=5;
        else if(url=="/img04.png") requestType=6;
        else if(url=="/status_period")requestType=7;
        else requestType = -1;

        console.log(url);

        if(requestType==3)
        {
            res.writeHead(200,{'Content-Type':'image/png'});
            res.end(img01,'binary');
        }
        if(requestType==4)
        {
            res.writeHead(200,{'Content-Type':'image/png'});
            res.end(img02,'binary');
        }
        if(requestType==5)
        {
            res.writeHead(200,{'Content-Type':'image/gif'});
            res.end(imgload,'binary');
        }
        if(requestType==6)
        {
            throw "not yet added";
        }
        if(requestType==1)
        {
            res.writeHead(200,{'Content-Type':'text/html'});
            console.log(core.irc.knockOnDoor());
            res.end(_this.getStartHtml());
        }
        if(requestType==2)
        {
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end(_this.getStatus());
        }
        if(requestType==7)
        {
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end(_this.getStatusPeriod());
        }
        if(requestType==0 || requestType==-1)
        {
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end("invalid request");
        }
    }).listen(config.http_port,config.http_accept_connect_on_hostname);
}
