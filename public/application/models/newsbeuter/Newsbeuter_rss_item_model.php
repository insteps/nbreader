<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * CodeIgniter RSS Model
 *
 * A basic model for Newsbeuter RssItems table
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
| RSS REST API DATA MODELS
| -------------------------------------------------------------------
| This file will contain the settings needed to access your api.
|
| -------------------------------------------------------------------
| EXPLANATION OF VARIABLES
| -------------------------------------------------------------------
|
*/

class Newsbeuter_rss_item_model extends CI_Model
{

    public function __construct()
    {
        // Call the CI_Model constructor
        parent::__construct();
        //$this->load->database('newsbeuter');
    }

    public function get_max_rss_item_id()
    {
        $this->db->select_max('id', 'id');
        $q = $this->db->get('rss_item');
        $result = $q->result_array();
        $result = $result[0];
        if($result['id'] == null)
        {
            $id = 1;
        }
        else
        {
            $id = $result['id']+1;
        }
        return $id;
    }
     
     
    private function _get_rss_item_result($search_options = array(), $limit = 0, $offset = 0)
    {
         
        $this->db->select("
              ri.id
            , ri.guid
            , ri.title
            , ri.author
            , ri.url
            , ri.feedurl
            , ri.pubDate
            , ri.content
            , ri.unread
            , ri.enclosure_url
            , ri.enclosure_type
            , ri.enqueued
            , ri.flags
            , ri.deleted
            , ri.base
     
        ");
         
        $this->db->from('rss_item ri');
         
        if(isset($search_options['id']))
        {
            $this->db->where('ri.id', $search_options['id']);
        }
        if(isset($search_options['guid']))
        {
            $this->db->where('ri.guid', $search_options['guid']);
        }
        if(isset($search_options['title']))
        {
            $this->db->where('ri.title', $search_options['title']);
        }
        if(isset($search_options['author']))
        {
            $this->db->where('ri.author', $search_options['author']);
        }
        if(isset($search_options['url']))
        {
            $this->db->where('ri.url', $search_options['url']);
        }
        if(isset($search_options['feedurl']))
        {
            $this->db->where('ri.feedurl', $search_options['feedurl']);
        }
        if(isset($search_options['pubDate']))
        {
            $this->db->where('ri.pubDate', $search_options['pubDate']);
        }
        if(isset($search_options['content']))
        {
            $this->db->where('ri.content', $search_options['content']);
        }
        if(isset($search_options['unread']))
        {
            $this->db->where('ri.unread', $search_options['unread']);
        }
        if(isset($search_options['enclosure_url']))
        {
            $this->db->where('ri.enclosure_url', $search_options['enclosure_url']);
        }
        if(isset($search_options['enclosure_type']))
        {
            $this->db->where('ri.enclosure_type', $search_options['enclosure_type']);
        }
        if(isset($search_options['enqueued']))
        {
            $this->db->where('ri.enqueued', $search_options['enqueued']);
        }
        if(isset($search_options['flags']))
        {
            $this->db->where('ri.flags', $search_options['flags']);
        }
        if(isset($search_options['deleted']))
        {
            $this->db->where('ri.deleted', $search_options['deleted']);
        }
        if(isset($search_options['base']))
        {
            $this->db->where('ri.base', $search_options['base']);
        }
         
         
        if(isset($search_options['order_by']))
        {
            $this->db->order_by($search_options['order_by']);
        }
        else
        {
            $this->db->order_by('ri.id DESC');
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
     
    public function get_rss_item($search_options = array(), $limit = 0, $offset = 0, $total_rows = 0)
    {
        //if(empty($search_options)){ return array(); } //??
         
        $search_options['limit'] = $limit;
        $search_options['offset'] = $offset;
        $search_options['total_rows'] = $total_rows;

        if(isset($search_options['filter']))
        {
            $filter = $search_options['filter'];
            unset($search_options['filter']);
        }

        $result = array();
         
        $q = $this->_get_rss_item_result($search_options, $limit, $offset);
         
        if($q->num_rows() > 0)
        {
            $row_num = $total_rows - $offset;
            foreach($q->result_array() as $row)
            {
                $row['row_num'] = $row_num;
                $row_num--;
                if(isset($filter) && is_array($filter))
                {
                    // apply_security_filter
                    $row['content'] = $this->newsbeuter->apply_security_filter($filter, $row['content']);
                }
                // apply_security_filter for 'title', 'author' # (mandatory filter)
                $fil =  array(); $fil['textonly'] = 'yes';
                $row['title'] = $this->newsbeuter->apply_security_filter($fil, $row['title']);
                $row['author'] = $this->newsbeuter->apply_security_filter($fil, $row['author']);
                unset($fil);

                $result[] = $row;
            }
        }

        return $result;
    }

    ## Only using table rss_item
    public function get_rss_item_count($search_options = array())
    {

        $this->db->select("
              ri.feedurl
            , count(ri.feedurl) as count
     
        ");
         
        $this->db->from('rss_item ri');
        if(isset($search_options['unread']))
        {
            $this->db->where('ri.unread', $search_options['unread']);
        }

        if(isset($search_options['feedurl']))
        {
            $this->db->where('ri.feedurl', $search_options['feedurl']);
        }
        else
        {
            $this->db->group_by('feedurl');
        }

        if(isset($search_options['order_by']))
        {
            $this->db->order_by($search_options['order_by']);
        }
        else
        {
            $this->db->order_by('ri.id DESC');
        }

        $result = array();
        $q = $this->db->get();

        if($q->num_rows() > 0)
        {
            foreach($q->result_array() as $row)
            {
                //$result[] = $row; //less useful
                $feedurl = trim($row['feedurl']);
                if($feedurl !== '')
                {
                    $result[$feedurl]['count'] = $row['count'];
                }
            }
        }

        return $result;

    }

    ## Combine both tables - rss_item + rss_feed
    #   (i.e to get title in result_array)
    public function get_count($search_options = array())
    {

        $this->db->select("
              ri.feedurl
            , rf.title
            , count(ri.feedurl) as count
     
        ");
        // select rssurl,rss_feed.title,count(rss_item.feedurl) as count
        //   from rss_feed, rss_item where rssurl=feedurl group by feedurl;
        
        # use 2 tables
        $this->db->from('rss_item ri');
        $this->db->from('rss_feed rf');
        $this->db->where('rf.rssurl=', 'ri.feedurl', FALSE);
        //$this->db->join('rssurl', 'rf.rssurl = ri.feedurl'); //??
        if(isset($search_options['unread']))
        {
            $this->db->where('ri.unread', $search_options['unread']);
        }

        $this->db->group_by('ri.feedurl');

        if(isset($search_options['order_by']))
        {
            $this->db->order_by($search_options['order_by']);
        }
        else
        {
            $this->db->order_by('ri.id DESC');
        }

        $result = array();
        $q = $this->db->get();

        if($q->num_rows() > 0)
        {
            foreach($q->result_array() as $row)
            {
                //$result[] = $row; //less useful
                $feedurl = trim($row['feedurl']);
                if($feedurl !== '')
                {
                    $result[$feedurl]['title'] = $row['title'];
                    $result[$feedurl]['count'] = $row['count'];
                }
            }
        }

        $str = $this->db->last_query();
        return $result;

    }


    public function get_last_ten_entries()
    {
        $query = $this->db->get('rss_item', 10);
        return $query->result();
    }





    /**
     * Write routines
     */

    public function update_rss_item_read($rss_item_info = array(), $limit = 0)
    {
        //$rss_item_info['limit'] = $limit;

        if(isset($rss_item_info['id']) && isset($rss_item_info['unread']))
        {
            $id = $rss_item_info['id'];
            $unread =  $rss_item_info['unread'];
            //unset($rss_item_info);
            $rss_item_info = array();
            $rss_item_info['id'] = $id;
            $rss_item_info['unread'] = $unread;

            return $this->_update_rss_item($rss_item_info);
        }
    }

    // -----------------------------------------

    private function _update_rss_item($rss_item_info)
    {
        $result = false;
        $has_condition = false;
        if(!empty($rss_item_info))
        {
            if(isset($rss_item_info['id']) && $rss_item_info['id'] != '')
            {
                $this->db->where('id', $rss_item_info['id']);
                unset($rss_item_info['id']);
                $has_condition = true;
            }
             
            if($has_condition == false){ return false; }
            $this->db->set($rss_item_info);
            $result = $this->db->update('rss_item');
        }
         
        return $result;
    }

    // -----------------------------------------

    // -----------------------------------------

    private function _store_rss_item($rss_item_info)
    {
        $result = false;
        if(!empty($rss_item_info))
        {
            $this->db->set($rss_item_info);
            $result = $this->db->insert('rss_item');
        }
        return $result;
    }

    private function _delete_rss_item($search_options = array())
    {
        $result = false;
        $has_condition = false;
        if(!empty($search_options))
        {
            if(isset($search_options['id']) && $search_options['id'] != '')
            {
                $this->db->where('id', $search_options['id']);
                unset($search_options['id']);
                $has_condition = true;
            }
             
            if($has_condition == false){ return false; }
            $result = $this->db->delete('rss_item');
        }
         
        return $result;
    }

}

