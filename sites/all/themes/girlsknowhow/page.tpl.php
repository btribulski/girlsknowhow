<?php
// $Id: page.tpl.php,v 1.14.2.6 2009/02/13 16:28:33 johnalbin Exp $

/**
 * @file page.tpl.php
 *
 * Theme implementation to display a single Drupal page.
 *
 * Available variables:
 *
 * General utility variables:
 * - $base_path: The base URL path of the Drupal installation. At the very
 *   least, this will always default to /.
 * - $css: An array of CSS files for the current page.
 * - $directory: The directory the theme is located in, e.g. themes/garland or
 *   themes/garland/minelli.
 * - $is_front: TRUE if the current page is the front page. Used to toggle the mission statement.
 * - $logged_in: TRUE if the user is registered and signed in.
 * - $is_admin: TRUE if the user has permission to access administration pages.
 *
 * Page metadata:
 * - $language: (object) The language the site is being displayed in.
 *   $language->language contains its textual representation.
 *   $language->dir contains the language direction. It will either be 'ltr' or 'rtl'.
 * - $head_title: A modified version of the page title, for use in the TITLE tag.
 * - $head: Markup for the HEAD section (including meta tags, keyword tags, and
 *   so on).
 * - $styles: Style tags necessary to import all CSS files for the page.
 * - $scripts: Script tags necessary to load the JavaScript files and settings
 *   for the page.
 * - $body_classes: A set of CSS classes for the BODY tag. This contains flags
 *   indicating the current layout (multiple columns, single column), the current
 *   path, whether the user is logged in, and so on.
 * - $body_classes_array: An array of the body classes. This is easier to
 *   manipulate then the string in $body_classes.
 *
 * Site identity:
 * - $front_page: The URL of the front page. Use this instead of $base_path,
 *   when linking to the front page. This includes the language domain or prefix.
 * - $logo: The path to the logo image, as defined in theme configuration.
 * - $site_name: The name of the site, empty when display has been disabled
 *   in theme settings.
 * - $site_slogan: The slogan of the site, empty when display has been disabled
 *   in theme settings.
 * - $mission: The text of the site mission, empty when display has been disabled
 *   in theme settings.
 *
 * Navigation:
 * - $search_box: HTML to display the search box, empty if search has been disabled.
 * - $primary_links (array): An array containing primary navigation links for the
 *   site, if they have been configured.
 * - $secondary_links (array): An array containing secondary navigation links for
 *   the site, if they have been configured.
 *
 * Page content (in order of occurrance in the default page.tpl.php):
 * - $left: The HTML for the left sidebar.
 *
 * - $breadcrumb: The breadcrumb trail for the current page.
 * - $title: The page title, for use in the actual HTML content.
 * - $help: Dynamic help text, mostly for admin pages.
 * - $messages: HTML for status and error messages. Should be displayed prominently.
 * - $tabs: Tabs linking to any sub-pages beneath the current page (e.g., the view
 *   and edit tabs when displaying a node).
 *
 * - $content: The main content of the current Drupal page.
 *
 * - $right: The HTML for the right sidebar.
 *
 * Footer/closing data:
 * - $feed_icons: A string of all feed icons for the current page.
 * - $footer_message: The footer message as defined in the admin settings.
 * - $footer : The footer region.
 * - $closure: Final closing markup from any modules that have altered the page.
 *   This variable should always be output last, after all other dynamic content.
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 */
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language; ?>" lang="<?php print $language->language; ?>" dir="<?php print $language->dir; ?>">
<head>
<title><?php print $head_title; ?></title>
<?php print $head; ?><?php print $styles; ?><?php print $scripts; ?>
</head>
<body class="<?php print $body_classes; ?>">
<div id="page">
  <div id="page-inner">
    <div id="header">
      <div id="header-inner" class="clear-block">
        <div id = "headerLeft"><a href = "/" style="float: left; display: block; margin-top: 18px;"> <img src="/images/clear.gif" width="490" height="180" border="0"></a></div>
        <?php if ($newsticker): ?>
        <div id = "newsticker"> <?php print $newsticker; ?> </div>
        <?php endif; ?>
        <div id = "classroom-corner"> <a href = "/classroom-corner"><img src = "/images/clear.gif" alt = "classroom cornner" width="200" height="150" border = "0" /></a> </div>
        <div class = "clear"></div>
      </div>
    </div>
  </div>
  <!-- /#header-inner, /#header -->
  <div id="main">
    <div id="main-inner" class="clear-block<?php if ($search_box || $primary_links || $secondary_links || $navbar) { print ' with-navbar'; } ?>">
      <div id="content">
        <div id="content-inner">
          <?php if ($mission): ?>
          <div id="mission"><?php print $mission; ?></div>
          <?php endif; ?>
          <?php if ($content_top): ?>
          <div id="content-top" class="region region-content_top"> <?php print $content_top; ?> </div>
          <!-- /#content-top -->
          <?php endif; ?>
          <?php if ($breadcrumb || $title || $tabs || $help || $messages): ?>
          <div id="content-header">
            <?php //print $breadcrumb; ?>
            <?php if ($title): ?>
            <h1 class="title"><?php print $title; ?></h1>
            <?php endif; ?>
            <?php print $messages; ?>
            <?php if ($tabs): ?>
            <div class="tabs"><?php print $tabs; ?></div>
            <?php endif; ?>
            <?php print $help; ?> </div>
          <!-- /#content-header -->
          <?php endif; ?>
          <div id="content-area"> <?php print $content; ?> </div>
          <?php if ($feed_icons): ?>
          <div class="feed-icons"><?php print $feed_icons; ?></div>
          <?php endif; ?>
          <?php if ($content_bottom): ?>
          <div id="content-bottom" class="region region-content_bottom"> <?php print $content_bottom; ?> </div>
          <!-- /#content-bottom -->
          <?php endif; ?>
        </div>
      </div>
      <!-- /#content-inner, /#content -->
      
      <?php if ($search_box): ?>
      <div id="search-box"> <?php print $search_box; ?> </div>
      <!-- /#search-box -->
      <?php endif; ?>
      <?php if ($left): ?>
      <div id="sidebar-left">
        <div id="sidebar-left-inner" class="region region-left"> <?php print $left; ?> </div>
      </div>
      <!-- /#sidebar-left-inner, /#sidebar-left -->
      <?php endif; ?>
      <?php if ($right): ?>
      <div id="sidebar-right">
        <div id="sidebar-right-inner" class="region region-right"> <?php print $right; ?> </div>
      </div>
      <!-- /#sidebar-right-inner, /#sidebar-right -->
      <?php endif; ?>
      <?php if ($navbar): ?>
      <div id="navbar">
        <div id="navbar-inner" class="clear-block region region-navbar"> <a name="navigation" id="navigation"></a> <?php print $navbar; ?> </div>
      </div>
      <!-- /#navbar-inner, /#navbar -->
      <?php endif; ?>
    </div>
  </div>
  <!-- /#main-inner, /#main -->
  <?php if ($footer || $footer_message): ?>
  <div id="footer">
    <div id="footer-inner" class="region region-footer">
      <div id = "footerLeft"> 
      <span style="display:inline">
      <a href = "http://www.nousoma.com" target = "_blank"><img src = "/images/layout/nousoma-communications-logo.png" alt = "Nousoma" border = "0" /></a>
      <a href="https://www.facebook.com/GirlsKnowHow"><img src="/sites/all/themes/girlsknowhow/images/facebook-icon.png" /></a>
      <a href="https://twitter.com/AskGirlsKnowHow"><img src="/sites/all/themes/girlsknowhow/images/twitter-icon.png" /></a>
      <a href="http://www.pinterest.com/gkhbooks/"><img src="/sites/all/themes/girlsknowhow/images/pinterest-icon.png" /></a>
      
      </span><br />
        <span>Girls Know How&reg; and Kids Know How&reg; are divisions of NouSoma Communications, Inc.</span><br />
        <span>Copyright &copy; 2015 NouSoma Communications, Inc. All rights reserved.</span>
        
      </div>
      <div id = "footerRight"> 
        <script type="text/javascript" src="/swfobject/swfobject.js"></script> 
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
            swfobject.embedSWF("/images/star_flash_2011.swf", "alternative_content", "223", "234", "8.0.0", false, flashvars, params, attributes);
        //]]>

        </script>
        <div id="container" style = "width: 223px; height: 234px; float: right;">
          <div id="alternative_content">
            <h4>Adobe Flash Player 8 is required to view this content.</h4>
            <p><a href="http://get.adobe.com/flashplayer" onclick="window.open(this.href); return false;"><img src="swfobject/get_flash_player.gif" alt="Download Flash Player" width="112" height="33" /></a><br />
              <a href="http://get.adobe.com/flashplayer" onclick="window.open(this.href); return false;">Click here to download the latest version</a></p>
          </div>
        </div>
      </div>
      
    </div>
    <!-- /#footer-inner, /#footer -->
    <?php endif; ?>
  </div>
</div>
<!-- /#page-inner, /#page -->
<?php if ($closure_region): ?>
<div id="closure-blocks" class="region region-closure"><?php print $closure_region; ?></div>
<?php endif; ?>
<?php print $closure; ?>
</body>
</html>
