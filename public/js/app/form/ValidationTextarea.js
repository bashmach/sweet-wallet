define(
[
    "dojo/_base/declare",
    "dijit/form/ValidationTextBox", 
    "dijit/form/Textarea"
],
function(declare, ValidationTextBox, Textarea) {
    return declare("app.form.ValidationTextarea", [ValidationTextBox, Textarea], {
        baseClass: 'appValidationTextarea dijitTextBox dijitValidationTextBox dijitTextArea'
    });
});