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

class Newsbeuter_cache extends CI_Model
{

    public function __construct()
    {
        // Call the CI_Model constructor
        parent::__construct();

        //$this->load->database('newsbeuter');
        $this->load->library('newsbeuter');
        //$this->load->library('dataHandler');

    }

    public function handlecache($opts = array(), $tag = '', $all = FALSE)
    {

    }


    public function get_meta_all($opts = array(), $tag = '', $all = FALSE)
    {


    }

    public function get_meta($opts = array(), $tag = '', $all = FALSE)
    {

        $this->load->model('newsbeuter/newsbeuter_model', 'newsbeuter_model');

    }


    private function _get_lastfetch($opts = array(), $tag = '', $all = FALSE)
    {

    }

    private function _is_fresh()
    {

    }

    private function _is_cache()
    {

    }

    private function _save()
    {

    }


}

