dojo.provide('app.Request');

dojo.declare(
    'app.Request', 
    null, 
    {
        post: function(url, data, button) {
            var xhrArgs = {
                url: url,
                content: data,
                handleAs: "json",
                load: function() {
                    button.set('disabled', false);
                },
                error: function() {
                    dojo.publish('/app/info', [{type: 'error', message: 'Sorry! Please try again.'}]);
                    
                    button.set('disabled', false);
                }
            }
            
            return dojo.xhrPost(xhrArgs);
        }
    }
);