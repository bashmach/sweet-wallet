define([
        "dojo/_base/declare", 
        "dijit/form/Form",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/AddForm.html",
        "dojo/on",
        "dijit/form/CheckBox",
        "dijit/form/DateTextBox",
        "dijit/form/TimeTextBox",
        "dijit/form/FilteringSelect",
        "dijit/form/Textarea",
        "app/form/CurrencySpinner/CurrencySpinner",
        "app/form/ValidationTextarea",
        "app/Request",
        
        "dojo/domReady!"
    ],
    function(declare, Form, _WidgetsInTemplateMixin, template, on) {
        return declare("app.expense.AddForm", [Form, _WidgetsInTemplateMixin], {
            templateString: template,
            
            widgetsInTemplate: true,
            
            dateBox : false,
        
            isToday : false,

            submitButton: false,

            options: options.spinner,

            startup: function() {
                var _dateBox = this.dateBox;
                
                this.selectToday.on('change', function(value) {
                    if (!value) {
                        _dateBox.set('disabled', false);

                        _dateBox.openDropDown();
                    } else {
                        _dateBox.set('disabled', true);
                        _dateBox.set('value', new Date());

                        _dateBox.closeDropDown();
                    }
                })
            },

            postCreate: function() {
                this.options = options.spinner;
                
                on(this.form, 'submit', dojo.hitch(this, '_submit'));

                this.connect(this, 'onReset', function(e) {
                    this._reset();
                });
            }
            , _collectData: function() {
                var data = this.form.get('value');
                var options = { 
                    selector: "date", 
                    datePattern: 'yyyy-MM-dd'
                };

                data['date'] = dojo.date.locale.format(this.dateBox.get('value'), options);

                return data;
            }
            , _submit: function(e) {
                e.preventDefault();
                
                if (!this.validate()) {
                    return false;
                }

                var form = this.form
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
                            if (typeof response.errorMessages[input.get('name')] !== 'undefined') {

                                input.focus();

                                if (dojo.isFunction(input.isValid)) {
                                    input.isValid(false);

                                    input.displayMessage(input.invalidMessage);
                                } else {
                                    dijit.Tooltip.show('message', input.domNode);

                                    input.on('blur', function() {
                                        dijit.Tooltip.hide(input.domNode);
                                    })


                                }

                            }
                        });
                    }                    
                });

                return true;
            }
            , _reset: function() {
                if (this.dateBox) {
                    this.selectToday.set('checked', 'checked');
                }
            }
        });
    }
);