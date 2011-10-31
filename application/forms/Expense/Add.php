<?php

class Application_Form_Expense_Add extends Zend_Dojo_Form {

    /**
     * Options to use with select elements
     */
    public $_selectOptions = array(
        'red' => 'Rouge',
        'blue' => 'Bleu',
        'white' => 'Blanc',
        'orange' => 'Orange',
        'black' => 'Noir',
        'green' => 'Vert',
    );

    /**
     * Form initialization
     *
     * @return void
     */
    public function init() {
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
                'label' => 'NumberSpinner',
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
                'label' => 'Category',
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
                    'placeholder' => 'Category'
                )
            )
        );
        
        $category->setStoreId('categoriesStore')
            ->setStoreType('dojo.data.ItemFileReadStore')
            ->setStoreParams(
                array(
                    'url' => '/categories/list'
                )
            )
            ->setAttrib('searchAttr', 'name');
        
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
                'label' => 'DateTextBox',
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
    
    public function _submitButton()
    {
        $button = new Zend_Dojo_Form_Element_SubmitButton( 
            'submit', 
            array(
                'label' => 'Submit expense',
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