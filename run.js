var http = require('http');

// This is script is far from working. Just starts with the standard code for the moment// 

var port = "";
var host = "";
if(port=="") throw "";
if(host=="") throw "";


var getStartHtml = function()
{
    var jq = '<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>';
    var ajax = 'setInterval(function(){$.ajax({url:"/status"}).done(function(data){'+
    'var j = eval("("+data+")");'+'if(j.s==1) $("#status").html("online");'+'if(j.s==0) $("#status").html("offline");'+
    '})},1000)';
    return jq+'<b id="status">Online</b><script>$(document).ready(function(){'+ajax+"});</script>";
}

var getStatus = function()
{
    return "{s:"+parseInt(Math.random()*2)+"}";
}

http.createServer(function(req,res)
{

    var requestType = 0;
    var url = req.url;

    if(url=="/")requestType=1;
    if(url=="/status")requestType=2;
    
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


}).listen(port,host);
