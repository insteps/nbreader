<?php defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| Database Key Column
|--------------------------------------------------------------------------
|
| this should be the name of the primary key column
|
|   Default: 'id'
|
*/

$config['crud_db_key'] = 'id';

/*
|--------------------------------------------------------------------------
| Database Created Column
|--------------------------------------------------------------------------
|
| this should be the name of the record "created on" column
|
|   Default: 'id'
|
*/
$config['crud_db_created'] = 'created_on';

/*
|--------------------------------------------------------------------------
| Database Created Column
|--------------------------------------------------------------------------
|
| this should be the name of the record "last modified" column, if you are
| using MySQL, this field should be set to type TIMESTAMP
|
|   Default: 'id'
|
*/
$config['crud_db_modified'] = 'mod_on';

/*
|--------------------------------------------------------------------------
| Encrypt Data
|--------------------------------------------------------------------------
|
| Should the data be encrypted before inseration into the database, 
| and decrypted before output?  
|
| IMPORTANT: You must set this value BEFORE any data is in the tables
|
|   Default: false
|
*/
$config['crud_db_encrypted'] = false;

/* End of file crud.php */
/* Location: ./application/config/crud.php */
