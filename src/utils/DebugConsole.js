
window.DebugLog=function(){
    if(constants.debug){
        let len=arguments.length;
        while(len>=0){
            console.log(arguments[len]);
            len--;
        }
    }
}