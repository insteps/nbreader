<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * CodeIgniter CRUD Model
 *
 * A basic and resulable CRUD model for working with databases in CodeIgniter
 *
 * @package         CodeIgniter
 * @subpackage      Models
 * @category        Models
 * @author          Chris Kacerguis
 * @license         MIT
 * @link            https://github.com/chriskacerguis/ci-crud
 * @version         1.0.0
 */

class CRUD_model extends CI_Model
{

    /**
     * @var string
     */
    protected $table;

    /**
     * @var string
     */
    protected $cols;
    
    /**
     * @var string
     */
    protected $created;

    /**
     * @var string
     */
    protected $db_key;
    
    /**
     * constructor
     */
    public function __construct()
    {
        parent::__construct();
        
        // We need the DB library, so I'll load it here, just in case
        // it hasn't been loaded already.
        $this->load->library('database');
        
        $this->cols         = $this->db->list_fields($this->table);
        $this->created      = $this->config->item('crud_db_created');
        $this->db_key       = $this->config->item('crud_db_key');
        $this->db_encrypt   = $this->config->item('crud_db_encrypted');
        
        // Unset the colunms we don't want people to change
        unset($this->cols[$this->config->item('crud_db_key')]);
        unset($this->cols[$this->config->item('crud_db_created')]);
        unset($this->cols[$this->config->item('crud_db_modified')]);

        // If encryption is enabled, then load the encrypt lib
        if ($this->db_encrypt === true) {
            $this->load->library('encrypt');
        }
    }

    /**
     * decrypts a table row, ignoring the columns that aren't encrypted:
     * crud_db_key, crud_db_created, crud_db_modified
     * @param  array  $data [description]
     * @return array  $data     array with decrypted elements
     */
    protected function decrypt_array(array $data)
    {
        foreach ($this->cols as $col) {
            if (isset($data[$col])) {
                $data[$col] = $this->encrypt->deode($data[$col]);
            } else {
                $data[$col] = $data[$col];
            }
            
        }

        return $data;
    }

    /**
     * set the table for our CRUD model
     * @param  string $table
     * @return [type]
     */
    public function table(string $table)
    {
        $this->table = $table;
        return $this;
    }


    /**
     * creates a record in our table
     * @param  array  $data
     * @return bool
     */
    public function create(array $data)
    {
        $payload = null;

        foreach ($this->cols as $item) {
            if (isset($data[$item])) {
                if ($this->db_encrypt === true) {
                    $payload[$item] = $this->encrypt->encode($data[$item]);
                } else {
                    $payload[$item] = $data[$item];
                }
                
            }
        }

        if ($payload === null) {
            return false;
        }

        $payload[$this->created] = date('Y-m-d H:i:s');
        return $this->db->insert($this->table, $payload);
    }

    /**
     * returns the record with the given id from our table
     * @param  int    $id
     * @return array
     */
    public function get(string $id = null)
    {
        if ($id === null) {
            $result = $this->db->select()->get($this->table)->result_array();
            if ($this->db_encrypt === true) {
                for ($i = 0; $i <= count($result); $i++) {
                    $result[$i] = $this->decrypt_array($result[$i]);
                }
                return $result;                
            }
            return $result;
        }

        $result = $this->db->select()->where($this->db_key, $id)->get($this->table)->row_array();
        if ($this->db_encrypt === true) {
            return $this->decrypt_array($result);
        }
        return $result;
    }

    /**
     * updates the record in the database with the id provided.
     * @param  int    $id
     * @param  array  $data
     * @return bool
     */
    public function update(string $id, array $data)
    {
        $payload = null;
        
        foreach ($this->cols as $item) {
            if (isset($data[$item])) {
                if ($this->db_encrypt === true) {
                    $payload[$item] = $this->encrypt->encode($data[$item]);
                }
                $payload[$item] = $data[$item];
            }
        }

        if ($payload === null) {
            return false;
        }

        return $this->db->update($this->table, $payload, array($this->db_key => $id));
    }

    /**
     * deleted the reocrd whos id is provided
     * @param  int    $id
     * @return bool
     */
    public function delete(string $id)
    {
        return $this->db->delete($this->table, array($this->db_key => $id));
    }

}

/* End of file crud_model.php */
/* Location: ./application/models/crud_model.php */