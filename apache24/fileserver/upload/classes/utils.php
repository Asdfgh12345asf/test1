<?php

class CallbackIterator extends ArrayIterator 
{
    protected $callback;
 
    public function __construct($data, $callback) {
        parent::__construct($data);
 
        $this->callback = $callback;
    }
 
    public function current() {
        $value = parent::current();
        $value = call_user_func($this->callback, $value);
        return $value;
    }
}


?>
