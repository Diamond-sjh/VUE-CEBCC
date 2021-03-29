import { MessageBox } from 'element-ui';
export default{
    confirm(message){
        return new Promise((resolve,rejects)=>{
            MessageBox.confirm(
                message.text?message.text:'', 
                message.title,
                {
                    distinguishCancelAndClose: true,//区分关闭按钮与取消按钮，esc时候为关闭，如果是false则都视为取消
                    confirmButtonText: message.sureText?message.sureText:"确定",
                    cancelButtonText: message.cancelText?message.cancelText:'取消',
                    type: 'warning',
                    center: true
            }).then(() => {
                resolve(true)
            }).catch(() => {
                resolve(false)
            });
        });
    },
    success(){

    }
}