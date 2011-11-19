<?php

class Application_Form_Expense_Add extends Zend_Dojo_Form
{
    /**
     * Form initialization
     *
     * @return void
     */
    public function init()
    {
        Zend_Dojo::enableForm($this);

        $this->setMethod('post');
        $this->setAction('/add');
        $this->setAttribs(array(
            'name' => 'addForm',
        ));

        $this->addElements(
            array(
                $this->_amountElement(),
                $this->_categorySelect(),
                $this->_dateElement(),
                $this->_isTodayElement(),
                $this->_commentElement(),
                $this->_resetButton(),
                $this->_submitButton()
            )
        );
    }

    public function _amountElement()
    {
        $amount = new Zend_Dojo_Form_Element_NumberSpinner(
            'amount',
            array(
                'value' => 0,
                'label' => 'Amount',
                'smallDelta' => 0.25,
                'largeDelta' => 3,
                'defaultTimeout' => 1000,
                'timeoutChangeRate' => 100,
                'min' => 0,
                'max' => 1000,
                'places' => 0,
                'maxlength' => 20,
                'attribs' => array(
                    'class' => 'expenseAmount'
                )
            )
        );

        $amount->removeDecorator('HtmlTag');
        $amount->removeDecorator('Label');

        return $amount;
    }

    public function _isTodayElement()
    {
        $checkbox = new Zend_Dojo_Form_Element_CheckBox(
            'isToday',
            array(
                'label' => 'Today',
                'checked' => true,
            )
        );

        $checkbox->removeDecorator('HtmlTag');
        $checkbox->removeDecorator('Label');

        return $checkbox;
    }

    public function _categorySelect()
    {
        $category = new Zend_Dojo_Form_Element_FilteringSelect(
            'category',
            array(
                'required' => true,
                'label' => 'Category name',
                'registerInArrayValidator' => false,
                'autocomplete' => true,
                'multiOptions' => array(''),
                'validators' => array(
                    array(
                        'Db_RecordExists',
                        false,
                        array(
                            'table' => 'category',
                            'field' => 'id'
                        )
                    )
                ),
                'attribs' => array(
                    'class' => 'category',
                    'placeholder' => 'Select category'
                )
            )
        );

        $category->removeDecorator('HtmlTag');
        $category->removeDecorator('Label');

        return $category;
    }

    public function _dateElement()
    {
        $date = new Zend_Dojo_Form_Element_DateTextBox(
            'date',
            array(
                'value' => date('Y-m-d'),
                'label' => 'Transaction Date',
                'required' => true,
                'attribs' => array(
                    'class' => 'date'
                )
            )
        );

        $date->removeDecorator('HtmlTag');
        $date->removeDecorator('Label');

        return $date;
    }

    public function _commentElement()
    {
        $element = new Zend_Dojo_Form_Element_Textarea('comment',
            array(
                'label' => 'Comment',
                'required' => false,
                'cols' => 33,
                'rows' => 2,
                'attribs' => array(
                    'class' => 'category',
                    'data-dojo-props' => 'placeholder: "Comment text (max 1000 characters)"',
                    'value' => ''
                )
            )
        );
        
        $element->addValidator(new Zend_Validate_Alnum(true));
        
        $validator = new Zend_Validate_StringLength(0, 1000);
        $validator->setMessage(
            "Lengths of description is more than %max% characters long", 
            Zend_Validate_StringLength::TOO_LONG
        );
        $element->addValidator($validator);
        
        $element->removeDecorator('Label');
        
        return $element;
    }
    
    public function _resetButton()
    {
        $button = new Zend_Dojo_Form_Element_Button(
            'reset',
            array(
                'label' => 'Reset',
                'type' => 'reset',
                'attribs' => array(
                    'class' => 'submit'
                )
            )
        );

        $button->removeDecorator('HtmlTag');
        $button->removeDecorator('DtDdWrapper');
        $button->removeDecorator('Label');

        return $button;
    }
    
    public function _submitButton()
    {
        $button = new Zend_Dojo_Form_Element_SubmitButton(
            'submit',
            array(
                'label' => 'Submit',
                'type' => 'submit',
                'attribs' => array(
                    'class' => 'submit'
                )
            )
        );

        $button->removeDecorator('HtmlTag');
        $button->removeDecorator('DtDdWrapper');
        $button->removeDecorator('Label');

        return $button;
    }

}