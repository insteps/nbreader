<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Newsbeuter class
 * Helper + config functions for backend and frontend.
 *
 * @package         CodeIgniter
 * @subpackage      Libraries
 * @category        Libraries
 * @author          V.Krishn
 * @license         MIT
 * @link            https://github.com/insteps/nbreader
 */

class Newsbeuter
{

    // --------------------------------------------------------------------------

    /**
     * Reference to CodeIgniter instance
     *
     * @var object
     */
    protected $CI;

    /**
     * Contents of the newsbeuter
     *
     * @var array
     */
    protected $_newsbeuter_contents = array();

    /**
     * Contents of the newsbeuter
     *
     * @var array
     */
    protected $_newsbeuter_config = array();

    /**
     * Data to parse
     *
     * @var mixed
     */
    protected $_data = [];

    /**
     * Newsbeuter Class Constructor
     *
     * The constructor loads the Session class, used to store the newsbeuter contents.
     *
     * @param    array
     * @return    void
     */
    public function __construct($params = array())
    {
        // Set the super object to a local variable for use later
        $this->CI =& get_instance();

        # Load newsbeuter config file/data
        $this->CI->load->config('newsbeuter', TRUE);
        $this->_newsbeuter_config = $this->CI->config->item('newsbeuter');

        // Are any config settings being passed manually?  If so, set them
        $config = is_array($params) ? $params : array(); # TODO

        // Load the Sessions class
        $this->CI->load->driver('session', $config);

        // Grab the newsbeuter array from the session table # TODO
        $this->_newsbeuter_contents = $this->CI->session->userdata('newsbeuter_contents');
        if ($this->_newsbeuter_contents === NULL)
        {
            // No newsbeuter exists so we'll set some base values
            $this->_newsbeuter_contents = array('newsbeuter_total' => 0, 'total_items' => 0);
        }

        log_message('info', 'newsbeuter Class Initialized');
    }

    // --------------------------------------------------------------------


    public function get_version()
    {
        $file = $this->_newsbeuter_config['newsbeuter']['be']['path'].'/VERSION';
        if (file_exists($file))
        {
            $flist = preg_split( '/[\\n\\s]/', file_get_contents($file) );
            return trim($flist[0]);
        }
        return '';
    }

    public function get_rss_api_url()
    {
        return $this->_newsbeuter_config['newsbeuter']['be']['rss_api_url'];
    }

    public function get_local_feed_baseurl()
    {
        $file = $this->_newsbeuter_config['newsbeuter']['be']['confpath'].'/feedsurl';
        if (file_exists($file))
        {
            $flist = preg_split( '/[\\n\\s]/', file_get_contents($file) );
            return trim($flist[0]);
        }
        return '';
    }

    public function get_local_catogory()
    {
        $c = $this->_newsbeuter_config;
        $file = $c['newsbeuter']['be']['path'].'/config/dbname';
        if (file_exists($file))
        {
            $flist = preg_split( '/[\\n]/', file_get_contents($file) );
            return $flist;
        }
        return '';
    }

    public function check_valid_dbname($name = '')
    {
        $c = $this->_newsbeuter_config;

        $file = $c['newsbeuter']['be']['path'].'/config/dbname';
        if ( ! file_exists($file))
        {
            return '';
        }
        $file = file_get_contents($file);

        $flist = preg_split( '/[\\n\\s]/', $file );
        if( in_array( trim($name), $flist))
        {
            unset($file);
            $name = preg_replace('/[^\\w\\-\\.\\_]/i', '', $name);
            return ($name == '') ? 0 : 1;
        }
        unset($file);
        return 0;
    }

    public function get_local_feed_urls($name = '')
    {
        $file = $this->_newsbeuter_config['newsbeuter']['be']['confpath'].'/url.local/'.$name;
        if (file_exists($file))
        {
            $flist = preg_split( '/[\\n]/', file_get_contents($file) );
            return $flist;
        }
        return '';
    }

