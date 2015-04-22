<?php
// $Id: template.php,v 1.17.2.1 2009/02/13 06:47:44 johnalbin Exp $

/**
 * @file
 * Contains theme override functions and preprocess functions for the theme.
 *
 * ABOUT THE TEMPLATE.PHP FILE
 *
 *   The template.php file is one of the most useful files when creating or
 *   modifying Drupal themes. You can add new regions for block content, modify
 *   or override Drupal's theme functions, intercept or make additional
 *   variables available to your theme, and create custom PHP logic. For more
 *   information, please visit the Theme Developer's Guide on Drupal.org:
 *   http://drupal.org/theme-guide
 *
 * OVERRIDING THEME FUNCTIONS
 *
 *   The Drupal theme system uses special theme functions to generate HTML
 *   output automatically. Often we wish to customize this HTML output. To do
 *   this, we have to override the theme function. You have to first find the
 *   theme function that generates the output, and then "catch" it and modify it
 *   here. The easiest way to do it is to copy the original function in its
 *   entirety and paste it here, changing the prefix from theme_ to girlsknowhow_.
 *   For example:
 *
 *     original: theme_breadcrumb()
 *     theme override: girlsknowhow_breadcrumb()
 *
 *   where girlsknowhow is the name of your sub-theme. For example, the
 *   zen_classic theme would define a zen_classic_breadcrumb() function.
 *
 *   If you would like to override any of the theme functions used in Zen core,
 *   you should first look at how Zen core implements those functions:
 *     theme_breadcrumbs()      in zen/template.php
 *     theme_menu_item_link()   in zen/template.php
 *     theme_menu_local_tasks() in zen/template.php
 *
 *   For more information, please visit the Theme Developer's Guide on
 *   Drupal.org: http://drupal.org/node/173880
 *
 * CREATE OR MODIFY VARIABLES FOR YOUR THEME
 *
 *   Each tpl.php template file has several variables which hold various pieces
 *   of content. You can modify those variables (or add new ones) before they
 *   are used in the template files by using preprocess functions.
 *
 *   This makes THEME_preprocess_HOOK() functions the most powerful functions
 *   available to themers.
 *
 *   It works by having one preprocess function for each template file or its
 *   derivatives (called template suggestions). For example:
 *     THEME_preprocess_page    alters the variables for page.tpl.php
 *     THEME_preprocess_node    alters the variables for node.tpl.php or
 *                              for node-forum.tpl.php
 *     THEME_preprocess_comment alters the variables for comment.tpl.php
 *     THEME_preprocess_block   alters the variables for block.tpl.php
 *
 *   For more information on preprocess functions and template suggestions,
 *   please visit the Theme Developer's Guide on Drupal.org:
 *   http://drupal.org/node/223440
 *   and http://drupal.org/node/190815#template-suggestions
 */


/*
 * Add any conditional stylesheets you will need for this sub-theme.
 *
 * To add stylesheets that ALWAYS need to be included, you should add them to
 * your .info file instead. Only use this section if you are including
 * stylesheets based on certain conditions.
 */
/* -- Delete this line if you want to use and modify this code
// Example: optionally add a fixed width CSS file.
if (theme_get_setting('girlsknowhow_fixed')) {
  drupal_add_css(path_to_theme() . '/layout-fixed.css', 'theme', 'all');
}
// */


/**
 * Implementation of HOOK_theme().
 */
function girlsknowhow_theme(&$existing, $type, $theme, $path) {
  $hooks = zen_theme($existing, $type, $theme, $path);
  // Add your theme hooks like this:
  /*
  $hooks['hook_name_here'] = array( // Details go here );
  */
  // @TODO: Needs detailed comments. Patches welcome!
  return $hooks;
}

/**
 * Override or insert variables into all templates.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered (name of the .tpl.php file.)
 */
/* -- Delete this line if you want to use this function
function girlsknowhow_preprocess(&$vars, $hook) {
  $vars['sample_variable'] = t('Lorem ipsum.');
}
// */

/**
 * Override or insert variables into the page templates.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("page" in this case.)
 */
/* -- Delete this line if you want to use this function
function girlsknowhow_preprocess_page(&$vars, $hook) {
  $vars['sample_variable'] = t('Lorem ipsum.');
}
// */

/**
 * Override or insert variables into the node templates.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("node" in this case.)
 */

function girlsknowhow_preprocess_node(&$vars, $hook) {
  $vars['sample_variable'] = t('Lorem ipsum.');
  global $node;
  if (isset($node->field_newsstory_image[0])){
  	$vars['story_mainimage']  = $node->field_newsstory_image[0]['view']; 
  }
}

/**
 * Override or insert variables into the comment templates.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("comment" in this case.)
 */
/* -- Delete this line if you want to use this function
function girlsknowhow_preprocess_comment(&$vars, $hook) {
  $vars['sample_variable'] = t('Lorem ipsum.');
}
// */

