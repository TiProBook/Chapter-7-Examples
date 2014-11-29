var touchID = require('ti.touchid');

exports.resultType = {
    ERROR : 0,
    FAILED: 1,
    SUCCESS: 2,
    CANCELLED: 3,
    FALLBACK_REQUESTED:4,
    NOT_SETUP:5,
    UNKNOWN_ERROR:6    
};

var errorBuilder = function(e){
     if(e.code === touchID.ERROR_AUTHENTICATION_FAILED){
         return {success:false, resultType : exports.resultType.FAILED};
     }
     
     if(e.code === touchID.ERROR_USER_FALLBACK){
         return {success:false, resultType : exports.resultType.FALLBACK_REQUESTED};
     }
     
     if(e.code === touchID.ERROR_PASSCODE_NOT_SET ||
        e.code === touchID.ERROR_TOUCH_ID_NOT_AVAILABLE ||
        e.code === touchID.ERROR_TOUCH_ID_NOT_ENROLLED){
            return {success:false, resultType : exports.resultType.NOT_SETUP};
     } 

     if(e.code === touchID.ERROR_USER_CANCEL ||
        e.code === touchID.ERROR_SYSTEM_CANCEL){
            return {success:false, resultType : exports.resultType.CANCELLED};
     } 
     
     return {success:false, resultType : exports.resultType.FAILED};                           
};

exports.isSupported = function(){
    var result = touchID.deviceCanAuthenticate(); 
    return result.canAuthenticate;
};

exports.authenticate = function(opt,callback){
    var result = {success:false};
    touchID.authenticate({
        reason: opt.reason,
        callback: function(e) {
            if (e.success) {
                callback({
                   success:true,
                   resultType : exports.resultType.SUCCESS
                });
            }else{
                callback(errorBuilder(e));
            }                        
        }
    }); 
            
};

