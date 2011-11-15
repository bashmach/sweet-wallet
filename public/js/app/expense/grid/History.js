define(
    [
        "require",
        "dojo/_base/declare",
        "dgrid/OnDemandGrid",
        "dgrid/Editor", 
        "dijit/form/FilteringSelect", 
        "dijit/form/DateTextBox",
        "dijit/form/Textarea",
        "app/form/CurrencySpinner/CurrencySpinner", 
//        "dijit/form/Button",
        "app/expense/grid/EditColumn",
        "dgrid/Selection", 
        "dgrid/Keyboard", 
        "dojo/store/JsonRest",
        "dojo/store/Observable",
        "dojo/store/Memory",
        "dojo/on",
        "dgrid/test/data/base",
        "dojo/NodeList-traverse",
        "dojo/domReady!"
    ],
    function(require, declare, Grid, Editor, FilteringSelect, DateTextBox, Textarea, CurrencySpinner, EditColumn, Selection, Keyboard, JsonRest, Observable, Memory, on) {
        
        grid = false;

        var _refresh = function() {
            var attribute = 'date'
                , descending = true;
            
            if (grid.sortOrder != null && typeof grid.sortOrder[0].attribute !== 'undefined') {
                attribute = grid.sortOrder[0].attribute;
            }
            if (grid.sortOrder != null && typeof grid.sortOrder[0].descending !== 'undefined') {
                descending = grid.sortOrder[0].descending;
            }
            
            grid.sort(attribute, descending);
        }
        
        return declare("app.expense.grid.History", [], {
            
            store: false,
            
            getColumns: function() {
                return [
                    Editor(
                        {
                            label: 'Category'
                            , field: 'categoryId' 
//                            , autoSave : true
                            , widgetArgs: {
                                store: categoriesStore
                            }
                            , formatter: function(value) {
                                return categoriesStore.get(value).name;
                            }
                        }
                        , FilteringSelect
                        , "dblclick"
                    ),
                    Editor(
                        {
                            label: 'Amount'
                            , field: 'amount'
//                            , autoSave : true
                            , widgetArgs: function() {
                                return dojo.mixin({
                                    currency: options.currency,
                                    constraints: {
                                        fractional:true
                                    }
                                }, options.spinner);
                            }
                            , formatter: function(value) {
                                 return dojo.currency.format(value, {currency: options.currency});
                            }
                        }
                        , CurrencySpinner
                        , "dblclick"
                    ),
                    Editor(
                        {
                            label: 'Date'
                            , field: 'date'
//                            , autoSave : true
                            , formatter: function(value) {
                                return dojo.date.locale.format(new Date(value), {selector: 'date', formatLength: "long"});
                            }
                        }, 
                        DateTextBox
                    ),
                    Editor(
                        {
                            label: 'Comment'
                            , field: 'comment'
                            , renderCell: function(object, data, td, options){
                                var div = document.createElement("div");
                                div.className = "dojoxEllipsis";
                                div.innerHTML = '<span>' + data + '</span>';
                                
                                td.appendChild(div);
                                
                                return div;
                            }
                            , widgetArgs: {
                                placeholder: 'Comment text (max 1000 characters)'
                            }
                        }, 
                        Textarea
                        , "dblclick"
                    ),
                    Editor(
                        {
                            label: ' '
                            , field: 'id'
                            , sortable : false
                        }
                        , EditColumn
                    )
                ];
            },
            
            getData: function() {
                var store;
                    
                store = new JsonRest({target: '/transactions/list'});
                
                return store.query();
            },
            
            init: function() {
                var store = this.store
                    , columns = this.getColumns();
                
                dojo.when(this.getData()).then(function(data) {
                    data.forEach(function(row) {
                        store.put(row);
                    });

                    store.query().observe(function(object, removedFrom, insertedInto){
                        _refresh();
                    });

                    grid = new (declare([Grid, Selection, Keyboard]))({
                        store: store,
                        columns: columns,
                        selectionMode: "single"
                    }, "grid");
                
                    dojo.subscribe('/expense/add', this, function(row) {
                        store.put(row);
                    });
                    
                    dojo.subscribe('/expense/edit', this, function(row) {
                        _refresh();
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