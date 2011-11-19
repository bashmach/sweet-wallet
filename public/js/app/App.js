/* Author: 
    Pavel Machekhin (pavel.machekhin@gmail.com)
*/

define(
    [
        "dojo/_base/declare",
        "dojo/store/Observable",
        "dojo/store/Memory",
        "dojox/widget/Toaster",
        "dijit/layout/AccordionContainer",
        "dijit/layout/BorderContainer",
        "dijit/layout/TabContainer",
        "dijit/layout/ContentPane",
        "app/expense/AddForm",
        "app/expense/grid/History",
        "app/Request",
        "dojo/domReady!"
    ],
    function(declare, Observable, Memory, Toaster) {

        setTimeout(function hideLoader() {
            var loader = dojo.byId('loader');
            dojo.fadeOut({node: loader, duration:500,
                onEnd: function() {
                    loader.style.display = "none";
                }
            }).play();
        }, 250);


        return declare('app.App', [], {
            
            categoriesStore: false,
            
            properties: {
                categoriesList: []
            },
            
            options : {
                currency: "USD",

                spinner: {
                    'currency': "USD",
                    'smallDelta' : 0.25,
                    'largeDelta' : 3,
                    'defaultTimeout' : 1000,
                    'timeoutChangeRate' : 100,
                    'constraints': {
                        'fractional' : true,
                        'min' : 0,
                        'max' : 1000
                    },
                    'places' : 0,
                    'maxlength' : 20
                }
            },
            
            constructor: function(properties) {
                dojo.mixin(this.properties, properties);
                
                this._initStore();
                this._initMessages();
            },
            
            _initStore: function() {
                this.categoriesStore = Observable(
                    new Memory({data: this.properties.categoriesList})
                );
            },
            
            _initMessages: function() {
                new Toaster({
                    type: 'message',
                    messageTopic: '/app/info',
                    positionDirection: 'tr-down',
                    duration: 2500
                });

                new Toaster({
                    messageType: 'error',
                    messageTopic: '/app/error',
                    positionDirection: 'tr-down',
                    duration: 2500
                });
            }
        });

    }
);