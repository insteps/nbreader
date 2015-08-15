<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . '/libraries/REST_Controller.php';

/**
 * Rest Server for Newsbeuter RSS Feeds application.
 * This is user interaction rest/api methods to get
 * RSS feeds item/info and meta from newsbeuter database and related files.
 *
 * @package         CodeIgniter
 * @subpackage      Controller
 * @category        Controller
 * @author          V.Krishn
 * @license         MIT
 * @link            https://github.com/insteps/nbreader
 */
class Rss extends REST_Controller {

    //protected $newsbeuter = array();

    public function __construct()
    {
        // Construct the parent class
        parent::__construct();

        // Configure limits on our controller methods # TODO
        // Ensure you have created the 'limits' table and enabled 'limits'
        // within application/config/rest.php
        //$this->methods['item_get']['limit'] = 500; //500 requests per hour per user/key
        //$this->methods['appdb_get']['limit'] = 100; //100 requests per hour per user/key
        //$this->methods['user_delete']['limit'] = 50; //50 requests per hour per user/key

        # newsbeuter load config
        $this->load->config('newsbeuter', TRUE);
        $c = $this->config->item('newsbeuter');

        # newsbeuter set db
        $db = $c['newsbeuter']['db'];
        $dbpath = $c['newsbeuter']['be']['dbpath'];

        # check get/request
        $dbname = $this->get('cat');

        $this->load->library('newsbeuter');

        $class = $this->uri->rsegment(2, 0);

        if ($class == 'appdb')
        {
            # test
            if ( file_exists($c['newsbeuter']['be']['confdb']) )
            {
                $this->load->database($c['newsbeuter']['be']['db']);
            }
            else
            {
                $this->response(['error' => 'Invalid App db'], 404);
            }

            $this->load->database($db);
        }
        if ($class !== 'category' && $class !== 'meta'
             && $class !== 'appdb' && $class !== 'version')
        {
            # verify valid/active dbname
            if ($this->_check_valid_dbname($dbname)
                && file_exists($dbpath."/$dbname.loc.db")
               )
            {
                $db['database'] = $dbpath."/$dbname.loc.db";
            }
            else
            {
                if ( $class == 'index' )
                {
                    $this->response(['error' => 'Invalid method'], 404);
                }
                $this->response(['error' => 'Invalid category'], 404);
            }

            $this->load->database($db);
        }

        //$this->load->database($db);

    }

