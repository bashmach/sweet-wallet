dojo.provide("app.form.ValidationTextarea");

dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.Textarea");

dojo.declare("app.form.ValidationTextarea", [dijit.form.ValidationTextBox, dijit.form.Textarea], {
    baseClass: 'appValidationTextarea dijitTextBox dijitValidationTextBox dijitTextArea'
    
//    , invalidMessage: 'The value entered is not valid.'
}); 