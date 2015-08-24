<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * CodeIgniter RSS Client Cache Model (Fetch via RSS Rest API)
 *
 * A basic model for Newsbeuter Rssfeeds
 *
 * @package         CodeIgniter
 * @subpackage      Models
 * @category        Models
 * @author          V.Krishn
 * @license         MIT
 * @link            https://github.com/insteps/nbreader
 * @version         0.1.0
 */

/*
| -------------------------------------------------------------------
| RSS REST API DATA/CACHE MODELS
| -------------------------------------------------------------------
| This file will contain methods needed to access api.
|
| -------------------------------------------------------------------
| EXPLANATION OF VARIABLES
| -------------------------------------------------------------------
|
*/

class Newsbeuter_icon extends CI_Model
{

    public function __construct()
    {
        // Call the CI_Model constructor
        parent::__construct();

        $this->load->library('newsbeuter');
        //$this->load->library('dataHandler');

    }

    public function get_icon($opts = array(), $all = FALSE)
    {

        $data = array();
        $icons = $this->generate_icons_cache();

        $dbname = $opts['dbname'];

        if (isset($opts['sha1sum']) || empty($icons))
            $data = $this->_get_icon($opts);
        else if (isset($opts['dbname']))
            $data = $this->newsbeuter->get_json_cache($icons[$dbname]);

        return $data;

    }

    public function generate_icons_cache($opts = array(), $all = FALSE)
    {

        # newsbeuter load config
        $this->load->config('newsbeuter', TRUE);
        $c = $this->config->item('newsbeuter');
        $dbpath = $c['newsbeuter']['be']['dbpath'];

        $this->load->model('newsbeuter/Newsbeuter_model', 'newsbeuter_model');
        # get all db names
        $cat = $this->newsbeuter_model->get_category();
        $iconsfile = array();

        foreach ($cat['category'] as $dbname) {
            $opts['dbname'] = $dbname;

            $opts['format'] = 'json';
            $icons = $this->newsbeuter->set_icon_cache_file($opts);
            $opts['format'] = 'lastfetch';
            $iconslf = $this->newsbeuter->set_icon_cache_file($opts);

            $dbfile = $dbpath."/$dbname.loc.db";
            if ( ! file_exists($dbfile) ) { continue; }
            $cf = ( file_exists($iconslf) ) ? $iconslf : $dbfile;

            # get local json saved cache if fresh
            if( file_exists($icons)
                 && $this->newsbeuter->is_newer_than($icons, $cf)
              )
            {
                //$data = $this->newsbeuter->get_json_cache($icons);
                $iconsfile[$dbname] = $icons;
            }
            else
            {
                $data = $this->_get_icon($opts);
                $this->newsbeuter->save_json_cache($icons, $data, TRUE);
            }

        }
        return $iconsfile;

    }

    protected function _get_icon($opts = array(), $all = FALSE)
    {

        $data = array();
        $this->load->model('newsbeuter/Newsbeuter_rss_url_model', 'rss_url');
        $data['feedsurl'] = $this->newsbeuter->get_local_feed_baseurl();

        $limit = 0;
        $data['query'] = $this->rss_url->get_rss_url($opts, $limit, 0, 0);

        $d = array();
        foreach ($data['query'] as $k => $v)
        {
            $hash = $v['sha1sum'];
            $feediconurl = $data['feedsurl'] .'/'. $hash[0] .'/'. $hash[0].$hash[1] .'/'. $hash . '.ico.txt';
            if($v['icon'] == '1')
            {
                $d[$hash] = file_get_contents($feediconurl);
            }
        }

        $data['icon'] = $d;
        unset($d); unset($data['query']); unset($data['feedsurl']);
        return $data;

    }




}


