<?php
require_once('init.php');
?>
<!DOCTYPE html>
<html lang="en">
<title>FileServer Admin</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../css/w3.css">
<link rel="stylesheet" href="../css/w3-theme-black.css">
<style>
html,body,h1,h2,h3,h4,h5,h6 {font-family: "Roboto", sans-serif;}
.w3-sidebar {
  z-index: 3;
  width: 250px;
  top: 43px;
  bottom: 0;
  height: inherit;
}
</style>
<body>

<!-- Navbar -->
<div class="w3-top">
  <div class="w3-bar w3-theme w3-top w3-left-align w3-large">
    <a class="w3-bar-item w3-button w3-right w3-hide-large w3-hover-white w3-large w3-theme-l1" href="javascript:void(0)" onclick="w3_open()"><i class="fa fa-bars"></i></a>
    <a href="#" class="w3-bar-item w3-button w3-theme-l1">FileServer Admin</a>
    <a href="#" class="w3-bar-item w3-button w3-hide-small w3-hover-white">Uploaded files</a>
    <a href="#" class="w3-bar-item w3-button w3-hide-small w3-hover-white">Configuration</a>
    <a href="#" class="w3-bar-item w3-button w3-hide-small w3-hover-white">Update client</a>
  </div>
</div>

<!-- Sidebar -->
<nav class="w3-sidebar w3-bar-block w3-collapse w3-large w3-theme-l5 w3-animate-left" id="mySidebar">
  <a href="javascript:void(0)" onclick="w3_close()" class="w3-right w3-xlarge w3-padding-large w3-hover-black w3-hide-large" title="Close Menu">
    <i class="fa fa-remove"></i>
  </a>
  <h4 class="w3-bar-item"><b>Menu</b></h4>
  <a class="w3-bar-item w3-button w3-hover-black" href="#">Dashboard</a>
  <a class="w3-bar-item w3-button w3-hover-black" href="#">Uploaded files</a>
  <a class="w3-bar-item w3-button w3-hover-black" href="#">Configuration</a>
  <a class="w3-bar-item w3-button w3-hover-black" href="#">Update client</a>
</nav>

<!-- Overlay effect when opening sidebar on small screens -->
<div class="w3-overlay w3-hide-large" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>

<!-- Main content: shift it to the right by 250 pixels when the sidebar is visible -->
<div class="w3-main" style="margin-left:250px">
  <div class="w3-row w3-padding-64">
    <div class="w3-twothird w3-container">
<?php
$admin_key = $fileupload->get_admin_key();

if(!isset($_REQUEST['admin_key']) || (strcmp($_REQUEST['admin_key'], $admin_key) != 0))
{
    echo "<div class='w3-container'><h4>Unauthorized.</h4></div>";
    exit;
}
?>
      <h1 class="w3-text-teal">Dashboard</h1>
      <div class="w3-container">
        <h3>Uploaded files waiting for approval</h3>
        <table class="w3-table-all w3-hoverable">
          <thead>
            <tr class="w3-light-grey">
              <th>File Path</th>
              <th>MD5 checksum</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <?php
              $res = $fileupload->get_temp_files();
              if($res->num_rows !== 0)
              {
                while($row = $res->fetch_assoc())
                {
                  $fname = str_replace($fileupload->tmp_path() . "/", "", $row['path']);
                  echo "<tr><td>" . $fname . "</td><td>" . $row['md5'] . "</td>" .
                       "<td><form method='post' action='download.php'>" .
                       "<input type='hidden' name='file' value='" . $fname . "'>" .
                       "<input type='hidden' name='submit' value='download'>" .
                       "<input type='submit' value='Download'></form></td>" .
                       "<td><form method='post' action='approve.php'>" .
                       "<input type='hidden' name='file' value='" . $fname . "'>" .
                       "<input type='hidden' name='submit' value='approve'>" .
                       "<input type='hidden' name='admin_key' value=" . $admin_key . ">" .
                       "<input type='submit' value='Approve'></form></td></tr>";
                }
              }
            ?>
          </tbody>  
        </table>
      </div>
    </div>

    <div class="w3-third w3-container">
    </div>
  </div>

  <!-- Pagination -->
  <div class="w3-center w3-padding-32">
    <div class="w3-bar">
      <a class="w3-button w3-black" href="#">1</a>
      <a class="w3-button w3-hover-black" href="#">2</a>
      <a class="w3-button w3-hover-black" href="#">3</a>
      <a class="w3-button w3-hover-black" href="#">4</a>
      <a class="w3-button w3-hover-black" href="#">5</a>
      <a class="w3-button w3-hover-black" href="#">»</a>
    </div>
  </div>

  <footer id="myFooter">
    <div class="w3-container w3-theme-l2 w3-padding-11">
      <h4>FileServer Upload</h4>
    </div>

    <div class="w3-container w3-theme-l1">
      <p>Powered by <a href="https://www.w3schools.com/w3css/default.asp" target="_blank">w3.css</a></p>
    </div>
  </footer>

<!-- END MAIN -->
</div>

<script>
// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = "none";
  } else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = "block";
  }
}

// Close the sidebar with the close button
function w3_close() {
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
}
</script>

</body>
</html>

