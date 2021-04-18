exports.name = "Process";

function img(req, callback) {
	(async () => {	
		try {			
			var query = req.query||{};			
			var fileid = req.path[1].split('.').shift();	
			var hashid = HASH(req.url).toString(36);			
			
			var meta = await readMetaFileSync('cache', hashid);			
			if (meta) {									
				meta.id = hashid;
				return callback(null, meta);	
			}
			var ext = U.getExtension(req.path[1]);			
			FILESTORAGE('image').image(fileid, (err, image) => {										
				if (err) return callback(404);
				//flip flip=v
				if (query.flip=="v") image.flip();
				//flop flip=h
				if (query.flip=="h") image.flop();
				//flip and flop, flip=both
				if (query.flip=="both") {
					image.flip();
					image.flop();
				}	
				//filter - grayscale, filt=gray
				if (query.filt=="gray") image.grayscale();
				//filter - sepia, filt=sepia
				if (query.filt=="sepia") image.sepia();
				//blur, blur=5
				if (query.blur >= 0 && query.blur <= 100 ) image.blur(query.blur);
				//background bg=red
				if (query.bg) image.background(query.bg);
				//rotate, or=10 
				if (query.or >= 0 && query.or <= 360 ) image.rotate(query.or);
				//align, align=type (top left top right bottom center) 
				if (query.align) image.align(query.align);				
				//crop, crop=width,height,x,y
				if (query.crop) {
					let param = query.crop.split(',');
					if (param.length == 4) image.crop(param[0], param[1], param[2], param[3]);				
				}	
				//miniature, miniature=width,height,bgcolor,filter
				if (query.miniature) {
					let param = query.miniature.split(',');					
					if (param.length >= 2) image.miniature(param[0], param[1], param[2]||null, param[3]||null);				
				}
				//resize, resize=width,height,options
				if (query.resize) {
					let param = query.resize.split(',');
					if (param.length >= 1) image.resize(param[0], param[1]||null, param[2]||null);				
				}
				//resizealign, resizeal=width,height,align,color
				if (query.resizeal) {
					let param = query.resizeal.split(',');					
					if (param.length >= 1) image.resizeAlign(param[0], param[1]||null, param[2]||'center', param[3]||null);				
				}	
				//resizecenter, resizecn=width,height,color
				if (query.resizecn) {
					let param = query.resizecn.split(',');
					if (param.length >= 1) image.resizeCenter(param[0], param[1]||null, param[2]||null);				
				}	
				//scale, scale=width,height,options
				if (query.scale) {
					let param = query.scale.split(',');
					//TODO: options					
					if (param.length >= 1) image.scale(param[0], param[1]||null);				
				}
				//thumbnail, thumb=width,height,options
				if (query.thumb) {
					let param = query.thumb.split(',');
					//TODO: options					
					if (param.length >= 1) image.thumbnail(param[0], param[1]||null);				
				}
				//minify, minify=1
				if (query.minify) {
					image.minify();				
				}	
				//normalize, normalize=1
				if (query.normalize) {
					image.normalize();				
				}	
				//normalize, normalize=1
				if (query.output) {
					image.output(query.output);				
				}	
				//quality, ql=persentage
				if (query.ql >= 1 && query.ql <= 100) {
					image.quality(query.ql);				
				}	
				FILESTORAGE('cache').save(hashid, hashid+'.'+ext, image.stream(ext), (err, meta) => {
					if (err) return callback(404);
					return callback(null, meta);
				}, null, '5 day');
			})			
		} catch (err) {
			console.log('err', err);
			return callback(404);
		}						
	})();				
}	

function readMetaFileSync(fsname, id) {
	return new Promise((resolve, reject) => {
		var FS = FILESTORAGE(fsname);
		FS.readmeta(id, (err, meta) => {			
			if (err) {				
				resolve(null);
			}	
			resolve(meta);	  	
		});
	})	
}

function readFileSync(fsname, id) {
	return new Promise((resolve, reject) => {
		var FS = FILESTORAGE(fsname);
		FS.read(id, (err, meta) => {			
			if (err) {				
				resolve(null);
			}	
			resolve(meta);	  	
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
exports.img = img;