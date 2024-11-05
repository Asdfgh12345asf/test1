<?php

class Handle
{
    protected $h;

    public function init($h)
    {
        $this->h = $h;
        $this->open();
    }

    public function shutdown()
    {
        $this->close();
    }

    public function open()
    {
        fopen($this->h, "r");
    }

    public function close()
    {
        fclose($this->h);
    }
}

?>
