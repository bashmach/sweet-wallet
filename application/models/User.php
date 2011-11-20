<?php

class Application_Model_User extends Application_Model_Abstract
{
    protected $_dbTableClassName = 'Application_Model_DbTable_User';
    
    /**
     * Calculates the MD5 hash from the string and salt
     *
     * @param string $password
     * @return string
     */
    static public function generatePassword($password)
    {
        $config = Zend_Registry::get('Config');

        return md5($password . $config['salt']);
    }
    
    /**
     * Login user
     *
     * @param string $email
     * @param string $password
     * @return type 
     */
    public function login($email, $password)
    {
        $authAdapter = new Zend_Auth_Adapter_DbTable(
            Zend_Db_Table::getDefaultAdapter(),
            'user',
            'email',
            'password',
            '?'
        );
        // set the input credential values to authenticate against
        $authAdapter->setIdentity($email);
        $authAdapter->setCredential(self::generatePassword($password));

        // do the authentication
        $auth = Zend_Auth::getInstance();
        $result = $auth->authenticate($authAdapter);

        if ($result->isValid()) {
            if (!Zend_Session::isStarted()) {
                Zend_Session::rememberMe(7200);
            }
            // success: store database row to auth's storage system
            $authData = $authAdapter->getResultRowObject(
                null,
                array('password')
            );
            $auth->getStorage()->write($authData);
        }

        return $result->getCode();
    }

    /**
     * Logout user
     *
     * @author Pavel Machekhin
     */
    public function logout()
    {
        return Zend_Auth::getInstance()->clearIdentity();
    }
}