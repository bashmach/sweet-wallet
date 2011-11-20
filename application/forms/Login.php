<?php

class Application_Form_Login extends Zend_Form
{

    /**
     * Form initialization
     *
     * @return void
     * @author Pavel Machekhin
     */
    public function init()
    {
        /**
         * Set the form name and action.
         */
        $this->setName('loginForm');
        $this->setAction('/login');

        // Initialize `email` form element.
        $email = new Zend_Form_Element_Text(
            'email',
            array(
                'label' => 'Email',
                'required' => true,
                'filters' => array(
                    'StripTags',
                    'StringTrim'
                ),
                'value' => null
            )
        );

        // Initialize `password` form element.
        $password = new Zend_Form_Element_Password(
            'password',
            array(
                'label' => 'Password',
                'required' => true
            )
        );

        // Initialize `hash` form element.
        $next = new Zend_Form_Element_Hidden('next');

        // Initialize `submit` form element.
        $submit = new Zend_Form_Element_Submit(
            'submit',
            array(
                'class' => 'bp bb',
                'label' => 'Sign In'
            )
        );

        // Remove DtDd decorator.
        $submit->removeDecorator('DtDdWrapper');

        // Add elements to the form.
        $this->addElements(array($email, $password, $submit, $next));

        return $this;
    }
}