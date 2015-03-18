var http = require('http');
var net = require('net');
var fs = require('fs');

var config = false;
var loadConfig = false;
fs.readFile("config",{encoding: 'utf-8'},function(err,data){ config = eval("("+data+")"); loadConfig = true;});
var img01 = fs.readFileSync("img/img01.png");
var img02 = fs.readFileSync("img/img02.png");
var imgload = fs.readFileSync("img/load.gif");




// This is script is far from working. Just starts with the standard code for the moment// 


var online = null;

var getStartHtml = function()
{
    var jq = '<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>';
    var ajax = 'setInterval(function(){$.ajax({url:"/status"}).done(function(data){'+
    'var j = eval("("+data+")");'+'if(j.s==1) { $("#status").html("online"); $("#user_img").attr("src","img01.png");} '+'if(j.s==-1) { $("#status").html("offline"); $("#user_img").attr("src","img02.png"); } '+
    '})},1000)';
    return jq+'<img id="user_img" src="load.gif" alt="user_img"><b id="status">.</b><script>$(document).ready(function(){'+ajax+"});</script>";
}

var getStatus = function()
{
    var onlineStatus = 0;
    if(online===true) onlineStatus = 1;
    if(online===false) onlineStatus = -1;
    return "{s:"+onlineStatus+"}";
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


}).listen(config.http_port,config.http_accept_connect_on_hostname);

if(true)
{
irc = new net.Socket();
irc.connect(config.irc_port,config.irc_server,function(){});
irc.on('data',function(data){
    var dataStr = ""+data;

    var messages = dataStr.split("\r\n");
    
    for(var i=0; i<messages.length; i++)
    {
        var msg = messages[i];
        var parameters = msg.split(" ");

        console.log(msg);
        if(msg.substr(0,4)=="PING")
        {
            var parameters = msg.split(" ");
            var t = "PONG "+parameters[1]+"\r\n";
            irc.write(t);
        }
        if(parameters[1]=="303")
        {
            online = ( parameters[3] == ":"+config.user_irc_nickname );
        }

    }
});
irc.write("NICK "+config.check_online_nickname+"\r\n");
irc.write("USER "+config.check_online_nickname+" 0 * :"+config.chech_online_nickname+"\r\n");
setInterval(function(){ irc.write("ISON "+config.user_irc_nickname+"\r\n");},5000);
}

},2000);
