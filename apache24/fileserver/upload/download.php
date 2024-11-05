<?php

require_once('init.php');
require_once('classes/fileupload.php');
require_once('settings/pathconfig.php');

if(isset($_POST['submit']) && isset($_POST['file']))
{
    $path = $fileupload->tmp_path() . "/" . basename($_POST['file']);

    if (file_exists($path))
    {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="'.basename($path).'"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($path));
        readfile($path);
        exit;
    }
}
?>
