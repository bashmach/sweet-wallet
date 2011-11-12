define(
    [
        "require",
        "dojo/_base/declare",
        "dgrid/OnDemandGrid",
        "dgrid/Editor", 
        "dijit/form/FilteringSelect", 
        "dijit/form/DateTextBox", 
        "dijit/form/Button", 
        "app/form/CurrencySpinner/CurrencySpinner", 
        "dgrid/Selection", 
        "dgrid/Keyboard", 
        "dojo/store/JsonRest",
        "dojo/store/Observable",
        "dojo/store/Memory",
        "app/Request",
        "dojo/on",
        "dgrid/test/data/base",
        "dojo/NodeList-traverse",
        "dojo/domReady!"
    ],
    function(require, declare, Grid, Editor, FilteringSelect, DateTextBox, Button, CurrencySpinner, Selection, Keyboard, JsonRest, Observable, Memory, Request, on) {
        
        //fix me
        /*var*/ grid = false;
        
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
        
        var Cell = function(item, gridCell) {
                
            this.fieldName = gridCell.column.field;
            this.column = gridCell.column;
            this.value = item[this.fieldName];
            this.displayValue = this.value;
            this.renderNeeded = (this.fieldName != 'bool');

            this.getData = function() {
                return {
                    name: this.fieldName,
                    column: this.column,
                    value: this.value,
                    displayValue: this.displayValue,
                    element: gridCell.element,
                    render: this.renderNeeded
                }
            }

            if (this.renderNeeded) {
                this.column.editOn = (item.bool) ? false : "dblclick";
            }

            if (!item.bool && dojo.isFunction(this.column.formatter)) {
                
                this.displayValue = this.column.formatter(this.value);
                
                if (this.value instanceof Date) {
                    item[this.fieldName] = dojo.date.locale.format(
                        this.value, {
                            selector: 'date', 
                            datePattern: "yyyy-MM-dd"
                        }
                    );
                }
            } else {
                this.displayValue = this.value;
            }
        }
        
        var _updateCells = function(item, currentCells) {
            var dfrd = new dojo.Deferred()
                , newCells = []
                , data = {}
                , request = new Request();
            
            dojo.forEach(currentCells, function(cell) {
                cell = new Cell(item, grid.cell(cell));

                newCells.push(cell.getData());
            });
            
            dojo.forEach(newCells, function(cell) {
                if (cell.render == true) {
                    dojo.empty(cell.element);

                    cell.column.renderCell(item, cell.displayValue, cell.element);
                }
            });

            if (!item.bool) {
                data = {
                    'identifier' : item.id,
                    'date': item.date,
                    'amount': item.amount,
                    'category': item.categoryId
                }
                
                dojo.when(request.post('/expense/edit', data))
                .then(
                    function(response) {
                        if (1 == response.status) {
                            dojo.publish('/app/info', [{type: 'message', message: response.message}]);
                            
                            _refresh();
                        } else {
                            dojo.publish('/app/message', [{type: 'message', message: response.message}]);
                        }

                        dfrd.resolve(response.status);
                    }, function() {
                        dfrd.resolve(true);
                    }
                );
                
            } else {
                dfrd.resolve(true);
            }

            return dfrd.promise;
        }
        
        var _editRow = function(item, cell, button) {
            button.set('disabled', true);
            
            button.set('value', !button.get('value'));

            item.bool = button.get('value');

            dojo.when(_updateCells(item, dojo.query('.dgrid-cell', cell.row.element)))
                .then(function(status) {
                    if (status) {
                        button.set('label', (button.get('value') ? 'Save' : 'Edit'));
                    }
                    
                    button.set('disabled', false);
                });
        }
        
        return declare("app.expense.grid.History", [], {
            
            store: false,
            
            getColumns: function() {
                return [
                    Editor(
                        {
                            label: 'Category'
                            , field: 'categoryId' 
                            , canEdit: function(object) {
                                return object.bool;
                            }
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
                            , canEdit: function(object) {
                                return object.bool;
                            }
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
                            , canEdit: function(object) {
                                return object.bool;
                            }
                            , formatter: function(value) {
                                return dojo.date.locale.format(new Date(value), {selector: 'date', formatLength: "long"});
                            }
                        }, 
                        DateTextBox
                    ),
                    Editor(
                        {
                            label: ' '
                            , field: 'bool'
                            , widgetArgs: function(item){
                                return {
                                    label: 'Edit',
                                    onClick: function(evt) {
                                        _editRow(item, grid.cell(evt), this);
                                    }
                                };
                            }
                        }
                        , Button
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
                });
            },
            
            startup: function() {
                this.store = Observable(new Memory());

                this.init();
            }
        });
    }
);