<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * CodeIgniter RSS Client Model (Fetch via RSS Rest API)
 * A basic data model + api wrapper for Newsbeuter Rssfeeds
 *
 * @package         CodeIgniter
 * @subpackage      Models
 * @category        Models
 * @author          V.Krishn
 * @license         MIT
 * @link            https://github.com/insteps/nbreader
 */

/*
| -------------------------------------------------------------------
| RSS REST API ACCESS DATA MODELS
| -------------------------------------------------------------------
| This file contains methods needed to access rss api and data
|   internally, suited best from controllers.
|
| -------------------------------------------------------------------
| EXPLANATION OF VARIABLES
| -------------------------------------------------------------------
|
*/

class Newsbeuter_model extends CI_Model
{

    public function __construct()
    {
        // Call the CI_Model constructor
        parent::__construct();

        $this->load->library('newsbeuter');

    }

    public function get_version()
    {
        $apiurl = $this->newsbeuter->get_rss_api_url();
        $a = file_get_contents($apiurl . "/version");
        return json_decode($a, TRUE);
    }

    public function get_category()
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        # 
        # /category : 
        # category      = Function call (get list of top category i.e. dbnames)
        #

        $apiurl = $this->newsbeuter->get_rss_api_url();
        $format = '/format/json';

        $a = file_get_contents($apiurl . "/category{$format}");
        return json_decode ($a, TRUE);

