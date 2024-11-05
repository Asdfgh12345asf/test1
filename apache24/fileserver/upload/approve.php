<?php

require_once('init.php');
require_once('classes/fileupload.php');
require_once('settings/pathconfig.php');

$token = $fileupload->get_app_token();
$admin_key = $fileupload->get_admin_key();

if(!isset($_REQUEST['admin_key']) || (strcmp($_REQUEST['admin_key'], $admin_key) != 0))
{
    //echo "<div class='w3-container'><h4>Unauthorized.</h4></div>";
} 
else
{
    if(isset($_REQUEST['submit']) && isset($_REQUEST['file']))
    {
        $filename = $_REQUEST['file'];

        // Get md5sum from file_info API
        $url = "http://127.0.0.1:8080/api/file_info.php?token=" . $token .
               "&dir=" . $fileupload->tmp_path() .
               "&file=" . $filename;

        $contents = file_get_contents($url);
        $md5sum = (json_decode($contents))->{'md5sum'};

        if(isset($md5sum))
        {
            $fileupload->approve($filename, $md5sum);  
        }
    }
}

header('Location: /index.php');
?>
