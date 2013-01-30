
var databaseUrl = 'chatting';
var collections = ['user'];

var db = require('mongojs').connect(databaseUrl, collections);

//모듈을 추출합니다.
var fs = require('fs');
var socketio = require('socket.io');
var connect = require('connect');
var connectRoute = require('connect-route');

//웹 서버를 생성합니다.
var server = connect.createServer(connect.bodyParser(), connectRoute (function (app) {

	app.get('/', function (request, response, next) {

		  fs.readFile('LoginPage.htm', function (error, data) {
			response.writeHead(200, {'Content-Type': 'text/html' });
			response.end(data);
		  });		
	});

	app.get('/regPage', function (request, response, next) {

		  fs.readFile('regPage.htm', function (error, data) {
			response.writeHead(200, {'Content-Type': 'text/html' });
			response.end(data);
		  });		
	});

	app.post('/', function (request, response) {
		var _id = request.body.email;
		var _pwd = request.body.password;
		var account =  db.user.findOne({id:_id}, function (error, data){

			

			if (error || !data){
				console.log('아이디가 틀렸습니다.');
			}				
			else
			{
				if(_pwd == data.password)
				{
					console.log('로그인 하였습니다.');
					fs.readFile('ChatPage.htm', function (error, data) {
						response.writeHead(200, {'Content-Type': 'text/html', 
												 'Set-Cookie': ['ID = ' + _id]
								});
						response.end(data);
					});
				}					
				else
				{
					console.log('비밀번호가 틀렸습니다.')
				}
			}			
		})
	});

})).listen(52273);

var io = socketio.listen(server);
io.set('log level', 2);
io.sockets.on('connection', function (socket) {

	socket.on('rint', function(data) {
		console.log('Client Sned Data:', data);
		io.sockets.emit('smart', data);	
	});
});

