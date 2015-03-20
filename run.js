var http = require('http');
var net = require('net');
var fs = require('fs');
var Irc = require('./module/Irc');


var config = false;
var loadConfig = false;
fs.readFile("config",{encoding: 'utf-8'},function(err,data){ config = eval("("+data+")"); loadConfig = true;});
var img01 = fs.readFileSync("img/img01.png");
var img02 = fs.readFileSync("img/img02.png");
var imgload = fs.readFileSync("img/load.gif");
var standardHtml = fs.readFileSync("html/standard.html");
 

var irc = false;

// This is script is far from working. Just starts with the standard code for the moment// 



var getStartHtml = function()
{
    return standardHtml;
}

var getStatus = function()
{
    var onlineStatus = 0;
    if(irc)
    {
        var online = irc.getData().online;
        if(online===true) onlineStatus = 1;
        if(online===false) onlineStatus = -1;
    }
    return "{s:"+onlineStatus+"}";
}

var getStatusPeriod = function()
{
    if(!irc) return "[]";
    return JSON.stringify(irc.getData().onlineData);
}


setTimeout( function(){

if(config===false) throw "config failed to load";
if(loadConfig===false) throw "cofig failed to load";
if(config.http_accept_connect_on_hostname=="") throw "invalid http_accept_connect_on_hostname";
if(config.http_port=="") throw "invalid http_port";
if(config.irc_port=="") throw "invalid irc_port";
if(config.irc_server=="") throw "irc_server";
if(config.check_online_nickname=="") throw "invalid check_online_nickname";
if(config.user_irc_nickname=="") throw "invalid user_irc_nickname";
 
http.createServer(function(req,res)
{

    var requestType = 0;
    var url = req.url;

    if(url=="/")requestType=1;
    if(url=="/status")requestType=2;
    if(url=="/img01.png") requestType=3;
    if(url=="/img02.png") requestType=4;
    if(url=="/load.gif") requestType=5;
    if(url=="/img04.png") requestType=6;
    if(url=="/status_period")requestType=7;

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
        res.end(getStartHtml());
    }

    if(requestType==2)
    {
        res.writeHead(200,{'Content-Type':'text/plain'});
        res.end(getStatus());
    }

    if(requestType==7)
    {
        res.writeHead(200,{'Content-Type':'text/plain'});
        res.end(getStatusPeriod());
    }




}).listen(config.http_port,config.http_accept_connect_on_hostname);

if(true)
{
    irc = new Irc(config);
}

},2000);
