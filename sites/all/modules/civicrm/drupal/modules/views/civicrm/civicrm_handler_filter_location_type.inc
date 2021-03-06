<?php
/*
 * Heavily based on anonymous code contribution. No claim.
 * CiviCRM Views Integration
 *
 * civicrm_handler_filter_location_type.inc
 * Filters Location Types, and is configured using the labels from the database
 *
 */


class civicrm_handler_filter_location_type extends views_handler_filter_in_operator {
    static $_locationTypes;

    function construct( ) {
        parent::construct();
        if ( ! self::$_locationTypes ) {
            civicrm_initialize( );
            require_once 'CRM/Core/PseudoConstant.php';
            self::$_locationTypes = CRM_Core_PseudoConstant::locationType( );
        }
    }

    function get_value_options() {
        if (!isset($this->value_options)) {
            $this->value_title = t('Location type');
            $options = array( );
            foreach (self::$_locationTypes as $id => $name ) {
                $options[$id] = $name;
            }
            $this->value_options = $options;
        }
    }

}
?>