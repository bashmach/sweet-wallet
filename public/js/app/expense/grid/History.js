define(
    [
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
        "dojo/domReady!"
    ],
    function(declare, Grid, Editor, FilteringSelect, DateTextBox, Textarea, CurrencySpinner, EditColumn, Selection, Keyboard, JsonRest, Observable, Memory, on) {
        
        grid = false;

        var _lastDisplayedDate = false;
        var _lastDisplayedItemId = false;

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
                            label: 'Date'
                            , field: 'date'
                            , canEdit: function(item) {
                                return value.bool == true;
                            }
//                            , autoSave : true
                            , renderCell: function(object, data, td, options) {
                                td.innerHTML = dojo.date.locale.format(new Date(data), {selector: 'date', formatLength: "long"});
                                
//                                var _showDate;
//                                    
//                                if (typeof object._showDate == 'undefined') {
//                                    _showDate = (_lastDisplayedDate !== data || _lastDisplayedItemId == object.id);
//                                } else {
//                                    _showDate = object._showDate;
//                                }
//                                
//                                if (_showDate) {
//                                    object._showDate = true;
//                                    
//                                    td.innerHTML = dojo.date.locale.format(new Date(data), {selector: 'date', formatLength: "long"});
//                                } else {
//                                    object._showDate = false;
//                                }
//                                
//                                _lastDisplayedDate = data;
//                                _lastDisplayedItemId = object.id;
                            }
                        }, 
                        DateTextBox
                        , "dblclick"
                    ),
                    Editor(
                        {
                            label: 'Category'
                            , field: 'categoryId'
                            , canEdit: function(item) {
                                return value.bool == true;
                            }
//                            , autoSave : true
                            , widgetArgs: {
                                store: categoriesStore
                            }
                            , renderCell: function(object, data, td, options) {
                                td.innerHTML = categoriesStore.get(data).name;
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
                            , canEdit: function(item) {
                                return value.bool == true;
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
                            label: 'Comment'
                            , field: 'comment'
                            , canEdit: function(item) {
                                return value.bool == true;
                            }
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
                    ) 
                    , Editor(
                        {
                            label: ' '
                            , field: 'id'
                            , sortable : false
                            , widgetArgs: {
                                name: '123'
                            }
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
                
                    grid.lastDisplayedDate = false;
                
                    dojo.subscribe('/expense/add', this, function(row) {
                        store.put(row);
                    });
                    
                    dojo.subscribe('/expense/edit', this, function(row) {
                        grid.store.get(row.id).date = '2011-11-20';
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