        //alternate
        //$data = array();
        //$data['category'] = $this->newsbeuter->get_local_catogory();
        //return $data;

    }

    public function get_urls($opts = array())
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        # 
        # /urls/cat/dev : 
        # urls      = Function call
        #   cat/<dbname>         = Load category/database named <dbname>
        #

        $dbname = (isset($opts['dbname'])) ? '/cat/'.$opts['dbname'] : '';
        $format = '/format/json';

        $apiurl = $this->newsbeuter->get_rss_api_url();
        $a = file_get_contents($apiurl . "/urls{$dbname}{$format}");
        return json_decode ($a, TRUE);

    }

    # Return array with keys as localurl
    public function get_urls_as_key($opts = array())
    {
        $data = array(); $data['category'] = array();
        $c = $this->get_urls($opts);

        foreach ($c['feedurls'] as $u) {
            if ( trim($u) !== '') { 
                //list($url, $cat) = explode('"/', $u);
                list($url, $cat) = str_getcsv($u, ' ', '"'); // PHP 5 >= 5.3.0
                $url = trim($url);
                //$cat = trim($cat, '"');
                $cat = ltrim($cat, '/');
                //$data['by_url'][$url]['category'] = $cat; //not used
                $data['by_cat'][$cat][] = $url;

                $data['category'][] = $cat;
                $p = $this->newsbeuter->get_parentcategory($cat);
                    if ( ! in_array($p, $data['category']) ) {
                    $data['category'][] = $p;
                }

            }
        }
        $data['category'] = array_unique($data['category']);
        //natcasesort($data['category']); //not useful here

        return $data;

    }

    public function get_rss_feed($opts = array())
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        # 
        # /feed/cat/dev/row/<limit>-<offset>/hash/<sha1sum> : 
        # feed      = Function call
        #   cat/<dbname>         = Load category/database named <dbname>
        #   row/<limit>-<offset> = Fetch number of rows = <limit> starting at <offset>
        #   hash/<sha1sum>       = Fetch rss feeds list (with hash row values has no effect)
        #

        $dbname = (isset($opts['dbname'])) ? '/cat/'.$opts['dbname'] : '';

        $limit = (isset($opts['limit'])) ? $opts['limit'] : '0';
        $offset = (isset($opts['offset'])) ? $opts['offset'] : '0';
        $row = "/row/$limit-{$offset}";

        $hash = (isset($opts['hash'])) ? '/hash/'.$opts['hash'] : '';
        $format = '/format/json';

        $apiurl = $this->newsbeuter->get_rss_api_url();
        $a = file_get_contents($apiurl . "/feed{$dbname}{$row}{$hash}{$format}");
        return json_decode($a, TRUE);

    }

    public function get_max_rss_item_id()
    {

    }

    public function get_rss_item($opts = array())
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        # 
        # /item/cat/dev/row/<limit>-<offset>/id/<idnum> : 
        # item      = Function call
        #   cat/<dbname>         = Load category/database named <dbname>
        #   row/<limit>-<offset> = Fetch number of rows = <limit> starting at <offset>
        #   id/<idnum>           = Fetch rss item by id (with id row values has no effect)
        #   hash/<sha1sum>       = Fetch rss item by hash (filter records by hash)
        #

        $dbname = (isset($opts['dbname'])) ? '/cat/'.$opts['dbname'] : '';

        $limit = (isset($opts['limit'])) ? $opts['limit'] : '0';
        $offset = (isset($opts['offset'])) ? $opts['offset'] : '0';
        $row = "/row/$limit-{$offset}";

        $hash = (isset($opts['hash'])) ? '/hash/'.$opts['hash'] : '';
        $filter = (isset($opts['filter'])) ? '/filter/'.$opts['filter'] : '';
        $format = '/format/json';

        $apiurl = $this->newsbeuter->get_rss_api_url();
        $a = file_get_contents($apiurl . "/item{$dbname}{$row}{$hash}{$filter}{$format}");
        return json_decode($a, TRUE);

    }

    public function get_rss_item_count($opts = array())
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        # 
        # /count/cat/dev/unread/yes : 
        # count     = Function call
        #   cat/<dbname>         = Load category/database named <dbname>
        #   unread               = yes|no (show list that is read or unread)
        #

        $dbname = (isset($opts['dbname'])) ? '/cat/'.$opts['dbname'] : '';
        $unread = (isset($opts['unread'])) ? '/unread/'.$opts['unread'] : '';
        $format = '/format/json';

        $apiurl = $this->newsbeuter->get_rss_api_url();
        $a = file_get_contents($apiurl . "/count{$dbname}{$unread}{$format}");
        return json_decode ($a, TRUE);

    }

    # Return array with key as localurl
    public function get_rss_item_count_urlaskey($opts = array())
    {

    }

    public function get_meta($opts = array(), $tag = '', $all = FALSE)
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        # 
        # /meta/cat/dev/tag/<tag>/unread/<yes|no> : 
        # meta      = Function call
        #   cat/<dbname>        = Load from category/database named <dbname>
        #   tag/<rss category>  = Rss category (`~` as separator, eg business~seo~seochat.com)
        #   unread/<yes|no>     = yes|no (get list that is either read or unread)
        #   refresh/<yes|no>    = yes|no (use cached data)
        #

        $dbname = (isset($opts['dbname'])) ? '/cat/'.$opts['dbname'] : '';
        $tag = (isset($opts['tag'])) ? '/tag/'.$opts['tag'] : '';
        $unread = (isset($opts['unread'])) ? '/unread/'.$opts['unread'] : '';

        $refresh = (strtolower($opts['refresh']) == 'yes') ? 'yes' : 'no';
        $refresh = '/refresh/'.$refresh;
        $format = '/format/json';

        $apiurl = $this->newsbeuter->get_rss_api_url();
        $a = file_get_contents($apiurl . "/meta{$dbname}{$tag}{$unread}{$refresh}{$format}");
        return json_decode ($a, TRUE);
    }


    # Return full rss/feed meta information
    #  eg. title, count, total count by category
    #  data is used in creating the heirarchy feed list/menu.
    private function _get_allmeta($opts = array())
    {
        # get all db names
        $cat = $this->get_category();

        $data = array(); $category= array(); $aa = array();
        $data['_by_cat'] = array(); $_cat = array();

        if(isset($opts['dbname']) && trim($opts['dbname']) !== '') {
          $cat['category'] = array($opts['dbname']); // to check
        }

        foreach ($cat['category'] as $dbname) {
            $opts['dbname'] = $dbname;
            if ( trim($dbname) !== '') {
                $data[$dbname] = $this->get_urls_as_key($opts);
                $d = $this->get_rss_item_count($opts);
                $data['_cat'][] = $dbname;
                $f = $this->get_rss_feed($opts); // this slows down by 20%+
                //print_r($f);

                foreach ($data[$dbname]['by_cat'] as $c=>$urls) {
                    foreach ($urls as $url) {
                        $url = trim($url);
                        $title = trim(@$f['query'][$url]['title']);
                        //$title = ($title) ? $title : @$aa[$c][$url]['title']; //not needed, see $f
                        $title = ($title == '') ? 'untitled' : $title;

                        if (array_key_exists($url, $d['query'])) {
                            $aa[$c][$url] = $d['query'][$url];
                        } else {
                            //$aa[$c][$url]['title'] = 'untitled';
                            $aa[$c][$url]['count'] = 0;
                        }
                        $aa[$c][$url]['title'] = $dbname.'::'.$title;
                    }
                }
                unset($d); unset($f); unset($data[$dbname]['by_cat']);

                foreach($aa as $c => $v) {
                    $count = 0;
                    foreach($aa[$c] as $u) {
                        $count = $count+$u['count'];
                    }
                    if( ! isset($_cat[$c])) { $_cat[$c] = $count; }
                        else { $_cat[$c] = $_cat[$c]+$count; }
                }

                $category = array_merge($category, $_cat);
                unset($_cat); unset($data[$dbname]);
                //natcasesort($category);

            }
        }

        $_cat = array();
        foreach($category as $c => $v) {
            if( ! isset($_cat[$c])) { $_cat[$c] = $v; }
                else { $_cat[$c] = $_cat[$c]+$v; }
            while (stripos($c, '/') > 0) {
                $c = dirname($c);
                if( ! isset($_cat[$c])) { $_cat[$c] = $v; }
                   else { $_cat[$c] = $_cat[$c]+$v; }
            }
        }
        unset($category);

        ksort($_cat, SORT_NATURAL | SORT_FLAG_CASE); //php 5.4
        $data['_by_cat'] = array_merge($data['_by_cat'], $aa);
        $data['_category'] = $_cat;
        unset($_cat); unset($cat); unset($aa);

        return $data;

    }

    public function _get_meta($opts = array(), $tag = '', $all = FALSE)
    {
        ## test data
        # $opts['dbname'] = 'news';
        # $opts['unread'] = null; // yes | no
        # $opts['refresh'] = 'yes';
        # $tag = 'business/seo/seochat.com';

        $useCached = 'no';
        $refresh = $opts['refresh'];
        $format = $opts['format'];

        $meta_all = $this->newsbeuter->set_meta_cache_file($opts, '');
        $meta = $this->newsbeuter->set_meta_cache_file($opts, $tag);
        $isMeta = file_exists($meta) ? 'yes' : 'no';
        $isAllMeta = file_exists($meta_all) ? 'yes' : 'no';

        if( $refresh == 'no' && $format == 'json' && $isMeta == 'yes' )
        {
            # apply cache model here
            //$this->load->model('newsbeuter/newsbeuter_cache', 'newsbeuter_cache'); # TODO
            //$data = $this->newsbeuter_cache->handlecache($opts, $tag);

            # get local json saved cache if fresh
            if( $this->newsbeuter->is_meta_cache_fresh($meta_all, $meta) )
            {
                $data = $this->newsbeuter->get_json_cache($meta);
                return $data;
            }
        }

        if( $refresh == 'no' && $isAllMeta == 'yes' )
        {
            $data = $this->newsbeuter->get_json_cache($meta_all);
            $genAllMeta = 'no';
        }
        else
        {
            $data = $this->_get_allmeta($opts);
            $genAllMeta = 'yes';
        }

        if( $format == 'json' && $genAllMeta == 'yes' ) # only cache json for now
        {
            $this->newsbeuter->save_json_cache($meta_all, $data, TRUE);
            $this->newsbeuter->save_meta_cache_lastfetch($meta_all);
        }


        # generate / get meta subset
        $_cat = array();
        $tag = preg_replace('#/+#', '/', $tag);
        $tag = trim($tag, '/');

        if( $tag == '' ) { return $data; }
        if( ! key_exists($tag, $data['_category']) ) {
            return $_cat; #empty array
        }

        unset ($data['_cat']);
        $_d = array();
        if( key_exists($tag, $data['_by_cat']) ) {
            $_d = $data['_by_cat'][$tag];
        }
        unset ($data['_by_cat']);
        $data['_by_cat'][$tag] = $_d;

        $_cat[$tag] = $data['_category'][$tag];
        while (stripos($tag, '/') > 0) {
            $tag = dirname($tag);
            if( key_exists($tag, $data['_category']) ) {
                $_cat[$tag] = $data['_category'][$tag];
            }
        }
        unset ($data['_category']); unset($_d);
        ksort($_cat, SORT_NATURAL | SORT_FLAG_CASE); //php 5.4
        $data['_category'] = $_cat; unset ($_cat);

        # save/cache subset
        if( $useCached == 'no' && $format == 'json' )
        {
            $this->newsbeuter->save_json_cache($meta, $data);
        }

        return $data;

    }



    /**
     * Write routines
     */

    public function update_rss_item_read($opts = array())
    {
        ## Api urls example (api baseurl: http://localhost/nbreader/api/rss)
        # 
        # /unread_/cat/dev/id/<idnum>/unread/<yes|no> : 
        # unread_      = Function call
        #   cat/<dbname>     = Update category/database named <dbname>
        #   id/<idnum>       = update rss item for <id>
        #   unread/<yes|no>  = update item to read or unread
        #

        $dbname = (isset($opts['dbname'])) ? '/cat/'.$opts['dbname'] : '';
        $id = (isset($opts['id'])) ? '/id/'.$opts['id'] : '';
        $unread = (isset($opts['unread'])) ? '/unread/'.$opts['unread'] : '';
        //$limit = (isset($opts['limit'])) ? $opts['limit'] : '0';
        $format = '/format/json';

        $apiurl = $this->newsbeuter->get_rss_api_url();
        $a = file_get_contents($apiurl . "/unread_{$dbname}{$id}{$unread}{$format}");
        return json_decode($a, TRUE);

    }



}

