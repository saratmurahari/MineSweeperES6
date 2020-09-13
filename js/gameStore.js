(function(window) {
    'use strict';

    class Store{
        constructor(name) {
            this.appname = name;
            if (!localStorage[name]) {
                let data = {
                    users:[],
                    loggedinUser:"",
                    userData:{
                        
                    },
                };

                localStorage[name] = JSON.stringify(data);
            }
        }
        setData(dataObj){
            localStorage[this.appname ]=JSON.stringify(dataObj);
            
        }
        getData() {
            return JSON.parse(localStorage[this.appname]);
        }

    }

    window.app = window.app || {};
    window.app.Store = Store;
})(window);