/**
 * Override or insert variables into the block templates.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("block" in this case.)
 */
/* -- Delete this line if you want to use this function
function girlsknowhow_preprocess_block(&$vars, $hook) {
  $vars['sample_variable'] = t('Lorem ipsum.');
}
// */
function tabbed_blocks ($display_region = 'tab_region', $form_name = 'test1'){
	//NOTE: This function relies on the jstools module with tabs enabled
	$this_block = array();
	$form = array();
	$counter=0;
	
	$form[$form_name] = array(
		'#type' => 'tabset',
	  );
				
	foreach(block_list($display_region) as $this_block){
		$tabnumber = 'tab'.$counter;
		foreach ($this_block as $key=>$value){
			if($key=='subject') $title= $value;
			if($key=='content') $content= $value;
			
		}
		$form[$form_name][$tabnumber] = array(
			'#type' => 'tabpage',
			'#title' => t($title),
			'#content' => $content,
		);
		$counter++;
	}
	return tabs_render($form);
}
/**
 * Return rendered tabset.
 *
 * @themable
 * 02-18-2009 B. Tribulski  - Changed so tabsets match rest of site 
 * Added <span class="tab"></span> to $output
 */
function girlsknowhow_tabset($element) {
  $output = '<div id="tabs-'. $element['#tabset_name'] .'"'. drupal_attributes($element['#attributes']) .'>';
  $output .= '<ul>';
  foreach (element_children($element) as $key) {
    if ($element[$key]['#type'] && $element[$key]['#type'] == 'tabpage') {
      $output .= '<li'. drupal_attributes($element[$key]['#attributes']) .'><a href="#tabs-'. $element['#tabset_name'] .'-'. $element[$key]['#index'] .'"><span class="tab">'. $element[$key]['#title'] .'</span></a></li>';
    }
  }
  $output .= '</ul>';
  $output .= $element['#children'];
  $output .= '</div>';
  return $output;
}
/**
 *Adds custom icon to calendar
 *
 */
function girlsknowhow_calendar_ical_icon($url) {
	if ($image = theme('image', drupal_get_path('module', 'date_api') .'/images/ical16x16.gif', t('Add to calendar'), t('Add to calendar'))) {
		return '<div id="ical-link" style="text-align:right"><a href="'. check_url($url) .'">'.t('Add to calendar') .'</a> <a href="'. check_url($url) .'" class="ical-icon" title="ical">'. $image .'</a></div>';
	}
}
function girlsknowhow_terms_of_use($terms, $node) {
  $output  = '<div id="terms-of-use" class="content clear-block">';
  $output .= t('The terms of use are available !here.', array('!here' => l('here', 'node/'."$node->nid")));
  $output .= '</div>';
  return $output;
}
/*
 * function to render the thumbnail_url field into HTML
 */
function girlsknowhow_node_kaltura_entry_thumbnail_url($node, $teaser, $nosize = FALSE, $size = array()) {
  $skip = FALSE;
  if (isset($size['width']) && isset($size['height'])) {
    $width = $size['width'];
    $height = $size['height'];
    $skip = TRUE;
  }
  if ($node->kaltura_media_type == 1 && !$skip) {
  	$width = variable_get('kaltura_video_entry_thumb_width', '120');
    $height = variable_get('kaltura_video_entry_thumb_height', '90');
  }
  elseif (!$skip) {
    $width = variable_get('kaltura_image_entry_thumb_width', '120');
    $height = variable_get('kaltura_image_entry_thumb_height', '90');
  }
  if ($node->kaltura_media_type == 1 && $node->kstatus == 2 && variable_get('kaltura_entry_rotate_thumb', 1) == 1) {
    $extra = 'onmouseover="KalturaThumbRotator.start(this)" onmouseout="KalturaThumbRotator.end(this)"';
  }
  $size_str = '';
  if ($nosize == FALSE) {
    $size_str = '/width/'. $width .'/height/'. $height;
  }
  if ($node->link_thumb || $teaser) {
    return '<div class="kaltura_thumb"><a href="'. url('node/'. $node->nid) .'"><img src="'. $node->kaltura_thumbnail_url . $size_str .'" '. $extra .' /></a></div>';
  }
  elseif (!$node->content){ 
	return '<div class="kaltura_thumb"><img src="'. $node->kaltura_thumbnail_url . $size_str .'" '. $extra .' /></div>';
  }	
}
function girlsknowhow_button($element){
	// Make sure not to overwrite classes.
	$element['#attributes']['class'] .= ' form-'. $element['#button_type'];
	 
	return '<input type="'.(isset($element['#button_type']) ? $element['#button_type'] : "submit").'" '. (empty($element['#name']) ? '' : 'name="'. $element['#name'] .'" ')  .'id="'. $element['#id'].'" value="'. check_plain($element['#value']) .'" '. drupal_attributes($element['#attributes']) ." />\n";
}