<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * CodeIgniter RSS Model
 *
 * A basic model for Newsbeuter Rssfeeds table
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

class Newsbeuter_rss_feed_model extends CI_Model
{

    public function __construct()
    {
        // Call the CI_Model constructor
        parent::__construct();
        //$this->load->database('newsbeuter');
    }

    public function get_max_rss_feed_id()
    {
        $this->db->select_max('rssurl', 'rssurl');
        $q = $this->db->get('rss_feed');
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
 
 
    private function get_rss_feed_result($search_options = array(), $limit = 0, $offset = 0)
    {
         
        $this->db->select("
              rf.rssurl
            , rf.url
            , rf.title
            , rf.lastmodified
            , rf.is_rtl
            , rf.etag
  
        ");
         
        $this->db->from('rss_feed rf');
         
        if(isset($search_options['rssurl']))
        {
            $this->db->where('rf.rssurl', $search_options['rssurl']);
        }
        if(isset($search_options['url']))
        {
            $this->db->where('rf.url', $search_options['url']);
        }
        if(isset($search_options['title']))
        {
            $this->db->where('rf.title', $search_options['title']);
        }
        if(isset($search_options['lastmodified']))
        {
            $this->db->where('rf.lastmodified', $search_options['lastmodified']);
        }
        if(isset($search_options['is_rtl']))
        {
            $this->db->where('rf.is_rtl', $search_options['is_rtl']);
        }
        if(isset($search_options['etag']))
        {
            $this->db->where('rf.etag', $search_options['etag']);
        }
         
         
        if(isset($search_options['order_by']))
        {
            $this->db->order_by($search_options['order_by']);
        }
        else
        {
            $this->db->order_by('rf.rssurl DESC');
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
 
    public function get_rss_feed($search_options = array(), $limit = 0, $offset = 0, $total_rows = 0)
    {
        //if(empty($search_options)){ return array(); }
         
        $search_options['limit'] = $limit;
        $search_options['offset'] = $offset;
        $search_options['total_rows'] = $total_rows;
         
        $result = array();
         
        $q = $this->get_rss_feed_result($search_options, $limit, $offset);
         
        if($q->num_rows() > 0)
        {
            $row_num = $total_rows - $offset;
            foreach($q->result_array() as $row)
            {
                $row['row_num'] = $row_num;
                $row_num--;
                 
                //$result[] = $row; //less useful
                $rssurl = trim($row['rssurl']);
                unset($row['rssurl']);
                if($rssurl !== '')
                {
                    $result[$rssurl] = $row;
                }
            }
        }
         
        return $result;
    }

    public function get_last_ten_entries()
    {
        $query = $this->db->get('rss_feed', 10);
        return $query->result();
    }
     






    /**
     * Write routines
     */

    // -----------------------------------------

    private function _store_rss_feed($rss_feed_info)
    {
        $result = false;
        if(!empty($rss_feed_info))
        {
            $this->db->set($rss_feed_info);
            $result = $this->db->insert('rss_feed');
        }
        return $result;
    }
     
    private function _update_rss_feed($rss_feed_info)
    {
        $result = false;
        $has_condition = false;
        if(!empty($rss_feed_info))
        {
            if(isset($rss_feed_info['rssurl']) && $rss_feed_info['rssurl'] != '')
            {
                $this->db->where('rssurl', $rss_feed_info['rssurl']);
                unset($rss_feed_info['rssurl']);
                $has_condition = true;
            }
             
            if($has_condition == false){ return false; }
            $this->db->set($rss_feed_info);
            $result = $this->db->update('rss_feed');
        }
         
        return $result;
    }
     
    private function _delete_rss_feed($search_options = array())
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
            $result = $this->db->delete('rss_feed');
        }
         
        return $result;
    }

}

