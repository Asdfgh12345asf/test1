<?php

require_once('multidb.php');

class FileUpload
{
    private $db_handles;
    private $tmp_path;
    private $approved_path;

    public function __construct($tmp_path, $approved_path, $tmp_db_conn,
                                $approved_db_conn, $config_db_conn, $enc_key, $enc_alg)
    {
        $this->tmp_path = $tmp_path;
        $this->approved_path = $approved_path;
        $this->db_handles = new MultiDBHandle(array($tmp_db_conn, $approved_db_conn, $config_db_conn));
        $this->db_handles->config()->set_auto_shutdown();
        $this->enc['key'] = $enc_key;
        $this->enc['alg'] = $enc_alg;
    }

    public function tmp_db()
    {
        return $this->db_handles->handle(0);
    }

    public function approved_db()
    {
        return $this->db_handles->handle(1);
    }

    public function config_db()
    {
        return $this->db_handles->handle(2);
    }

    public function tmp_path()
    {
        return $this->tmp_path;
    }

    public function approved_path()
    {
        return $this->approved_path;
    }

    public function dump_dbinfo()
    {
        $out = "";
        foreach($this->db_handles as $dbh)
        {
            $out .= var_dump($dbh);
        }
        return $out;
    }

    public function get_temp_files()
    {
        return $this->tmp_db()->do_query("SELECT * FROM files");    
    }

    public function upload_file($file)
    {
        $target_file = $this->tmp_path . "/" . basename($file["name"]);
        $token = $this->get_app_token();

        if(move_uploaded_file($file["tmp_name"], $target_file))
        {
            // Get md5sum from file_info API
            $url = "http://127.0.0.1:8080/api/file_info.php?token=" . $token .
                   "&dir=" . $this->tmp_path .
                   "&file=" . basename($file["name"]);

            $contents = file_get_contents($url);
            $md5 = (json_decode($contents))->{'md5sum'};

            $this->tmp_db()->do_query("INSERT INTO files (path, md5) VALUES ('" .
                                      $target_file . "','" . $md5 . "')");
        }
    }

    public function approve($filename, $md5)
    {
        $srcpath = $this->tmp_path . "/" . $filename;
        $dstpath = $this->approved_path . "/" . $filename;

        $tmp_handle = $this->db_handles->get_mysqli_handle($this->tmp_db());
        $app_handle = $this->db_handles->get_mysqli_handle($this->approved_db());
        $tmp_stmt = $tmp_handle->prepare("SELECT * FROM files WHERE path = ?"); 
        $tmp_stmt->bind_param("s", $srcpath);
        $tmp_stmt->execute();

        $result = $tmp_stmt->get_result();
        if($result->num_rows !== 0)
        {
            $row = $result->fetch_assoc();
            if($md5 === $row['md5'])
            {
                $data = "";
                if(file_exists($srcpath))
                {
                    //$data = file_get_contents($srcpath);
                    $data = $this->encrypt($srcpath);
                }

                if(file_put_contents($dstpath, $data)) 
                {
                    unlink($srcpath);
                    $app_stmt = $app_handle->prepare("INSERT INTO files (path, md5) VALUES (?, ?)");
                    $app_stmt->bind_param("ss", $dstpath, $row['md5']);
                    $app_stmt->execute();
                    $app_stmt->close();

                    $tmp_stmt->close();
                    $tmp_stmt = $tmp_handle->prepare("DELETE FROM files WHERE path = ?");
                    $tmp_stmt->bind_param("s", $srcpath);
                    $tmp_stmt->execute();
                }
            }
        }
        $tmp_stmt->close();
    }

    public function get_admin_key()
    {
        $res = $this->config_db()->do_query("SELECT value FROM conf WHERE param = 'admin_key'");
        if($res->num_rows !== 0)
        {
            $row = $res->fetch_assoc();
            return $row['value'];
        }
        else return "NOT SET";
    }

    public function get_app_token()
    {
        $res = $this->config_db()->do_query("SELECT value FROM conf WHERE param = 'app_token'");
        if($res->num_rows !== 0)
        {
            $row = $res->fetch_assoc();
            return $row['value'];
        }
        else return "NOT SET";
    }

    private function encrypt($file)
    {
        if(file_exists($file))
        {
            $data = file_get_contents($file);
            $encrypted = openssl_encrypt($data, $this->enc['alg'], $this->enc['key']);
        }
        return $encrypted;
    }
}

?>
