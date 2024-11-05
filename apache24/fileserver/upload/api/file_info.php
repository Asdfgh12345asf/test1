<?php

require_once('../classes/fileupload.php');
require_once('../settings/dbconfig.php');
require_once('../settings/pathconfig.php');

$file = $_REQUEST['file'];
$dir = $_REQUEST['dir'];
$token = $_REQUEST['token'];

$file = preg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $file);
$file = preg_replace("([\.]{2,})", '', $file);

$path = $dir . "/" . $file;

if(isset($_REQUEST['token']))
{
    $dbh = new DBHandle();
    $dbh->init($config_db_conn);
    $res = $dbh->do_query("SELECT value FROM conf WHERE param = 'app_token'");
    if($res->num_rows !== 0)
    {
        $row = $res->fetch_assoc();
        if($_REQUEST['token'] === $row['value']) 
        {
            if(file_exists($path))
            {
                $stat = stat($path);
                $response = array(
                    'owner_uid' => $stat['uid'],
                    'owner_gid' => $stat['gid'],
                    'size'      => $stat['size'],
                    'atime'     => $stat['atime'],
                    'mtime'     => $stat['mtime'],
                    'ctime'     => $stat['ctime'],
                    'md5sum'    => md5_file($path)
                );
                echo json_encode($response);
            }
        }
    }
    $dbh->close();
}

?>
