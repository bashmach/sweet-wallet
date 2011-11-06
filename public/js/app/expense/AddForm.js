dojo.provide('app.expense.AddForm');

dojo.require('dijit.form.Form');
dojo.require('dijit.form.CheckBox');
dojo.require('dijit.form.CurrencyTextBox');
dojo.require('dijit.form.DateTextBox');
dojo.require('dijit.form.TimeTextBox');
dojo.require('dijit.form.FilteringSelect');
dojo.require('dijit.form.NumberSpinner');

dojo.declare(
    'app.expense.AddForm', 
    [dijit.form.Form], 
    {
        dateBox : false,
        
        isToday : false,
        
        submitButton: false,
        
        postCreate: function() {
            this.connect(this, 'onSubmit', function(e) {
                e.preventDefault();
                
                this.submit();
            });
            
            this.connect(this, 'onReset', function(e) {
                this._reset();
            });
            
            this.connect(this, 'startup', function(e) {
                this.dateBox = dijit.byId('date');
                this.isToday = dijit.byId('isToday');
                this.submitButton = dijit.byId('submit');
                
                this.dateBox.set('disabled', true);
            
                this.connect(this.submitButton, 'onClick', this.submit);
            
                this.connect(this.isToday, 'onChange', function(value) {
                    if (!value) {
                        this.dateBox.set('disabled', false);
                        
                        this.dateBox.openDropDown();
                    } else {
                        this.dateBox.set('disabled', true);
                        this.dateBox.set('value', new Date());
                        
                        this.dateBox.closeDropDown();
                    }
                })
            });
        },
                
        _collectData: function() {
            var data = this.get('value');
            var options = { 
                selector: "date", 
                datePattern: 'yyyy-MM-dd'
            };
            
            data['date'] = dojo.date.locale.format(this.dateBox.get('value'), options);
            
            return data;
        },
        
        submit: function() {
            if (!this.validate()) {
                return false;
            }

            var form = this
                , button = this.submitButton
                , request = new app.Request();

            button.set('disabled', true);

            dojo.when(
                request.post('/expense/add', this._collectData(), button)
            ).then(function(response) {
                if (1 == response.status) {
                    form.reset();
                    
                    dojo.publish('/expense/add', [response.data]);
                    dojo.publish('/app/info', [{type: 'message', message: response.message}]);
                } else {
                    dojo.publish('/app/message', [{type: 'message', message: response.message}]);
                    
                    dojo.forEach(form.getChildren(), function(input) {
                        if (typeof response.messages[input.get('name')] !== 'undefined') {

                            input.focus();
                            input.isValid(false);
                            input.displayMessage(response.messages[input.get('name')]);
                        }
                    });
                }                    
            });
            
            return true;
        },
        
        _reset: function() {
            if (this.isToday) {
                
                setTimeout(function() {
                    dijit.byId('category')._updatePlaceHolder();
                }, 200);
                
                this.isToday.set('checked', 'checked');

                this.dateBox.set('value', new Date());

                this.dateBox.set('disabled', true);
                
            }
        }
    }
);