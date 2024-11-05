<?php
require_once('classes/fileupload.php');
require_once('settings/dbconfig.php');
require_once('settings/pathconfig.php');
require_once('settings/cryptoconfig.php');

$fileupload = new FileUpload($tmp_path, $approved_path, $tmp_db_conn,
                             $approved_db_conn, $config_db_conn,
                             $enc_key, $enc_alg);
?>
