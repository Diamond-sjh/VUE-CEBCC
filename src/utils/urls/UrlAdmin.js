export default {

    //用户管理
    queryUser:"/n/user/userQueryList.do",//用户列表
    addUser:"/n/user/saveUser.do",//用户新增
    updateUser:"/n/user/updateUser.do",//用户修改
    userSaveUser:"/n/user/editUser.do",//用户详情
    deleteUser:"/n/user/delUser.do",//用户删除
    resetUserPwd:"/n/user/resetPwd.do",//密码重置
    userEditbindAgent:"/n/user/editbindAgent.do",//操作员列列表
    userSavebingAgent:"/n/user/savebingAgent.do",//绑定操作员
    userCencelBingAgent:"/n/user/cencelBingAgent.do",//取消绑定操作员
    orgTree:"/n/user/orgTreeList.do",//机构树
    dutyTree:"/n/user/dutyTreeList.do",//行政级别树
    skillTeamList:"/n/user/skillTeamList.do",//行政级别树
    roleTreeList:"/n/user/roleTreeList.do",//授权查询角色树
    role_update:"/n/user/role_update.do",//查询已授权的角色
    accredit:"/n/user/accredit.do",//授权保存
    
    //权限管理
    permissionTreeLoad:'/n/permission/permission_tree_load.do',//权限树加载
    permissionMenuAddsub:'/n/permission/permission_save.do',//权限新增
    permissionMenuUpdate:'/n/permission/permission_update.do',//权限修改
    permissionQuery:'/n/permission/permission_query.do',//权限详情
    permissionDelete:'/n/permission/permission_delete.do',//权限删除
    permissionButtonAssociate:"/n/permission/permission_button_associate.do",//权限关联按钮
    permissionButtonLst:"/n/permission/permission_button_list.do",//获取已关联未关联按钮列表
    
    //角色管理
    roleDelete:'/n/role/delRole.do',//删除角色
    roleQueryRoleLst:'/n/role/queryRoleList.do',//查询角色列表
    roleFirstRoleQueryLst:'/n/role/fristRolequeryList.do',//查询一级角色列表
    roleMultiRoleQueryLst:"/n/role/multiRolequeryList.do",//查询多级角色列表
    roleSaveRole:'/n/role/saveRole.do',//角色新增
    roleUpdateRole:'/n/role/updateRole.do',//角色修改
    roleEditRole:'/n/role/editRole.do',//角色详情

    //组织机构
    addorg:'/n/org/addorg.do',//新增
    saveorg:'/n/org/saveorg.do',//修改
    editorg:'/n/org/editorg.do',//详情
    delorg:'/n/org/delorg.do',//删除

    //技能管理
    skillQuery:'/q/skillInformation/queryList.do',//技能查询
    skillAdd:'/n/skillInformation/skillInformationAdd.do',//技能新增
    skillUpdate:'/n/skillInformation/skillInformationUpdate.do',//技能修改
    skillDel:'/n/skillInformation/skillInformationDel.do',//技能删除（待定，老系统没有此功能）

    //技能组
    skillGroupQuery:'/q/skillSets/queryskillSetsList.do',//查询技能组
    skillListQuery:'/q/skillSets/querySkillIcoll.do',//新增时，查询技能组进行关联
    skillGroupAdd:'/n/skillSets/skillSetsAdd.do',//新增技能组
    skillGroupChange:'/q/skillSets/querySkillList.do',//修改技能组时，查询待关联和已关联列表
    skillGroupUpdate:'/q/skillSetsWrite/update.do',//修改技能组
    skillGroupDelete:'/q/skillSetsWrite/delSkillBagInfo.do',//删除技能组


    //参数管理
    paramQuery:'/q/paramManage/queryParamList.do',//参数查询
    //paramDetail:'/q/paramRead/queryParamDetail.do',//参数详情查询
    paramAdd:'/q/paramManage/saveParamManage.do',//参数新增
    paramUpdate:'/q/paramManage/updateParamManage.do',//参数修改
    paramDel:'/q/paramManage/delParamManage.do',//参数删除
    checkParamCode:'/q/paramManage/checkParamCode.do',//参数编码校验

    //方案管理
    schemeQueryData:'/n/schemeConfig/schemeQuery.do',//方案列表
    schemeQueryAdd:'/n/schemeConfig/schemeAdd.do',//方案新增
    schemeModifyChange:'/n/schemeConfig/schemeModify.do',//方案新增
    schemeModifyDelete:'/n/schemeConfig/schemeDelete.do',//方案删除
    questionQuery:'/n/schemeConfig/questionQuery.do',//方案必答题

    //策略配置
    Strategy_permissionTreeList:'/n/strategy/permissionTreeList.do',//权限树
    addStrategy:'/n/strategy/addStrategy.do',//新增
    saveStrategy:'/n/strategy/saveStrategy.do',//修改
    delStrategy:'/n/strategy/delStrategy.do',//删除
    editStrategy:'/n/strategy/editStrategy.do',//详情

    //业务参数重载
    overloadQuery:'/q/yParamOverloading/queryList.do',//重载项查询
    overloadResult:'/q/yParamOverloading/yParamOverLoading.do',//重载结果

    //鉴权URL
    authUrlOperate:'/q/permissionUrl/authUrlOperate.do',//操作
    authUrlQuery:'/q/permissionUrl/authUrlQuery.do',//查询
    //permissionTree:'/q/permission/permission_tree_load.do',//权限树

    //操作员信息管理
    operatorInfo:'/q/agent/agentListQuery.do',//操作员查询
    relSkillGroup:'/q/agent/relSkillSets.do',//关联技能组合（增加技能组合列表页面的确定按钮）
    multiCancelRelSkill:'/q/agent/agentsUnbundSkillSets.do',//批量取消关联技能组合
    multiOperatorRelSkill:'/q/agent/agentsBundSkillSets.do',//批量操作员关联技能组合
    operatorRelSkill:'/q/agent/agentSkillQuery.do',//操作员已关联技能列表(点击关联技能组合按钮)
    unrelSkill:'/q/agent/skillSetsList.do',//未关联技能组合列表(增加技能组合列表)
    cancelRelSkill:'/q/agent/unbundSkillSets.do',//取消关联技能组合（点击保存）

    //行政管理
    dutyQuery:'/q/duty/queryList.do',//行政列表信息
    addDuty: '/q/duty/addDuty.do',//新增行政数据信息
    updateDuty:'/q/duty/updateDuty.do',//修改行政数据信息
    delDuty:'/q/duty/delDuty.do',//删除行政数据信息
    queryDetail:'/q/duty/queryDetail.do',//查询行政数据详情

    //坐席分类
    querySkillTeamList:'/q/skillTeam/querySkillTeamList.do',//坐席分类列表
    saveOrUpdateSkillTeam:'/q/skillTeam/saveOrUpdateSkillTeam.do',//坐席分类新增/修改
    delSkillTeam:'/q/skillTeam/delSkillTeam.do',//坐席分类删除

    //话术维护
    getThemePointList:'/q/themePoint/getThemePointList.do',//详情
    updateThemePointList:'/q/themePoint/updateThemePointList.do',//保存

    //一对一专属坐席服务名单
    queryPrivateAgentList:'/q/privateAgent/queryPrivateAgentList.do',//查询
    saveOrUpdatePrivateAgent:'/q/privateAgent/saveOrUpdatePrivateAgent.do',//保存和修改
    deletePrivateAgent:'/q/privateAgent/deletePrivateAgent.do',//删除

    //错误信息维护
    queryErrorInfoList:'/q/errorInfo/queryErrorInfoList.do',//查询
    saveErrorInfo:'/q/errorInfo/saveErrorInfo.do',//新增
    updateErrorInfo:'/q/errorInfo/updateErrorInfo.do',//修改
    delErrorInfo:'/q/errorInfo/delErrorInfo.do',//删除
    queryErrorInfo:'/q/errorInfo/queryErrorInfo.do',//详情

    //北京号段维护
    phoneNumQuery:'/q/bjPhoneNumMaintain/phoneNumQuery.do',//号段查询
    phoneNumAdd:'/q/bjPhoneNumMaintain/phoneNumAdd.do',//号段新增
    phoneNumUpdate:'/q/bjPhoneNumMaintain/phoneNumUpdate.do',//号段修改
    phoneNumDel:'/q/bjPhoneNumMaintain/phoneNumDel.do',//号段删除

    //Redis重载
    initRedisSysInfo:'/q/cacheInit/initRedisSysInfo.do',//Redis重载

    //欺诈黑名单
    queryFraudBlackList:'/q/fraudBlackList/queryFraudBlackList.do',//Redis重载

    





    //////////////////////////////张文琪
    //新员工专属客户
    exclCstQuery:'/q/newEmployeeExclCst/exclCstQuery.do',//专属客户查询
    exclCstAdd:'/q/newEmployeeExclCst/exclCstAdd.do',//专属客户新增
    exclCstUpdate:'/q/newEmployeeExclCst/exclCstUpdate.do',//专属客户修改
    exclCstDel:'/q/newEmployeeExclCst/exclCstDel.do',//专属客户删除


    //监管黑名单
    querySuperviseBlackList:'/q/superviseBlack/querySuperviseBlackList.do',//监管黑名单查询列表
    saveSuperviseBlack:'/q/superviseBlack/saveSuperviseBlack.do',//监管黑名单新增
    delSuperviseBlackId:'/q/superviseBlack/delSuperviseBlackId.do',//监管黑名单删除
    updateSuperviseBlack:'/q/superviseBlack/updateSuperviseBlack.do',//修改黑名单

    //借记卡VIP
    queryDebitVipList:'/q/debitVip/queryDebitVipList.do',//借记卡VIP查询
    saveDebitVipList:'/q/debitVip/saveDebitVipList.do',//借记卡VIP新增
    updateDebitVip:'/q/debitVip/updateDebitVip.do',//借记卡VIP修改
    delDebitVip:'/q/debitVip/delDebitVip.do',//借记卡VIP删除

    //贷记卡VIP
    queryCreditVipList:'q/creditVip/queryCreditVipList.do',//借记卡VIP查询
    saveCreditVipList:'q/creditVip/saveCreditVipList.do',//借记卡VIP新增
    updateCreditVip:'q/creditVip/updateCreditVip.do',//借记卡VIP修改
    delCreditVip:'q/creditVip/delCreditVip.do',//借记卡VIP删除





}