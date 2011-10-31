define(
    [
        "require",
        "dojo/_base/declare",
        "dgrid/OnDemandGrid",
        "dgrid/Editor", 
        "dijit/form/DateTextBox", 
        "dijit/form/Button", 
        "dijit/form/CurrencyTextBox", 
        "dgrid/Selection", 
        "dgrid/Keyboard", 
        "dojo/store/JsonRest",
        "dgrid/test/data/base", 
        "dojo/domReady!"
    ],
    function(require, declare, Grid, Editor, DateTextBox, Button, CurrencyTextBox, Selection, Keyboard, JsonRest) {
        
        var columns = [
            Editor({label: 'Date', field: 'date'}, DateTextBox),
            Editor(
                {
                    label: 'Amount', 
                    field: 'amount', 
                    widgetArgs: {
                        currency: "USD",
                        constraints: {
                            fractional:true
                        }
                    }
                }, 
                CurrencyTextBox
//                , "dblclick"
            ),
//            Editor(
                {
                    label: 'Category', 
                    field: 'category', 
                    canEdit: function(object) {
                        return object.bool;
                    }
                }, 
//                "text"
////                , "dblclick"
//            ),
            Editor(
                {
                    label: ' ', 
                    field: 'id',
                    widgetArgs: function(item){
                        return {
                            label: 'Edit'
                        };
                    }
                }, 
                Button
            )
        ];
        
        return declare("app.expense.grid.History", [], {
            startup: function() {                
                var store;
                
                
                store = new JsonRest({target: '/transactions/list'});
                
                var grid = new (declare([Grid, Selection, Keyboard]))({
                    store: store,
                    columns: columns,
                    selectionMode: "single"
                }, "grid");

                console.dir(grid);
                

                grid.on(".field-integer:change", function(event){
                    if(event.value > 100){
                        event.preventDefault();
                        alert("Values above 100 not allowed");
                    }
                });
            }
            
        });
    }
);