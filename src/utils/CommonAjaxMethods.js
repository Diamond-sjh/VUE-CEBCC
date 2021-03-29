import  MainAjax from '@/core/utils/MainAjax'

/**
 * 通过菜单id获取菜单的交易规则，以及按钮权限信息
 * @param {*} permCode 
 */
var transRule = function(permCode){
    return new Promise((resolve,reject)=>{
        MainAjax.doPost(urlConfig.app.queryBusinessRule,{permCode:permCode},0).then(req=>{
            resolve(req);
        }).catch(e=>{
            console.log(e);
            reject('get trans rule error');
        });
    });
}
/**
 * 核身规则验证
 * @param {*} menuId 
 */
var identifyRule = function(menuId){
    return new Promise((resolve,reject)=>{
        resolve('ok');
    });
}
/**
 * 通过菜单id获取菜单下的子层级内容
 * @param {string} menuid 菜单节点id
 * @return {string} 
 */
var getMenuInfoByMenuId = function(menuId){
    return new Promise((resolve,reject)=>{
        MainAjax.doPost(urlConfig.app.getMenuInfoByMenuId,{menuId:menuId},0).then(req=>{
            resolve(req);
        }).catch(e=>{
            console.log(e);
            reject('get menu error');
        });
    });
    
}
export {transRule,identifyRule,getMenuInfoByMenuId}