/* Author: 
    Pavel Machekhin (pavel.machekhin@gmail.com)
*/

(function() {
    dojo.require('dojo/store/Memory');
    dojo.require("dojo/store/Observable");
    dojo.require("dojo/store/JsonRest");
    dojo.require('dojo/parser');
    
    dojo.require('dijit/layout/AccordionContainer');
    dojo.require('dijit/layout/BorderContainer');
    dojo.require('dijit/layout/TabContainer');
    dojo.require('dijit/layout/ContentPane');
    
    dojo.require('dojox/widget/Toaster');

    dojo.require('app/expense/AddForm');
    dojo.require('app/expense/grid/History');
    dojo.require('app/expense/grid/EditColumn');
    dojo.require('app/Request');

    /**
     * @todo Refactor me
     */

    categoriesStore = dojo.store.Observable(
        new dojo.store.Memory({data: []})
    );
        
    options = {
        currency: "USD",
        
        spinner: {
            'smallDelta' : 0.25,
            'largeDelta' : 3,
            'defaultTimeout' : 1000,
            'timeoutChangeRate' : 100,
            'constraints': {
                'min' : 0,
                'max' : 1000
            },
            'places' : 0,
            'maxlength' : 20
        }
    }
    
    var store = new dojo.store.JsonRest({target: '/categories/list'});
    
    dojo.when(store.query()).then(function(data) {
        data.items.forEach(function(row) {
            categoriesStore.put(row);
        });
    });

    dojo.addOnLoad(function() {
        setTimeout(function hideLoader() {
            var loader = dojo.byId('loader');
            dojo.fadeOut({ node: loader, duration:500,
                onEnd: function() {
                    loader.style.display = "none";
                }
            }).play();
        }, 250);
        
        new dojox.widget.Toaster({
            type: 'message',
            messageTopic: '/app/info',
            positionDirection: 'tr-down',
            duration: 2500
        });
        
        new dojox.widget.Toaster({
            messageType: 'error',
            messageTopic: '/app/error',
            positionDirection: 'tr-down',
            duration: 2500
        });
    });
}())






















