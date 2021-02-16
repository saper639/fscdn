exports.install = function() {	
	GROUP(['authorize'], function() {       	
		ROUTE('+POST /upload', upload, ['upload'], CONF.max_filesize_base64||1024); 
		ROUTE('+POST /upload/base64', upload_base64, ['raw'], CONF.max_filesize||1024);
		ROUTE('GET /fs/stat/{type}',  stat);	
	})	
	// File routes (image)
	ROUTE('FILE /meta/image/*.*',  img_meta);	
	ROUTE('FILE /image/*.jpg',  img_process);
	ROUTE('FILE /image/*.jpeg', img_process);
	ROUTE('FILE /image/*.png',  img_process);
	ROUTE('FILE /image/*.gif',  img_process);		
	// File routes (pdf)
	ROUTE('FILE /doc/*.pdf',    file_process);	
	// File routes (video)
	ROUTE('FILE /video/*.mov',  file_process);
	ROUTE('FILE /video/*.3gp',  file_process);
	// File routes (audio)
	ROUTE('FILE /audio/*.mp3',  file_process);	
	// File routes (arch)
	ROUTE('FILE /arch/*.zip',   file_process);
	ROUTE('FILE /arch/*.rar',   file_process);
	//handle error
	ROUTE('#401',        view_error);           
	ROUTE('#404',        view_error);           
    ROUTE('#408',        view_error);
    ROUTE('#431',        view_error);
    ROUTE('#500',        view_error);
    ROUTE('#501',        view_error);      
}
//stat filestorage
function stat(type) {
	var self = this;	
	var FS = FILESTORAGE(type);	
	FS.count((err, info) => {
		if (err) res.throw500();			
		info.name = type;
		self.json(SUCCESS(true, info));
	});			
}	
//upload form-data (file list)
function upload() {
	var self = this;			
	MODULE('upload').listFiles(self.files, self.callback());			
}		
//upload raw (base64)
function upload_base64() {
	var self = this;		
	MODULE('upload').dataBase64(self.body, self.callback());				
}	
function img_meta(req, res) {			
	var fileid = req.path[2].split('.').shift();		
	FILESTORAGE('image').read(fileid, (err, meta)=>{
		if (err) res.throw404();			
		res.json(meta);
	}, true);
}	
//img process
function img_process(req, res) {		
	var query = req.query||{};			
	var fileid = req.path[1].split('.').shift();		
	req.uri.pathname = req.uri.pathname.replace(/\./, '-' + HASH(JSON.stringify(req.query) + '.'));	
	//without process
	if (Object.keys(query).length < 1) {		
		res.imagefs(req.path[0], fileid, (image)=>{});				
	} //need proceess
	else {		
		MODULE('process').img(req, (err, meta)=>{						
			if (err) res.throw404();			
			res.imagefs('cache', meta.id, (image)=>{});				
		})	
	}
}
function file_process(req, res) {		
	var fileid = req.path[1].split('.').shift();		
	res.filefs(req.path[0], fileid, (name, type)=>{});				
}	
//auth
AUTH(function($) {
	var query = $.query||{};
	if (!query.key || query.key !== CONF.auth_key) return $.invalid()
	return $.success();
})	
//view error
function view_error() {
    var self = this;            
    var err = self.route.name;      
    self.json(SUCCESS(false, RESOURCE('!error_'+err), err));       	
}	

