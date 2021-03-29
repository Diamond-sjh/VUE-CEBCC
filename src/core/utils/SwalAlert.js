import swal from 'sweetalert'
export default{
    success(title,text){
        swal({
            position:'top',
            icon:'success',
            title:title,
            button:'确定',
            text:text,
            // timer:'5000',
        });
    },
    warning(title,text){
        swal({
            position:'top',
            icon:"warning",
            title:title,
            text:text,
            button:'确定',
        })
    },
    error(title,text){
        swal({
            title:title,
            text:text,
            icon:"error",
            button:'确定',
        })
    },
    info(title,text){
        swal({
            title:title,
            text:text,
            icon:"info",
            button:"确定"
        })
    },
    confirm(obj){
        return new Promise((resolve,rejects)=>{
            let cancel = obj.showCanellButton!=null?obj.showCanellButton:true;
            swal({
                title:obj.title,
                text:obj.text,
                icon:'warning',
                buttons:[cancel?(obj.cancelBtnText||'取消'):false,obj.sureBtnText||'确定']
            }).then((result)=>{
                resolve(result)
            });
        });
    }
}

