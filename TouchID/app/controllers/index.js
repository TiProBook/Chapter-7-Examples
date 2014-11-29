
$.index.addEventListener('open',function(e){
    Alloy.createController("login").getView().open({model:true});
});

$.index.open();
