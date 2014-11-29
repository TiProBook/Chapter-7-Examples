var args = arguments[0] || {};

var touchHelper = require('touchid-helper');

var auth = {  
  fallback : function(){
      var dialog = Ti.UI.createAlertDialog({
        title: 'Enter: 123',
        style: Ti.UI.iPhone.AlertDialogStyle.SECURE_TEXT_INPUT,
        persistent:true,
        buttonNames: ['Verify']
      });
      dialog.addEventListener('click', function(e){
          if(e.text == "123"){
              auth.onSuccess();         
          }else{
              alert("incorrect passcode");
              auth.fallback();
          }
      });
      dialog.show();      
  },
  onSuccess : function(){
     alert("You have successfully logged in.");
     $.loginWindow.close();      
  },
  ask : function(){
   var config ={
     reason : "We require you use Touch ID to continue."  
   };
   touchHelper.authenticate(config, function(e){
      
        if(e.success){
            auth.onSuccess();
        }

        //Check if fallback requested
        if((!e.success) &&(e.resultType == touchHelper.resultType.FALLBACK_REQUESTED)){
           setTimeout(function(){
              auth.fallback();
           },1000);
           return;
        } 
            
        if((!e.success) && (e.resultType == touchHelper.resultType.CANCELLED)){
            alert("You must login to continue, try again.");
            auth.ask();
         }    
        
        if((!e.success) && (e.resultType == touchHelper.resultType.NOT_SETUP)){
           alert("Your device is not setup for Touch ID. Please complete your device and relauch this app.");
        } 
    
        //Check if errorred
        if((!e.success) && (e.resultType == touchHelper.resultType.ERROR || e.resultType == touchHelper.resultType.UNKNOWN_ERROR)){
            alert("Oops we've encountered an error, please try again.");;
        } 

        //Check if failed
        if((!e.success) && (e.resultType == touchHelper.resultType.FAILED)){
            alert("Login failed something is wrong with your finger");
         }             
   });       
  }  
};

if(touchHelper.isSupported()){
    $.loginWindow.addEventListener('open',auth.ask);
}else{
    alert("Your device does not support Touch ID or you are running this in the simulator.");
}