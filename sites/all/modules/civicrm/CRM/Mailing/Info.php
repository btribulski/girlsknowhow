<?php

/*
 +--------------------------------------------------------------------+
 | CiviCRM version 2.2                                                |
 +--------------------------------------------------------------------+
 | Copyright CiviCRM LLC (c) 2004-2009                                |
 +--------------------------------------------------------------------+
 | This file is a part of CiviCRM.                                    |
 |                                                                    |
 | CiviCRM is free software; you can copy, modify, and distribute it  |
 | under the terms of the GNU Affero General Public License           |
 | Version 3, 19 November 2007.                                       |
 |                                                                    |
 | CiviCRM is distributed in the hope that it will be useful, but     |
 | WITHOUT ANY WARRANTY; without even the implied warranty of         |
 | MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.               |
 | See the GNU Affero General Public License for more details.        |
 |                                                                    |
 | You should have received a copy of the GNU Affero General Public   |
 | License along with this program; if not, contact CiviCRM LLC       |
 | at info[AT]civicrm[DOT]org. If you have questions about the        |
 | GNU Affero General Public License or the licensing of CiviCRM,     |
 | see the CiviCRM license FAQ at http://civicrm.org/licensing        |
 +--------------------------------------------------------------------+
*/

require_once 'CRM/Core/Component/Info.php';

/**
 * This class introduces component to the system and provides all the 
 * information about it. It needs to extend CRM_Core_Component_Info
 * abstract class.
 *
 * @package CRM
 * @copyright CiviCRM LLC (c) 2004-2009
 * $Id$
 *
 */
class CRM_Mailing_Info extends CRM_Core_Component_Info
{

    // docs inherited from interface
    protected $keyword = 'mailing';
        

    // docs inherited from interface
    public function getInfo()
    {
        return array( 'name'                 => 'CiviMail',
                      'translatedName'       => ts('CiviMail'),
                      'title'                => 'CiviCRM Mailing Engine',
                      'search'               => 0,
                      'showActivitiesInCore' => 1 
                      );
    }


    // docs inherited from interface
    public function getPermissions()
    {
        return array( 'access CiviMail', 
                      'access CiviMail subscribe/unsubscribe pages' );
    }


    // docs inherited from interface
    public function getUserDashboardElement()
    {
        // no dashboard element for this component
        return null;
    }

    public function getUserDashboardObject( )
    {
        // no dashboard element for this component
        return null;
    }
    
    // docs inherited from interface  
    public function registerTab()
    {
        // this component doesn't use contact record tabs
        return null;
    }
    
    // docs inherited from interface  
    public function registerAdvancedSearchPane()
    {
        // this component doesn't use advanced search
        return null;
    }    
    
    // docs inherited from interface    
    public function getActivityTypes()
    {
        return null;
    }
    
}
