<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

    /**
     * Index Page for this controller.
     *
     * Maps to the following URL
     *         http://example.com/index.php/welcome
     *    - or -
     *         http://example.com/index.php/welcome/index
     *    - or -
     */
    public function index()
    {

        $this->load->model('newsbeuter/newsbeuter_model', 'newsbeuter_model');
        $opts = array();

        # populate with unread items in node badges
        $opts['unread'] = 'yes';

        # yes: refresh nodes, no: use cache data (faster)
        $opts['refresh'] = 'no';

        # only creates category/folder items without rss/feed items entries
        $data = $this->newsbeuter_model->get_meta($opts, '');

        $this->load->view('homepage', $data);

    }



}


