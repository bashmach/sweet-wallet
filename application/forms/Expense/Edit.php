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
                $this->_commentElement(),
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
    
    public function _commentElement()
    {
        $element = new Zend_Form_Element_Textarea('comment');
        
        $element->addValidator(new Zend_Validate_Alnum(true));
        
        $validator = new Zend_Validate_StringLength(0, 1000);
        $validator->setMessage(
            "Lengths of description is more than %max% characters long", 
            Zend_Validate_StringLength::TOO_LONG
        );
        $element->addValidator($validator);
        return $element;
    }

}