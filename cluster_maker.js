/*const cluster = require('cluster');
const numCPUs = require('os').cpus().length;


if(cluster.isMaster){

	for (var i = 0; i < numCPUs ; i++) {
		cluster.fork();
	}

	// Listen for workers to come online.
	cluster.on('online', function(worker) {
		console.log('Worker ' + worker.process.pid + ' is online.');
	});

	cluster.on('exit',(worker,code,signal) => {
		console.log('worker ${worker.process.pid} died');
	});

}else{
	//workers share TCP connections

}*/