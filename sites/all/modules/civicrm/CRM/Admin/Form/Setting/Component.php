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

require_once 'CRM/Admin/Form/Setting.php';

/**
 * This class generates form components for Component 
 */
class CRM_Admin_Form_Setting_Component extends  CRM_Admin_Form_Setting
{
    protected $_components;

    /**
     * Function to build the form
     *
     * @return None
     * @access public
     */
    public function buildQuickForm( ) 
    {
        CRM_Utils_System::setTitle(ts('Settings - Enable Components'));

        $components = $this->_getComponentSelectValues( );

        $include =& $this->addElement('advmultiselect', 'enableComponents', 
                                      ts('Components') . ' ', $components,
                                      array('size' => 5, 
                                            'style' => 'width:150px',
                                            'class' => 'advmultiselect')
                                      );
        
        $include->setButtonAttributes('add', array('value' => ts('Enable >>')));
        $include->setButtonAttributes('remove', array('value' => ts('<< Disable')));     
        
        $this->addFormRule( array( 'CRM_Admin_Form_Setting_Component', 'formRule' ), $this );

        parent::buildQuickForm();
    }

    /**  
     * global form rule  
     *  
     * @param array $fields  the input form values  
     * @param array $files   the uploaded files if any  
     * @param array $options additional user data  
     *  
     * @return true if no errors, else array of errors  
     * @access public  
     * @static  
     */  
    static function formRule( &$fields ) 
    {  
        $errors = array( ); 
        
        if ( is_array( $fields['enableComponents'] ) ) {
            if ( in_array( 'CiviPledge', $fields['enableComponents'] ) && !in_array( 'CiviContribute', $fields['enableComponents'] ) ) {
                $errors['enableComponents'] = ts('You need to enable CiviContribute before enabling CiviPledge.');
            }
        }

        return $errors;
    }


    private function _getComponentSelectValues( ) 
    {
        $ret = array();
        require_once 'CRM/Core/Component.php';
        $this->_components = CRM_Core_Component::getComponents();
        foreach( $this->_components as $name => $object ) {
            $ret[$name] = $object->info['translatedName'];
        }

        return $ret;
    }

    public function postProcess( ) {
        $params = $this->controller->exportValues($this->_name);


        $params['enableComponentIDs'] = array( );
        foreach ( $params['enableComponents'] as $name ) {
            $params['enableComponentIDs'][] = $this->_components[$name]->componentID;
        }

        parent::commonProcess( $params );
    }

}


