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
        "dojo/store/Observable",
        "dojo/store/Memory",
        "dgrid/test/data/base", 
        "dojo/domReady!"
    ],
    function(require, declare, Grid, Editor, DateTextBox, Button, CurrencyTextBox, Selection, Keyboard, JsonRest, Observable, Memory) {
        
        var columns = [
            Editor(
                {
                    label: 'Date', 
                    field: 'date',
                    widgetArgs: function(item) {
                        return {
                            value: dojo.date.locale.format(new Date(item.value), {selector: 'date'})
                        }
                    }
                }, 
                DateTextBox
            ),
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
            
            grid: false,
            
            store: false,
            
            getData: function() {
                var store;
                    
                store = new JsonRest({target: '/transactions/list'});
                
                return store.query();
            },
            
            init: function() {
                var store = this.store
                    , grid = this.grid;
                
                dojo.when(this.getData()).then(function(data) {
                    data.forEach(function(row) {
                        store.put(row);
                    });

                    store.query().observe(function(object, removedFrom, insertedInto){
                        grid.sort('created', true);
                    });

                    grid = new (declare([Grid, Selection, Keyboard]))({
                        store: store,
                        columns: columns,
                        selectionMode: "single"
                    }, "grid");
                    
                    dojo.subscribe('/expense/add', this, function(row) {
                        store.put(row);
                    });
                });
            },
            
            startup: function() {
                this.store = Observable(new Memory());

                this.init();
            }
        });
    }
);