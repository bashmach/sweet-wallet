<?php

class ExpenseController extends Zend_Controller_Action
{
    public function init()
    {
        // FIX ME
        $this->_user = new stdClass();
        $this->_user->id = 1;
        
        $this->status = 0;
        $this->message = '';
        
        $this->_helper->layout()->disableLayout();
    }

    public function addAction()
    {
        $expense = false;
        $errorMessages = false;
        
        try {

            $form = new Application_Form_Expense_Add();
            
            if (!$this->_request->isXmlHttpRequest()) {
                throw new Exception('Should be XmlHttpRequest');
            }
            
            if ($form->isValid($this->_request->getPost())) {
                $model = new Application_Model_Transaction();

                $data = $form->getValues();
                $data['userId'] = $this->_user->id;

                $expense = $model->add($data, Application_Model_Transaction::TYPE_EXPENSE);

                $expense = $expense->toStoreValue();

                $this->status = 1;
                $this->message = 'Expense has been successfully added.';
            } else {
                $errorMessages = $form->getMessages();
            }
        } catch (Application_Model_Exception $e) {
            $this->message = $e->getMessage();
        } catch (Exception $e) {
            $this->message = $e->getMessage(); //'Could not add expense.';
        }

        $this->_helper->json(array(
            'status' => $this->status,
            'message' => $this->message,
            'errorMessages' => $errorMessages,
            'data' => $expense
        ));
    }
    
    public function editAction()
    {
        $expense = false;
        $errorMessages = false;
        
        try {
            $form = new Application_Form_Expense_Edit();
            
            if (!$this->_request->isXmlHttpRequest()) {
                throw new Exception('Should be XmlHttpRequest');
            }
            
            if ($form->isValid($this->_request->getPost())) {
                $model = new Application_Model_Transaction();
                
                $data = $form->getValues();
                $data['userId'] = $this->_user->id;
                
                $expense = $model->edit($data, Application_Model_Transaction::TYPE_EXPENSE);

                $expense = $expense->toStoreValue();
                
                $this->status = 1;
                $this->message = 'Expense has been successfully updated.';
            }
            
        } catch (Application_Model_Exception $e) {
            $this->message = $e->getMessage();
        } catch (Exception $e) {
            $this->message = $e->getMessage(); //'Could not edit expense.';
        }

        $this->_helper->json(array(
            'status' => $this->status,
            'message' => $this->message,
            'errorMessages' => $errorMessages,
            'data' => $expense
        ));
    }

}

