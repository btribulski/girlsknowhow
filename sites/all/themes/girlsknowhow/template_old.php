<?
if (!$title) { $title = ""; }
if (!$keywords) { $keywords = ""; }
if (!$description) { $description = ""; }
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<link rel="stylesheet" href="./includes/default.css" type="text/css" />
<title>
<?=$title?>
</title>
<meta name="keywords" content="<?=$keywords?>" />
<meta name="description" content="<?=$description?>" />
<?=$head?>
<!--[if lt IE 7.]>
		<script type="text/javascript" src="/includes/pngfix.js"></script>
		<style type = "text/css">
		#menuwrapper, #p7menubar ul a {height: 1%;}
		a:active {width: auto;}
		</style>
	<![endif]-->
<script type="text/javascript" src="./includes/dropdown.js"></script>
</head>
<body onload="P7_ExpMenu();">
<?=($hiddenText ? "<div id = \"ht\">$hiddenText</div>" : "")?>
<div id = "main">
  <div id = "header">
    <div id = "headerLeft"><a href = "./index.php" style = "width: 290px; height: 180px; float: left; display: block; margin-top: 18px;"></a></div>
    <div id = "newsFlash">
      <? include_once "./includes/news-flash.php"; ?>
    </div>
    <script type="text/javascript" src="swfobject/swfobject.js"></script>
    <script type="text/javascript">
        //<![CDATA[
            var flashvars = {};
            var params = {
                quality: "high",
                xi: "false",
                wmode: "transparent",
                scale: "default"
            };
            var attributes = {};
            attributes.id = "index";
            swfobject.embedSWF("star_flash.swf", "alternative_content", "223", "234", "8.0.0", false, flashvars, params, attributes);
        //]]>

        </script>
    <div id="container" style = "width: 223px; height: 234px; float: right;">
      <div id="alternative_content">
        <h4>Adobe Flash Player 8 is required to view this content.</h4>
        <p><a href="http://get.adobe.com/flashplayer" onclick="window.open(this.href); return false;"><img src="swfobject/get_flash_player.gif" alt="Download Flash Player" width="112" height="33" /></a><br />
          <a href="http://get.adobe.com/flashplayer" onclick="window.open(this.href); return false;">Click here to download the latest version</a></p>
      </div>
    </div>
    <div class = "clear"></div>
    <div id = "nav">
      <? include_once "./includes/nav.php"; ?>
    </div>
    <div class = "clear"></div>
  </div>
  <div id = "body">
    <!--HEADER END-->
    <!--FOOTER START -->
  </div>
  <div id = "footer">
    <div id = "footerLeft"> <a href = "http://www.nousoma.com" target = "_blank"><img src = "./images/layout/nousoma.png" alt = "Nousoma" border = "0" /></a> <img src = "./images/layout/kids-know-how.png" alt = "" border = "0" /> <br />
      <span>Girls Know How&reg; and Kids Know How&reg; are divisions of NouSoma Communications, Inc.</span> </div>
    <div id = "footerRight"> <a href = "./classroom-corner.php"><img src = "./images/layout/classroom-corner.png" alt = "classroom cornner" border = "0" /></a> </div>
    <div class = "clear"></div>
  </div>
</div>
<div id = "foot">Copyright 2009 NouSoma Communications, Inc.  All rights reserved.</div>
<br />
<div id = "preload"> <img src = "./images/nav_new/about-us-over.png" alt = "" /> <img src = "./images/nav_new/books-over.png" alt = "" /> <img src = "./images/nav_new/activities-over.png" alt = "" /> <img src = "./images/nav_new/news-over.png" alt = "" /> <img src = "./images/nav_new/photos-over.png" alt = "" /> <img src = "./images/nav_new/exploring-careers-over.png" alt = "" /> </div>
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-9627370-1");
pageTracker._trackPageview();
} catch(err) {}</script>
</body>
</html>
