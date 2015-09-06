<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------
| RSS REST API SERVER CONNECTIVITY SETTINGS
| -------------------------------------------------------------------
| This file will contain the settings needed to access your api.
|
| -------------------------------------------------------------------
| EXPLANATION OF VARIABLES
| -------------------------------------------------------------------
|
|	['apiurl']   The full API Base URL.
|	['feedsurl'] The local Feeds URL.
|	['hostname'] The hostname of your database server.
|	['username'] The username used to connect to the database
|	['password'] The password used to connect to the database
|	['database'] The name of the database you want to connect to
|	['dbdriver'] The database driver. e.g.: mysqli.
|			Currently supported:
|				 cubrid, ibase, mssql, mysql, mysqli, oci8,
|				 odbc, pdo, postgre, sqlite, sqlite3, sqlsrv
|	['save_queries'] TRUE/FALSE - Whether to "save" all executed queries.
|				NOTE: Disabling this will also effectively disable both
|				$this->db->last_query() and profiling of DB queries.
|
| The $query_builder variables lets you determine whether or not to load
| the query builder class.
*/

$query_builder = TRUE;

# backend config settings
#-------------------------

# installation
$config['newsbeuter']['be']['path'] = '/tmp/nbreader';

#see also config.php, $config['base_url']
$config['newsbeuter']['be']['rss_api_url'] = 'http://192.168.1.100/nbreader/api/rss';

# basic js config data
$jsconf = array();
$jsconf['version'] = '';
$jsconf['apiurl'] = $config['newsbeuter']['be']['rss_api_url'];
$jsconf['nodes'] = 'collapseOne';
$jsconf['rssactive'] = 'rssactive';
$jsconf['list'] = 'a';
$config['newsbeuter']['fe']['jsconf'] = $jsconf;

# computed paths, generally not be changed
$config['newsbeuter']['be']['confpath'] = $config['newsbeuter']['be']['path'].'/config';
$config['newsbeuter']['be']['confdb'] = $config['newsbeuter']['be']['confpath'].'/urls.db';
$config['newsbeuter']['be']['varpath'] = $config['newsbeuter']['be']['path'].'/var/newsbeuter';
$config['newsbeuter']['be']['dbpath'] = $config['newsbeuter']['be']['varpath'].'/db';
$config['newsbeuter']['be']['datapath'] = $config['newsbeuter']['be']['varpath'].'/data';

# repetition
$config['newsbeuter']['be']['db'] = array(
	'dsn'	=> '',
	'hostname' => '',
	'username' => '',
	'password' => '',
	'database' => $config['newsbeuter']['be']['confdb'],
	'dbdriver' => 'sqlite3',
	'dbprefix' => '',
	'pconnect' => FALSE,
	'db_debug' => TRUE,
	'cache_on' => FALSE,
	'cachedir' => '',
	'char_set' => 'utf8',
	'dbcollat' => 'utf8_general_ci',
	'swap_pre' => '',
	'autoinit' => TRUE,
	'encrypt' => FALSE,
	'compress' => FALSE,
	'stricton' => FALSE,
	'failover' => array(),
	'save_queries' => TRUE
);

# frontend config
$config['newsbeuter']['db'] = array(
	'dsn'	=> '',
	'hostname' => '',
	'username' => '',
	'password' => '',
	'database' => $config['newsbeuter']['be']['dbpath'].'/.placeholder.db',
	'dbdriver' => 'sqlite3',
	'dbprefix' => '',
	'pconnect' => FALSE,
	'db_debug' => TRUE,
	'cache_on' => FALSE,
	'cachedir' => '',
	'char_set' => 'utf8',
	'dbcollat' => 'utf8_general_ci',
	'swap_pre' => '',
	'autoinit' => TRUE,
	'encrypt' => FALSE,
	'compress' => FALSE,
	'stricton' => FALSE,
	'failover' => array(),
	'save_queries' => TRUE
);

 
