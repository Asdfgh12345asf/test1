<?php
if(!isset($_SERVER['HTTP_USER_AGENT']) || ($_SERVER['HTTP_USER_AGENT'] !== 'Internal FileServer Browser'))
{
  die("Access denied.");
}
else
{
  echo "Welcome to the HTTP FileServer.\n\n";
  echo "Available files:\n";

  $path = '.';
  $dir = new DirectoryIterator(dirname($path));
  foreach ($dir as $fileinfo)
  {
    if(!$fileinfo->isDot())
    {
      $fname = $fileinfo->getFilename();
      if(isset($fname) && $fname[0] !== '.' && $fname[0] !== '~' && $fname !== 'index.php')
      {
        echo $fileinfo->getFilename() . "\n";
      }
    }
  }
}
?>
