<?php
/**
 * Include file that can be used for a quick setup of the eZ Components.
 *
 * @copyright Copyright (C) 2005-2008 eZ systems as. All rights reserved.
 * @license http://ez.no/licenses/new_bsd New BSD License
 * @version 1.6
 * @filesource
 * @package Base
 * @access private
 */
$dir = dirname( __FILE__ );
$dirParts = explode( DIRECTORY_SEPARATOR, $dir );

if ( $dirParts[count( $dirParts ) - 1] === 'src' )
{
    $baseDir = join( DIRECTORY_SEPARATOR, array_slice( $dirParts, 0, -2 ) );
    require $baseDir . '/Base/src/base.php'; // svn, bundle
}
else if ( $dirParts[count( $dirParts ) - 2] === 'ezc' )
{
    $baseDir = join( DIRECTORY_SEPARATOR, array_slice( $dirParts, 0, -2 ) );
    require $baseDir . '/ezc/Base/base.php'; // pear
}
else
{
    die( "Your environment isn't properly set-up. Please refer to the eZ components documentation at http://components.ez.no/doc ." );
}

// Joomla, libraries/loader.php, already defined __autoload
if ( !function_exists("__autoload") ) {
/**
 * Implements the __autoload mechanism for PHP - which can only be done once
 * per request.
 *
 * @param string $className  The name of the class that should be loaded.
 */
    function __autoload( $className )
    {
        ezcBase::autoload( $className );
    }
 }
?>
