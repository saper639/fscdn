exports.name = "Utilit";

global.getTypeFs = function(mime) {  
  var arr = mime.split('/');
  var name = null;
  if (arr[0] == 'image') name = 'image';
  else if (arr[0] == 'video') name = 'video';
  else if (arr[0] == 'audio') name = 'audio';
  else if (mime.indexOf('octet-stream') > -1) name = 'video'
  else if (mime.indexOf('pdf') > -1) name = 'doc'  
  else if (mime.indexOf('zip') > -1 || mime.indexOf('rar') > -1) name = 'arch';
  else name = 'other';
  return name;
} 

global.SUCCESS = function(success, value, dop) {
     if (success === false) return { success: false, error : value, value: dop };
      return { success: true, value : value };
}