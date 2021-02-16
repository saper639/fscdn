exports.name = "Upload";

const FileType = require('file-type');
const mime = require("mime");
const fs = require("fs");

function dataBase64(data, callback) {		
	(async () => {
	 	try {
			const allow = (CONF.allow_base64_type||'').split(",").map(item => item.trim());	
			data = data.toString();
			//string is base64?
			if (!data.isBase64() && data.search('base64')==-1) {
				return callback(error(1003));
			}
			var fileid = HASH(data).toString(36);			
			var fileTemp = fileid +'.bin';
			//create file from base64
			await base64toFile(data, PATH.temp(fileTemp));			
			var type = await FileType.fromFile(PATH.temp(fileTemp));			
			//allow extension
			if (!type && allow.length > 1 && !allow.includes(type.ext)) {
				return callback(error(1002));			
			}						
			var fsname = getTypeFs(type.mime);
			var filename = fileid+'.'+type.ext;
			//save file to FiliStorage
			var meta = await saveFileSync(fsname, fileid, filename, PATH.temp(fileTemp));						
			meta.filename = fsname + '/'+ filename;
			meta.url = domain() + '/' + meta.filename;
			//unlink file
			PATH.unlink(PATH.temp(fileTemp), (	)=>{});
			return callback(SUCCESS(true, meta));
		} catch (err) {
			console.error('Upload/dataBase64', err);
			return callback(error(1999));	
		}	 
	})();	
}

function listFiles(files, callback) {
	(async () => {
		const allow = (CONF.allow_type||'').split(",").map(item => item.trim());	
		var arr = [];
		//файлов не обнаружено
		if (files.length < 1) return callback(error(1001));
		for (file of files) {
			var obj = {
				filename : file.filename,
					type : file.type,
					size : file.length,							
			}
			try {
				var ext = mime.getExtension(file.type);				
				if (allow.length > 1 && !allow.includes(ext)) {
					obj.code = 1002;
					obj.error = RESOURCE('!error_'+obj.code);			
					arr.push(obj);
					continue;
				} 			
				var fileid = HASH(file.filename+file.length).toString(36);			
				var fsname = getTypeFs(file.type);
				var filename = fileid+'.'+ext;
				//save file to FiliStorage
				var meta = await saveFileSync(fsname, fileid, filename, file.path);						
				meta.filename = fsname + '/'+ filename;
				meta.url = domain() + '/' + meta.filename;
				arr.push(meta);	
			} catch(err) {
				console.error('Upload/listFiles', err);
				obj.code = 1999;
				obj.error = RESOURCE('!error_'+obj.code);			
				arr.push(obj);	
			}	
		}
		return callback(SUCCESS(true, arr));
	})();				
}	

function base64toFile(data, filename) {
	return new Promise((resolve, reject) => {		
		data.base64ToFile(filename, (err) => {
			if (err) reject(err);
			resolve(filename);	  	
		});
	})	
}
function saveFileSync(fsname, id, name, source, expire, custom) {
	return new Promise((resolve, reject) => {
		var FS = FILESTORAGE(fsname);
		FS.save(id, name, source, (err, meta) => {
			if (err) reject(err);
			resolve(meta);	  	
		}, expire, custom);
	})	
}
function error(code) {
	return SUCCESS(false, RESOURCE('!error_'+code), code)
}

function domain(){
	if (CONF.domain) return CONF.domain;
	//TODO:	
	/*console.log(F.ip);
	console.log(F.port);
	console.log(F.server);*/
}


exports.dataBase64 = dataBase64;
exports.listFiles = listFiles;