    # move to Newsbeuter helper ?
    public function get_parentcategory($cat, $esc=true)
    {

      $nc =  preg_replace('#/[^/]*$#', '', $cat);
      if(! $nc || $nc == '')  { $nc = '/'; }
      return $nc;

    }

    public function get_frontend_jsconf()
    {
        $jsconf = array();
        $jsconf = $this->_newsbeuter_config['newsbeuter']['fe']['jsconf'];
        $jsconf['version'] = $this->get_version();
        return json_encode($jsconf);
    }

    ## Apply Security related filter on RSS contents/text
    public function apply_security_filter($opts = array(), $str = '')
    {
        $this->CI->load->helper('security');
        foreach($opts as $k => $v)
        {

            if($k == 'img')
            {
                $str = strip_image_tags($str);
                $str = preg_replace(array('#</img>#i'), '', $str);
            }

            if($k == 'default')
            {
                $pat = array('/<iframe/i', '#</iframe#i', '/<img/i', '#</img#i',
                             '/script language="javascript"/i',
                             '/script language=\'javascript\'/i', 
                             '/<script/i', '#</script#i',
                             '/<video/i', '#</video#i',
                             '/<audio/i', '#</audio#i',
                             '/<embed/i', '#</embed#i',
                             '/<object/i', '#</object#i'
                            );
                $rep = array('<xiframe', '</xiframe', '<omg', '</omg',
                             'script', 'script', '<noscript', '</noscript',
                             '<novideo', '</novideo',
                             '<noaudio', '</noaudio',
                             '<noembed', '</noembed',
                             '<nobject', '</nobject'
                            );
                $str = preg_replace($pat, $rep, $str);
            }

            if($k == 'textonly')
            {
                $str = strip_tags($str);
                $str = htmlentities($str, ENT_QUOTES); //of whats leftover
            }

            if($k == 'xss')
            {
            }

        }

        return $str;

    }

    public function set_meta_cache_file($opts = array(), $tag = '', $all = FALSE)
    {
        $t = ($tag != '') ? sha1($tag).'.' : '';
        $format = @$opts['format'];
        $f = $this->_newsbeuter_config['newsbeuter']['be']['datapath'].'/meta.'.$t.$format;
        return $f;
    }

    public function set_icon_cache_file($opts = array(), $tag = '', $all = FALSE)
    {
        $t = ($tag != '') ? sha1($tag).'.' : '';
        $format = @$opts['format'];
        $db = (@$opts['dbname'] != '') ? @$opts['dbname'].'.' : '';
        $f = $this->_newsbeuter_config['newsbeuter']['be']['datapath'].'/icon.'.$db.$t.$format;
        return $f;
    }

    # get json saved cache
    public function get_json_cache($file)
    {
        if (file_exists($file))
        {
            $a = file_get_contents($file, TRUE);
            $data = json_decode ($a, TRUE);
            return $data;
        }
        return '';
    }

    public function save_data($file, $data)
    {
        if(!$fp = @fopen($file, 'wb'))
        {
            return false;
        }
        fwrite($fp, $data);
        fclose($fp);
        unset($data);
        return TRUE;
    }

    public function save_json_cache($file, $data)
    {
        $d = json_encode($data);
        $this->save_data($file, $d);
    }

    public function save_meta_cache_lastfetch($file)
    {
        $Now=time();
        $file = $file.'.lastfetch';
        if(!$fp = @fopen($file, 'wb'))
        {
            return false;
        }
        fwrite($fp, $Now);
        fclose($fp);
        return TRUE;
    }

    public function is_meta_cache_fresh($allmeta, $meta)
    {
        $m1 = filemtime($allmeta);
        $m2 = filemtime($meta);
        if( (int)$m2 >= (int)$m1 )
        {
            return true;
        }
        return false;
    }

    # is FILE1 newer than FILE2
    public function is_newer_than($f1, $f2)
    {
        if( (int)filemtime($f1) > (int)filemtime($f2) )
        {
            return true;
        }
        return false;
    }


}

