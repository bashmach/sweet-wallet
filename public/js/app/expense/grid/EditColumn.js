define([
        "dojo/_base/declare", 
        "dijit/form/_FormWidget",
        "dijit/_WidgetsInTemplateMixin",
        "app/Request",
        "dojo/text!./templates/EditColumn.html",
        "dijit/form/Button",
        "dojo/on"
    ],
    function(declare, _FormWidget, _WidgetsInTemplateMixin, Request, template, Button, on) {
        
        /**
         * 
         */
        var Cell = function(item, gridCell) {
            this.fieldName = gridCell.column.field;
            this.column = gridCell.column;
            this.value = item[this.fieldName];
            this.displayValue = this.value;
            this.renderNeeded = (this.fieldName != 'id');

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

            if (this.value instanceof Date) {
                this.value = item[this.fieldName] = dojo.date.locale.format(
                    this.value, {
                        selector: 'date', 
                        datePattern: "yyyy-MM-dd"
                    }
                );
            }

            if (!item.bool && dojo.isFunction(this.column.formatter)) {

                this.displayValue = this.column.formatter(this.value);                
            } else {
                this.displayValue = this.value;
            }
        }
        
        // summary:
		//		A widget with actions buttons from History grid.
		// description:
		//		
        
        return declare("app.expense.grid.EditColumn", [_FormWidget, _WidgetsInTemplateMixin], {
            
            cell: false,
            
            item: false,
            
            value: false,
            
//            tabIndex: "",
            
            _setTabIndexAttr: "editButton",
            
            _setIdAttr: "editButton",
            
            templateString: template,
            
            widgetsInTemplate: true,
            
            _bindToggling: function() {
                var self = this
                    , editButton = this.editButton
                    , cancelButton = this.cancelButton
                    , item = this.item
                    , cell = this.cell
                    , _updateCells = this._updateCells
                    , _updateButtons = this._updateButtons;
                
                editButton.on('click', function(e) {
                    
                    e.preventDefault();

                    editButton.set('disabled', true);

                    item.bool = !item.bool;

                    dojo.when(_updateCells(item, dojo.query('.dgrid-cell', cell.row.element)))
                        .then(function() {
                            self._updateButtons(item.bool);
                            
                            editButton.set('disabled', false);
                        });
                });

                on(cancelButton, 'click', function(e) {
                    e.preventDefault();
                    
                    item.bool = false;
                    
                    dojo.when(_updateCells(item, dojo.query('.dgrid-cell', cell.row.element), true))
                        .then(function() {
                            self._updateButtons(item.bool);
                            
                            dojo.style(cancelButton.domNode, 'display', 'none');
                            dojo.style(editButton.domNode, 'display', '');
                        });
                });
            },
            
            _updateCells : function(item, currentCells, reset) {
                var dfrd = new dojo.Deferred()
                    , newCells = []
                    , data = {}
                    , grid = this.grid
                    , request = new Request();

                item = dojo.mixin(item, grid.dirty[item.id]);

                dojo.forEach(currentCells, function(curCell) {
                    curCell = new Cell(item, grid.cell(curCell));

                    newCells.push(curCell.getData());
                });
                
                dojo.forEach(newCells, function(cell) {
                    if (cell.render == true) {
                        dojo.empty(cell.element);

                        cell.column.renderCell(item, cell.displayValue, cell.element);
                    }
                });

                if (reset !== true && !item.bool) {
                    data = {
                        'identifier' : item.id,
                        'date': item.date,
                        'amount': item.amount,
                        'comment': item.comment,
                        'category': item.categoryId
                    }
                    
                    dojo.when(request.post('/expense/edit', data))
                    .then(
                        function(response) {
                            if (1 == response.status) {
                                dojo.publish('/app/info', [{type: 'message', message: response.message}]);
                                
                                dojo.publish('/expense/edit', [response.data]);
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
            },
            
            _updateButtons: function(editModeEnabled) {
                this.editButton.set('label', (editModeEnabled ? 'Save': 'Edit'));
                
                if (editModeEnabled) {
                    dojo.style(this.cancelButton.domNode, 'display', '');
                } else {
                    dojo.style(this.cancelButton.domNode, 'display', 'none');
                }
            },

            focus: function(){
                // summary:
                //		Put focus on this widget
                if(!this.disabled && this.editButton.focus){
                    try{ this.editButton.focus(); }catch(e){}/*squelch errors from hidden nodes*/
                }
            },
            
            startup: function() {
                var cells = dojo.query('#grid-row-'+this.value + ' .dgrid-cell');
                
                this.grid = grid;
                
                this.cell = this.grid.cell(cells[0]);
                
                this.item = this.cell.row.data;
               
                this.item.bool = false;
               
                this.focusNode = this.editButton;
               
                this._bindToggling();
            }
            
        });
     }
 );