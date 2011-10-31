/* Author: 
    Pavel Machekhin (pavel.machekhin@gmail.com)
*/

(function() {
    dojo.require('dojo.data.ItemFileReadStore');
    dojo.require('dojo.parser');
    
    dojo.require('dijit.layout.AccordionContainer');
    dojo.require('dijit.layout.BorderContainer');
    dojo.require('dijit.layout.TabContainer');
    dojo.require('dijit.layout.ContentPane');
    
    dojo.require('dojox.widget.Toaster');

    dojo.require('app.expense.AddForm');
    dojo.require('app.expense.grid.History');
    dojo.require('app.Request');
    
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






















