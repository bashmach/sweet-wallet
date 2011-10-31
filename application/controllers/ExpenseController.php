<?php

class ExpenseController extends Zend_Controller_Action {

    public function init() 
    {
        $this->_helper->layout()->disableLayout();
    }

    public function addAction()
    {
        $status = 0;
        $messages = array();
        
        $form = new Application_Form_Expense_Add();
        
        try {
            
            if ($this->_request->isXmlHttpRequest()) {
                if ($form->isValid($this->_request->getPost())) {
                    $model = new Application_Model_Transaction();
                    $model->add($form->getValues(), Application_Model_Transaction::TYPE_EXPENSE);

                    $status = 1;
                } else {
                    $messages = $form->getMessages();
                }
            } else {
                throw new Exception('Should be XmlHttpRequest');
            }
            
            $message = 'Expense has been successfully added.';
        } catch (Application_Model_Exception $e) {
            $message = $e->getMessage();
        } catch (Exception $e) {
            $message = $e->getMessage();//'Could not add expense.';
        }
        
        $this->_helper->json(array(
            'status' => $status,
            'message' => $message,
            'errorMessages' => $messages
        ));
    }
}

