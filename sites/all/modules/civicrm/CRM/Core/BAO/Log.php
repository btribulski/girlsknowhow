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

/**
 *
 * @package CRM
 * @copyright CiviCRM LLC (c) 2004-2009
 * $Id$
 *
 */

require_once 'CRM/Core/DAO/Log.php';

/**
 * BAO object for crm_log table
 */

class CRM_Core_BAO_Log extends CRM_Core_DAO_Log
{
    static $_processed = null;

    static function &lastModified( $id, $table = 'civicrm_contact' )
    {
        require_once 'CRM/Core/DAO/Log.php';
        
        $log =& new CRM_Core_DAO_Log( );
        
        $log->entity_table = $table;
        $log->entity_id    = $id;
        $log->orderBy( 'modified_date desc' );
        $log->limit( 1 );
        $result = CRM_Core_DAO::$_nullObject;
        if ( $log->find( true ) ) {
            list( $displayName, $contactImage ) = CRM_Contact_BAO_Contact::getDisplayAndImage( $log->modified_id );
            $result = array( 'id'    => $log->modified_id,
                             'name'  => $displayName,
                             'image' => $contactImage,
                             'date'  => $log->modified_date );
        }
        return $result;
    }
    
    /**
     * add log to civicrm_log table
     * 
     * @param array $params  array of name-value pairs of log table.
     * 
     * @static
     */
    static function add( &$params)
    {
        require_once 'CRM/Core/DAO/Log.php';
        
        $log =& new CRM_Core_DAO_Log( );
        $log->copyValues($params);
        $log->save();
    }

    static function register( $contactID,
                              $tableName,
                              $tableID  ,
                              $userID = null ) {
        if ( ! self::$_processed ) {
            self::$_processed = array( );
        }

        if ( ! $userID ) {
            $session =& CRM_Core_Session::singleton( );
            $userID  =  $session->get( 'userID' );
        }

        if ( ! $userID ) {
            $userID  =  $contactID;
        }
        
        if ( ! $userID ) {
            return;
        }

        $log =& new CRM_Core_DAO_Log( );
        $log->id = null;

        if ( isset( self::$_processed[$contactID] ) ) {
            if ( isset( self::$_processed[$contactID][$userID] ) ) {
                $log->id = self::$_processed[$contactID][$userID];
            }
            self::$_processed[$contactID][$userID] = 1;
        } else {
            self::$_processed[$contactID] = array( $userID => 1 );
        }

        $logData = "$tableName,$tableID";
        if ( ! $log->id ) {
            $log->entity_table  = 'civicrm_contact';
            $log->entity_id     = $contactID;
            $log->modified_id   = $userID;
            $log->modified_date = date( "YmdHis" );
            $log->data          = $logData;
            $log->save( );
        } else {
            $query = "
UPDATE civicrm_log
   SET data = concat( data, ':$logData' )
 WHERE id = {$log->id}
";
            CRM_Core_DAO::executeQuery( $query );
        }

        self::$_processed[$contactID][$userID] = $log->id;
    }
}