    public function version_get()
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        #    (read contents of VERSION)
        # 
        # /version : 
        # version      = Method/Function call (get application version)
        #
        $data = array();
        $data['version'] = $this->newsbeuter->get_version();
        if ($data)
        {
            $this->response($data, 200);
        }
        else
        {
            $this->response(['error' => 'Version file not found'], 404);
        }
    }

    public function category_get()
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        #    (read contents of config/dbname)
        # 
        # /category : 
        # category      = Method/Function call (get list of databases i.e. dbnames)
        #

        $data = array();
        $this->load->library('newsbeuter');
        $data['category'] = $this->newsbeuter->get_local_catogory();
        $data['backend'] = 'newsbeuter';

        if ($data['category'])
        {
            $this->response($data, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(['error' => 'Category list not found'], 404);
        }

    }

    public function urls_get()
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        #    (read contents of config/url.local/<dbname>)
        # 
        # /urls/cat/dev : 
        # urls      = Method/Function call
        #   cat/<dbname>         = Load category/database named <dbname>
        #

        $data['dbname'] = $this->get('cat');
        $data['feedurls'] = $this->newsbeuter->get_local_feed_urls($data['dbname']);
        $data['backend'] = 'newsbeuter';

        if ($data['feedurls'])
        {
            $this->response($data, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(['error' => 'Feed urls could not be found'], 404);
        }

    }

    public function appdb_get() # TODO
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        #    (get from database config/urls.db)
        # 
        # /appdb/hash/<sha1sum>/cat/dev/tags/news~bbc.co.uk : 
        # appdb      = Method/Function call
        #   hash/<sha1sum>        = Fetch rss item by hash (filter records by hash)
        #   cat/<dbname>          = Load category/database named <dbname>
        #   tags/<rss category>   = Rss category (`~` as separator)
        #

        $this->load->model('newsbeuter/Newsbeuter_rss_url_model', 'rss_url');
        $search_options = array();
        $dbname = trim($this->get('cat'));

        $tags = trim($this->get('tags'));
        $tags = '/'.str_replace('~', '/', $tags);
        $tags = preg_replace('#/+#', '/', $tags);
        $tags = rtrim($tags, '/');

        $limit = 1;

        if ( $this->get('hash') && strlen($this->get('hash')) >= 20 )
        {
            $hash = $this->get('hash');
            $search_options['sha1sum'] = $hash;
            $limit = 1;
        } else {
            if( $dbname !== '' ) {
                $search_options['dbname'] = $dbname;
                $limit = 10; # TODO
            }
            if( $tags !== '' ) {
                $search_options['tags'] = $tags;
                $limit = 0; //no limit, get all by tags
            }
        }

        $data = $this->rss_url->get_rss_url($search_options, $limit, 0, 0);
        $data['backend'] = 'newsbeuter';

        if ($data)
        {
            $this->response($data, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(['error' => 'Rss feed info not found'], 404);
        }

    }

    public function feed_get()
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        # 
        # /feed/cat/dev/row/<limit>-<offset>/hash/<sha1sum> : 
        # feed      = Method/Function call
        #   cat/<dbname>         = Load category/database named <dbname>
        #   row/<limit>-<offset> = Fetch number of rows = <limit> starting at <offset>
        #   hash/<sha1sum>       = Fetch rss feeds list (with hash row values has no effect)
        #

        $this->load->model('newsbeuter/newsbeuter_rss_feed_model', 'rssfeed');
        $data['dbname'] = $this->get('cat');
        $data['feedsurl'] = $this->newsbeuter->get_local_feed_baseurl();
        $search_options = array();
        $search_options['id'] = NULL; //there is not 'id'

        # add feedurl search_options, sha1sum eg. ffb1840d0a0c9bc303887e26277d7e28f7f31cad
        if ( $this->get('hash') && strlen($this->get('hash')) >= 20 )
        {
            $feedurl = $this->get('hash');
            $feedurl = $data['feedsurl'] .'/'. $feedurl[0] .'/'. $feedurl[0].$feedurl[1] .'/'. $feedurl . '.xml';
            $search_options['rssurl'] = $feedurl;
            $rec = explode('-', '0-0-0');
        }
        else
        {
            $rec = ($this->get('row')) ? explode('-', $this->get('row').'-0-0') : explode('-', '0-0-0');
        }
        $limit = ((int)$rec[0] >= 1) ? (int)$rec[0] : 0;
        $offset = ((int)$rec[1] >= 1) ? (int)$rec[1] : 0;
        $total_rows = ((int)$rec[2] >= 1) ? (int)$rec[2] : 0;

        $data['query'] = $this->rssfeed->get_rss_feed($search_options, $limit, $offset, $total_rows);
        $data['backend'] = 'newsbeuter';

        if ($data)
        {
            $this->response($data, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(['error' => 'Feed item could not be found'], 404);
        }

    }

    public function item_get()
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        # 
        # /item/cat/dev/row/<limit>-<offset>/id/<idnum> : 
        # item      = Method/Function call
        #   cat/<dbname>         = Load category/database named <dbname>
        #   row/<limit>-<offset> = Fetch number of rows = <limit> starting at <offset>
        #   id/<idnum>           = Fetch rss item by id (with id row values has no effect)
        #   hash/<sha1sum>       = Fetch rss item by hash (filter records by hash)
        #

        $this->load->model('newsbeuter/newsbeuter_rss_item_model', 'rss_item');
        $data['dbname'] = $this->get('cat');
        $data['feedsurl'] = $this->newsbeuter->get_local_feed_baseurl();
        $search_options = array();

        if ( (int)$this->get('id') >= 1 )
        {
            $search_options['id'] = (int)$this->get('id');
            $rec = explode('-', '0-0-0');
        }
        else
        {
            $rec = ($this->get('row')) ? explode('-', $this->get('row').'-0-0') : explode('-', '0-0-0');
        }
        $limit = ((int)$rec[0] >= 1) ? (int)$rec[0] : 1; // minimum 1 latest record
        $limit = ($limit >= 10) ? 10 : $limit; // maxlimit=10 records
        $offset = ((int)$rec[1] >= 1) ? (int)$rec[1] : 0;
        $total_rows = ((int)$rec[2] >= 1) ? (int)$rec[2] : 0;

        # add feedurl search_options for sha1sum
        #   eg. ffb1840d0a0c9bc303887e26277d7e28f7f31cad
        #   you need to know the corrent dbname for sha1sum 
        if ( $this->get('hash') && strlen($this->get('hash')) >= 20 )
        {
            $feedurl = $this->get('hash');
            $feedurl = $data['feedsurl'] .'/'. $feedurl[0] .'/'. $feedurl[0].$feedurl[1] .'/'. $feedurl . '.xml';
            $search_options['feedurl'] = $feedurl;

            ## get items count all by feedurl/hash
            $_d = $this->rss_item->get_rss_item_count($search_options);
            $data['count'] = $_d[$feedurl]['count'];
            ## get items count unread by feedurl/hash
            $search_options['unread'] = '1';
            $_d = $this->rss_item->get_rss_item_count($search_options);
            $data['count_unread'] = $_d[$feedurl]['count'];
            unset($search_options['unread']);
        }

        ## Security/DNT related filter on RSS contents/text
        ## Experimental and may change in future
        if($this->get('filter'))
        {
            $search_options['filter'] = array();
            $temp = explode('~', $this->get('filter'));
            foreach($temp as $v)
            {
                $search_options['filter'][$v] = 'yes';
            }
        }

        $data['query'] = $this->rss_item->get_rss_item($search_options, $limit, $offset, $total_rows);
        $data['backend'] = 'newsbeuter';

        if ($data)
        {
            $this->response($data, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(['error' => 'Rss item not found'], 404);
        }

    }

    public function count_get()
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        # 
        # /count/cat/dev/unread/yes : 
        # count     = Method/Function call
        #   cat/<dbname>         = Load category/database named <dbname>
        #   unread               = yes|no (show list that is read or unread)
        #

        $this->load->model('newsbeuter/newsbeuter_rss_item_model', 'rss_item');
        $data['dbname'] = $this->get('cat');
        $data['feedsurl'] = $this->newsbeuter->get_local_feed_baseurl();
        $search_options = array();

        $unread = strtolower($this->get('unread'));
        if($unread == 'yes' || $unread == 'no')
        {
            $search_options['unread'] = ($unread == 'yes') ? '1' : '0';
        }

        # add feedurl search_options, sha1sum eg. ffb1840d0a0c9bc303887e26277d7e28f7f31cad
        if ( $this->get('hash') && strlen($this->get('hash')) >= 20 )
        {
            $feedurl = $this->get('hash');
            $feedurl = $data['feedsurl'] .'/'. $feedurl[0] .'/'. $feedurl[0].$feedurl[1] .'/'. $feedurl . '.xml';
            $search_options['feedurl'] = $feedurl;

            # feedurl + count ONE /unread/read
            $data['query'] = $this->rss_item->get_rss_item_count($search_options);
        } else {
            # bygroup feedurl + count ALL /unread/read
            // $data['query'] = $this->rss_item->get_count($search_options); //slow
            $data['query'] = $this->rss_item->get_rss_item_count($search_options);
        }
        $data['backend'] = 'newsbeuter';

        if ($data)
        {
            $this->response($data, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(['error' => 'Feed item could not be found'], 404);
        }

    }

    # Get feed/rss url's meta/info
    #   eg. title, url, rssurl(this is id) (for node)
    #   from <dbname> table->rss_feed
    public function meta_get()
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        # 
        # /meta/cat/dev/tag/<tag>/unread/<yes|no> : 
        # meta      = Method/Function call
        #   cat/<dbname>        = Load from category/database named <dbname>
        #   tag/<rss category>  = Rss category (`~` as separator, eg business~seo~seochat.com)
        #   unread/<yes|no>     = yes|no (get list that is either read or unread)
        #   refresh/<yes|no>    = yes|no (use cached data)
        #

        $this->load->model('newsbeuter/newsbeuter_model', 'newsbeuter_model');

        $opts = array(); $data = array();
        $opts['dbname'] = $this->get('cat');
        $unread = strtolower($this->get('unread'));
        if($unread == 'yes' || $unread == 'no')
        {
            $opts['unread'] = $unread;
        }
        $tag = $this->get('tag');
        $tag = str_replace('~', '/', $tag);

        $refresh = (strtolower($this->get('refresh')) == 'yes') ? 'yes' : 'no';
        $opts['refresh'] = $refresh;

        $formats = array('json', 'xml', 'php');
        $format = $opts['format'] = strtolower($this->get('format'));
        if ( ! $format || ! in_array($format, $formats) )
        {
                $opts['format'] = 'json';
        }

        $data = $this->newsbeuter_model->_get_meta($opts, $tag);
        $data['apiurl'] = $this->newsbeuter->get_rss_api_url();
        $data['feedsurl'] = $this->newsbeuter->get_local_feed_baseurl();
        $data['backend'] = 'newsbeuter';
        if( $tag == '' )
        {
            $data['jsconf'] = $this->newsbeuter->get_frontend_jsconf();
        }

        if (isset($data['_by_cat']))
        {
            $this->response($data, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(['error' => 'Meta list error'], 404);
        }

    }



    /**
     * Write routines
     */

    // http://localhost/nbreader/api/rss/unread_/id/458/cat/dev/unread/no
    public function unread__get()
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        # 
        # /unread_/cat/dev/id/<idnum>/unread/<yes|no> : 
        # unread_      = Method/Function call
        #   cat/<dbname>       = Update category/database named <dbname>
        #   id/<idnum>         = update rss item for <id>
        #   unread/<yes|no>    = update item to read or unread
        #

        $this->load->model('newsbeuter/newsbeuter_rss_item_model', 'rss_item');
        $data['dbname'] = $this->get('cat');
        $data['feedsurl'] = $this->newsbeuter->get_local_feed_baseurl();
        $search_options = array();

        if ( (int)$this->get('id') >= 1 )
        {
            $search_options['id'] = (int)$this->get('id');
        }

        $unread = strtolower($this->get('unread'));
        if($unread == 'yes' || $unread == 'no')
        {
            $search_options['unread'] = ($unread == 'yes') ? '1' : '0';
        }

        $data['result'] = $this->rss_item->update_rss_item_read($search_options);
        $data['backend'] = 'newsbeuter';

        if ($data['result'])
        {
            $this->response($data, 200); // 200 being the HTTP response code
        }
        else
        {
            $this->response(['error' => 'Feed item could not be found'], 404);
        }


    }






    public function item_get_new()
    {
        // if (!$this->get('id'))
        // {
        //     $this->response(NULL, 400);
        // }

    }






    protected function _check_valid_dbname($name)
    {
        $this->load->library('newsbeuter');
        return $this->newsbeuter->check_valid_dbname($name);
    }








}

