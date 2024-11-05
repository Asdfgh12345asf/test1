<?php

require_once('init.php');
require_once('classes/fileupload.php');
require_once('settings/pathconfig.php');
require_once('settings/dbconfig.php');

if(isset($_REQUEST['submit']))
{
    $fileupload->upload_file($_FILES["fileToUpload"]);
}

header('Location: /index.php');
?>
