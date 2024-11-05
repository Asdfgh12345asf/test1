<?php
/*****************************************************************/
/* MultiDB Library                                               */
/*                                                               */
/* Handles multiple MySQL connections in an object-oriented way. */
/*                                                               */
/*****************************************************************/

require('handle.php');
require('config.php');
require('utils.php');

class DBHandle extends Handle
{
    private $server;
    private $user;
    private $password;
    private $db;

    public function init($h)
    {
        $this->server = $h["server"];
        $this->user = $h["user"];
        $this->password = $h["password"];
        $this->db = $h["db"];

        $this->open();
    }

    public function open()
    {
        $this->h = mysqli_connect($this->server,
                                  $this->user,
                                  $this->password,
                                  $this->db);
    }

    public function close()
    {
        if(is_resource($this->h) && get_resource_type($this->h) === 'mysql link')
        {
            mysql_close($this->h);
        }
    }

    public function get_handle()
    {
        return $this->h;
    }

    public function do_query($query)
    {
        return $this->h->query($query); 
    }
}



class MultiDBConfig extends Config
{
    private $callback;

    public function __construct($callback_string)
    {
        parent::__construct();

        // set callback function
        $this->callback = $callback_string;
    }

    public function get_callback()
    {
        return $this->callback;
    }
}


class MultiDBHandle extends CallbackIterator
{
    protected $handles = array();
    protected $config;

    public function __construct($h)
    {
        $this->config = new MultiDBConfig('MultiDBHandle::get_mysqli_handle');
        foreach($h as $handle)
        {
            $dbhandle = new DBHandle();
            $dbhandle->init($handle);
            $this->handles[] = $dbhandle;
        }
        // This will allow us to iterate on mysqli handles
        parent::__construct($this->handles, $this->config->get_callback());
    }

    public function __destruct()
    {
        if($this->config->is_auto_shutdown())
        {
            $this->shutdown_handles();
        }
    }

    public function config()
    {
        return $this->config;
    }

    public function handle($i)
    {
        return $this->handles[$i];
    }

    public function get_handles()
    {
        return $this->handles;
    }

    public function get_mysqli_handle($handle)
    {
        return $handle->get_handle();
    }

    public function shutdown_handles()
    {
        foreach ($this->handles as $handle)
        {
            $handle->close();
        }
    }
}

?>
