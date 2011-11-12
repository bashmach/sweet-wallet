<?php

class Application_Form_Expense_Edit extends Application_Form_Expense_Add
{
    /**
     * Form initialization
     *
     * @return void
     */
    public function init()
    {
        parent::init();

        $this->setMethod('post');
        $this->setAction('/edit');
        $this->setAttribs(array(
            'name' => 'editForm',
        ));

        $this->addElements(
            array(
                $this->_identifierElement()
            )
        );
    }

    public function _identifierElement()
    {
        $hidden = new Zend_Form_Element_Hidden(
            'identifier',
            array(
                'required' => true
            )
        );
        return $hidden;
    }

}