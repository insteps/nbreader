<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * CodeIgniter RSS Model
 *
 * A basic model for Newsbeuter Rssfeeds config table
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
| RSS REST API DATA MODELS
| -------------------------------------------------------------------
| This file will contain the settings needed to access your api.
|
| -------------------------------------------------------------------
| EXPLANATION OF VARIABLES
| -------------------------------------------------------------------
|
*/

class Newsbeuter_rss_url_model extends CI_Model
{

    public function __construct()
    {
        // Call the CI_Model constructor
        parent::__construct();
        //$this->load->database('newsbeuter');
    }


    public function get_max_rss_url_id()
    {
        $this->db->select_max('rssurl', 'rssurl');
        $q = $this->db->get('rss_url');
        $result = $q->result_array();
        $result = $result[0];
        if($result['rssurl'] == null)
        {
            $rssurl = 1;
        }
        else
        {
            $rssurl = $result['rssurl']+1;
        }
        return $rssurl;
    }
     
     
    private function get_rss_url_result($search_options = array(), $limit = 0, $offset = 0)
    {
         
        $this->db->select("
              ru.rssurl
            , ru.tags
            , ru.dbname
            , ru.lastmodified
            , ru.lastfetch
            , ru.sha1sum
            , ru.icon
     
        ");
         
        $this->db->from('rss_url ru');
         
        if(isset($search_options['rssurl']))
        {
            $this->db->where('ru.rssurl', $search_options['rssurl']);
        }
        if(isset($search_options['tags']))
        {
            $this->db->where('ru.tags', $search_options['tags']);
        }
        if(isset($search_options['dbname']))
        {
            $this->db->where('ru.dbname', $search_options['dbname']);
        }
        if(isset($search_options['lastmodified']))
        {
            $this->db->where('ru.lastmodified', $search_options['lastmodified']);
        }
        if(isset($search_options['lastfetch']))
        {
            $this->db->where('ru.lastfetch', $search_options['lastfetch']);
        }
        if(isset($search_options['sha1sum']))
        {
            $this->db->where('ru.sha1sum', $search_options['sha1sum']);
        }
         
         
        if(isset($search_options['order_by']))
        {
            $this->db->order_by($search_options['order_by']);
        }
        else
        {
            $this->db->order_by('ru.rssurl DESC');
        }
         
        if($limit != 0)
        {
            if($offset == 0)
            {
                $this->db->limit($limit);
            }
            else
            {
                $this->db->limit($limit, $offset);
            }
        }
         
        $q = $this->db->get();
         
        return $q;
         
    }
     
    public function get_rss_url($search_options = array(), $limit = 0, $offset = 0, $total_rows = 0)
    {
        //if(empty($search_options)){ return array(); }
         
        $search_options['limit'] = $limit;
        $search_options['offset'] = $offset;
        $search_options['total_rows'] = $total_rows;
         
        $result = array();
         
        $q = $this->get_rss_url_result($search_options, $limit, $offset);
         
        if($q->num_rows() > 0)
        {
            $row_num = $total_rows - $offset;
            foreach($q->result_array() as $row)
            {
                $row['row_num'] = $row_num;
                $row_num--;
                 
                $result[] = $row;
            }
        }
         
        return $result;
    }





    private function _store_rss_url($rss_url_info)
    {
        $result = false;
        if(!empty($rss_url_info))
        {
            $this->db->set($rss_url_info);
            $result = $this->db->insert('rss_url');
        }
        return $result;
    }
     
    private function _update_rss_url($rss_url_info)
    {
        $result = false;
        $has_condition = false;
        if(!empty($rss_url_info))
        {
            if(isset($rss_url_info['rssurl']) && $rss_url_info['rssurl'] != '')
            {
                $this->db->where('rssurl', $rss_url_info['rssurl']);
                unset($rss_url_info['rssurl']);
                $has_condition = true;
            }
             
            if($has_condition == false){ return false; }
            $this->db->set($rss_url_info);
            $result = $this->db->update('rss_url');
        }
         
        return $result;
    }
     
    private function _delete_rss_url($search_options = array())
    {
        $result = false;
        $has_condition = false;
        if(!empty($search_options))
        {
            if(isset($search_options['rssurl']) && $search_options['rssurl'] != '')
            {
                $this->db->where('rssurl', $search_options['rssurl']);
                unset($search_options['rssurl']);
                $has_condition = true;
            }
             
            if($has_condition == false){ return false; }
            $result = $this->db->delete('rss_url');
        }
         
        return $result;
    }

}

