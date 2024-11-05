<?php

class Config
{
    protected $auto_init;
    protected $auto_shutdown;

    public function __construct()
    {
        $this->auto_init = false;
        $this->auto_shutdown = false;
    }

    public function is_auto_init()
    {
        return $this->auto_init;
    }

    public function set_auto_init()
    {
        $this->auto_init = true;
    }

    public function unset_auto_init()
    {
        $this->auto_init = false;
    }
    public function is_auto_shutdown()
    {
        return $this->auto_shutdown;
    }

    public function set_auto_shutdown()
    {
        $this->auto_shutdown = true;
    }

    public function unset_auto_shutdown()
    {
        $this->auto_shutdown = false;
    }
}


?>
