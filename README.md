###Engish
A small CDN for storing media content (pdf, jpg, png, mov). For image processing, a preprocessor with caching is built in. Made using the total framework.js [Total.js](https://tools.com)

To install dependencies needed in the console to run the command `npm install`

**Config Parameters:**
* max_filesize		  : 5000	//maximum file size
* max_filesize_base64	  : 3000	//maximum size of a file in base64 format
* auth_key		  : 12345678    //key for authorization
* allow_base64_type	  : jpg, jpeg, png //allowed type of the file in base64 format
* allow_type		  : jpg, jpeg, png, avi, mov, 3gp, pdf //allowed type file
* domain		  : http://localhost:8989 //cdn domain

###Русский
Небольшой CDN для хранения медиа контента (pdf, jpg, png, mov). Для обработки изображений встроен препроцессор с кэшированием. Сделан с использование фреймворка total.js [Total.js](https://totaljs.com)

Для установки зависимостей необходимо в консоли выполнить команду `npm install`

**Параметры конфига**

* max_filesize		  : 5000	//максимальный размер файла
* max_filesize_base64	  : 3000	//максимальный размер для файлов в формате base64 
* auth_key		  : 12345678    //ключ для авторизации
* allow_base64_type	  : jpg, jpeg, png //разрешенный тип файлов в формате base64
* allow_type		  : jpg, jpeg, png, avi, mov, 3gp, pdf //разрешенный тип файлов
* domain		  : http://localhost:8989 //домен cdn