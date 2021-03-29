<template>
	<div style="padding:20px 30px;">
		<h6>edition:2019-06-20 v1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>UCS配置的发卡日期{{fakaTime}}（请拿此时间与发卡日期对比，如不一致，烦请联系科技修改。.）</span></h6>
		<div class="ucs-tab">
			<div class="m-portlet__head-tools ucs-tab-head">
				<ul class="nav nav-tabs m-tabs m-tabs-line m-tabs-line--left m-tabs-line-danger" role="tablist">
					<li class="nav-item m-tabs__item">
						<a :class="['nav-link m-tabs__link',tab==tabType.a?'active':'','theme-'+theme]" @click="changTab(tabType.a)">
							表格
						</a>
					</li>
					<li class="nav-item m-tabs__item">
						<a :class="['nav-link m-tabs__link',tab==tabType.b?'active':'','theme-'+theme]" @click="changTab(tabType.b)">
							表单
						</a>
					</li>
					<li class="nav-item m-tabs__item">
						<a :class="['nav-link m-tabs__link',tab==tabType.c?'active':'','theme-'+theme]" @click="changTab(tabType.c)">
							公共类
						</a>
					</li>
					<li class="nav-item m-tabs__item">
						<a :class="['nav-link m-tabs__link',tab==tabType.d?'active':'','theme-'+theme]" @click="changTab(tabType.d)">
							公共函数
						</a>
					</li>
				</ul>
			</div>
			<div class="ucs-tab-body clear">
				<div class="ucs-tab-body-list" v-show="tab==tabType.a">
					<h2>表格一</h2>
					<table class="table-public">
						<caption>公共表格标题</caption>
						<thead>
							<tr>
								<th class="width1">序</th>
								<!--width1:50px,width2:70px,width3:90px,width4:110px,width5:130px-->
								<th>标题</th>
								<th>公告类别</th>
								<th class="width3">发布人 <a @click="abc('creatorName',1)" class="rise" title="升序"></a> <a @click="abc('creatorName',2)" class="drop" title="降序"></a></th>
								<th class="width4">生效时间</th>
								<th class="width4">截止时间</th>
								<th>紧急程度 <a @click="abc('emergencyLevel',1)" class="rise" title="升序"></a> <a @click="abc('emergencyLevel',2)" class="drop" title="降序"></a></th>
								<th class="width3">操作</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item,index) in tagsList">
								<td class="bold">{{index+1}}</td>
								<td class="text-l">{{item.title}}</td>
								<!--text-l:(text-align:left),text-r:(text-align:right)-->
								<td>{{item.noticeType}}</td>
								<td>{{item.creatorName}}</td>
								<td>{{item.startTimeString}}</td>
								<td>{{item.endTimestrString}}</td>
								<td>{{item.emergencyLevel}}</td>
								<td><a style="cursor: pointer;">查看</a></td>
							</tr>
						</tbody>
					</table>
					<br>
					<h2>表格二</h2>
					<table class="table-public table-public-left">
						<caption>表格左右结构</caption>
						<thead>
							<tr>
								<th>证件类型</th>
								<td>军官证</td>
								<th>证件号码</th>
								<td>430981198736632365</td>
								<th>卡号</th>
								<td>430981198736632365</td>
								<th>手机号</th>
								<td>13261168097</td>
							</tr>
							<tr>
								<th>证件类型</th>
								<td>军官证</td>
								<th>证件号码</th>
								<td>430981198736632365</td>
								<th>卡号</th>
								<td>430981198736632365</td>
								<th>手机号</th>
								<td>13261168097</td>
							</tr>
							<tr>
								<th>证件类型</th>
								<td>军官证</td>
								<th>证件号码</th>
								<td>430981198736632365</td>
								<th>卡号</th>
								<td>430981198736632365</td>
								<th>手机号</th>
								<td>13261168097</td>
							</tr>
							<tr>
								<th>证件类型</th>
								<td>军官证</td>
								<th>证件号码</th>
								<td>430981198736632365</td>
								<th>卡号</th>
								<td>430981198736632365</td>
								<th>手机号</th>
								<td>13261168097</td>
							</tr>
						</thead>
					</table>
					<br>
					<h2>表格三</h2>					
					<table class="table-public table-public-left">
						<thead>
							<tr>
								<th style="width:25%">情形选择</th>
								<th style="width:25%">问题选项</th>
								<th style="width:25%">问题描述</th>
								<th style="width:25%">不满意问题是否转化</th>
							</tr>
						</thead>
						<tbody v-for="(item,index) in 2">
							<td>第{{index+1}}层</td>
							<td colspan="3" style="padding:0;">
								<table style="width:100%;padding:0;margin:0;table-layout:fixed;" border="0">
									<tbody v-for="it in 2">
										<tr>
											<td rowspan="6">rowspan-{{it}}</td>
										</tr>
										<tr v-for="(item1,index1) in 2">
											<td>item-5-{{index+1}}-1 </td>
											<td>
												<label class="m-radio">
													<input type="radio" :name="'sex'+index" checked="checked" value="1">男<span></span>
												</label>
												<label class="m-radio">
													<input type="radio" :name="'sex'+index" value="2">女<span></span>
												</label>
											</td>
										</tr>
									</tbody>
								</table>

							</td>



							<!-- <tr>
							<td width="25%" rowspan="6">rowspan-5</td>
						</tr>
						<tr v-for="(item,index) in 5">
							<td width="25%">item-5-{{index+1}}-1 </td>
							<td width="25%">item-5-{{index+1}}-2</td>
						</tr> -->
							<!-- <tr>
							<td width="25%" rowspan="16">rowspan-15</td>
						</tr>
						<tr v-for="(item,index) in 15">
							<td width="25%">item-15-{{index+1}}-1 </td>
							<td width="25%">item-15-{{index+1}}-2</td>
						</tr> -->
						</tbody>
					</table>

				</div>
				<div class="ucs-tab-body-list" v-show="tab==tabType.b">
					<div class="ucs-form">
						<!--ucs-form-two代表两列，ucs-form-three代表三列，ucs-form-four代表四列-->
						<h2 class="ucs-form-title">信息表单一</h2>
						<dl class="ucs-form-head">
							<dt><label class="label">客户姓名</label>
								<div class="label-div"><input type="text" class="form-control m-input" value="" v-validate="'required'"
									 maxlength="35" data-vv-name="客户姓名" b-on:input="" placeholder="请输入" />
								</div>
							</dt>
							<dd><button type="button" @click="" class="btn btn-primary">查&nbsp;询</button>
								<input type="reset" @click="" class="btn" /></dd>
						</dl>
					</div>
					<div class="ucs-form ucs-form-border ucs-form-two">
						<!--ucs-form-two代表两列，ucs-form-three代表三列，ucs-form-four代表四列-->
						<h2 class="ucs-form-title">信息表单二</h2>
						<p>信息录入，按钮放表单下方</p>
						<form>
							<ul class="ucs-form-ul">
								<li>
									<label class="label">客户姓名</label>
									<div class="label-body"><input type="text" class="form-control m-input" value="" v-validate="'required'"
										 maxlength="35" data-vv-name="客户姓名" b-on:input="" placeholder="请输入" />
									</div>
								</li>
								<li>
									<label class="label">证件类型</label>
									<div class="label-body">
										<select class="form-control m-bootstrap-select" data-size="4" v-validate="'required'" placeholder="请选择证件类型">
											<option value="0">请选择证件类型</option>
											<option value='1'>身份证18位</option>
											<option value='2'>户口本</option>
											<option value='3'>军官证</option>
											<option value='4'>警官证</option>
											<option value='5'>士兵证</option>
											<option value='6'>文职证</option>
											<option value='7'>护照</option>
											<option value='8'>港澳证</option>
											<option value='9'>其他</option>
											<option value='91'>台湾居民居住证</option>
											<option value='92'>香港居民居住证</option>
											<option value='93'>澳门居民居住证</option>
											<option value='d'>身份证15位</option>
											<option value='j'>中国护照</option>
											<option value='k'>外国护照</option>
											<option value='m'>香港通行证</option>
											<option value='n'>澳门通行证</option>
											<option value='p'>台湾通行证或有效旅行证件</option>
										</select>
									</div>
								</li>
								<li>
									<label class="label">反显信息</label>
									<div class="label-body label-txt">是湖南人
									</div>
								</li>
								<li>
									<label class="label">性　　别</label>
									<div class="label-body"><label class="m-radio"><input type="radio" name="sex" checked="checked" value="1">男<span></span></label><label
										 class="m-radio"><input type="radio" name="sex" value="2">女<span></span></label></div>
								</li>
								<li>
									<label class="label">兴趣爱好</label>
									<div class="label-body"><label class="m-checkbox"><input type="checkbox" name="zhuqiu" checked="checked" value="1">篮球<span></span></label><label
										 class="m-checkbox"><input type="checkbox" name="lanqiu" value="2">足球<span></span></label><label class="m-checkbox"><input
											 type="checkbox" name="lanqiu" value="2">台球<span></span></label></div>
								</li>
								<!-- <li>
									<label class="label">开始时间</label>
									<div class="label-body">
										<div class="input-group date form_datetime beginTime" data-date-format="yyyy-mm-dd" data-link-field="dtp_input2">
											<input type="text" value="" class="form-control startDate" size="16" readonly v-validate="'required'"
											 placeholder="请选择开始时间" />
											<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>
											<span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>
										</div>
										<input type="hidden" id="dtp_input2" value="" />
									</div>
								</li>
								<li>
									<label class="label">结束时间</label>
									<div class="label-body">
										<div class="input-group date form_datetime endTime" data-date-format="yyyy-mm-dd" data-link-field="dtp_input3">
											<input type="text" value="" class="form-control endDate" size="16" readonly v-validate="'required'"
											 placeholder="请选择结束时间" />
											<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>
											<span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>
										</div>
										<input type="hidden" id="dtp_input3" value="" />
									</div>
								</li> -->
								<li>
									<label class="label">特殊金额</label>
									<div class="label-body label-txt"><input type="text" class="special-input" value="" v-validate="'required'"
										 maxlength="35" data-vv-name="客户姓名" b-on:input="" placeholder="请输入" />
									</div>
								</li>
								<li>
									<label class="label">操作区</label>
									<div class="label-body label-txt"><a style="cursor: pointer;" class="button-blank mr20">发送短信</a><a style="cursor: pointer;"
										 class="button-blank mr20">发送邮件</a>
									</div>
								</li>
								<li class="form-li-one">
									<label class="label">留言板</label>
									<div class="label-body"><textarea class="form-control input-group" v-model="formObj.msg" maxlength="200" v-vueMaxLength="{max:200,msg:'超过最大长度'}" rows="7"></textarea>
									<p class="tar"><span class="float-l red error-message"></span>{{200-strLenthByByte(formObj.msg)}}/200</p>
									</div>
								</li>
							</ul>
							<div class="ucs-form-submit">
								<button type="button" @click="" class="btn btn-primary">提&nbsp;交</button>
								<button type="button" @click="" class="btn">取&nbsp;消</button>
							</div>
						</form>
					</div>
						<div class="ucs-form ucs-form-border ucs-form-three ucs-form-search">
						<!--ucs-form-two代表两列，ucs-form-three代表三列，ucs-form-four代表四列-->
						<h2 class="ucs-form-title">信息表单三</h2>
						<p>信息查询，按钮放表单右方</p>
						<form class="pb20">
							<ul class="ucs-form-ul">
								<li>
									<label class="label">客户姓名</label>
									<div class="label-body"><input type="text" class="form-control m-input" value="" v-validate="'required'"
										 maxlength="35" data-vv-name="客户姓名" b-on:input="" placeholder="请输入" />
									</div>
								</li>
								<li>
									<label class="label">反显信息</label>
									<div class="label-body"><input type="text" class="form-control m-input" value="" v-validate="'required'"
										 maxlength="35" data-vv-name="客户姓名" b-on:input="" placeholder="请输入" />
									</div>
								</li>
								<li>
									<label class="label">特殊金额</label>
									<div class="label-body"><input type="text" class="form-control m-input" value="" v-validate="'required'"
										 maxlength="35" data-vv-name="客户姓名" b-on:input="" placeholder="请输入" />
									</div>
								</li>
								<li>
									<label class="label">客户姓名</label>
									<div class="label-body"><input type="text" class="form-control m-input" value="" v-validate="'required'"
										 maxlength="35" data-vv-name="客户姓名" b-on:input="" placeholder="请输入" />
									</div>
								</li>
								<li>
									<label class="label">反显信息</label>
									<div class="label-body"><input type="text" class="form-control m-input" value="" v-validate="'required'"
										 maxlength="35" data-vv-name="客户姓名" b-on:input="" placeholder="请输入" />
									</div>
								</li>
								<li>
									<label class="label">特殊金额</label>
									<div class="label-body"><input type="text" class="form-control m-input" value="" v-validate="'required'"
										 maxlength="35" data-vv-name="客户姓名" b-on:input="" placeholder="请输入" />
									</div>
								</li>
							</ul>
							<ul class="ucs-form-ul-right">
								<li class="pl10 pt5">
									<button type="button" @click="" class="btn btn-primary">查&nbsp;询</button>
									<button type="button" class="btn ml10" >取&nbsp;消</button></li>
							</ul>
							<div class="clear"></div>
						</form>
					</div>
				</div>
				<div class="ucs-tab-body-list" v-show="tab==tabType.c">
					<table class="table-public table-public-left">
						<thead>
							<tr>
								<th>公共外边距</th>
								<td><code>.m10{margin:10px;}<br>
								.mt10{margin-top:10px;}<br>
								.mr10{margin-right:10px;}<br>
								.mb10{margin-bottom:10px;}<br>
								.ml10{margin-left:10px;}<br>
								.m20{margin:20px;}<br>
								.mt20{margin-top:20px;}<br>
								.mr20{margin-right:20px;}<br>
								.mb20{margin-bottom:20px;}<br>
								.ml20{margin-left:20px;}<br>
								</code>
								</td>
								<th>公共内边距</th>
								<td><code>
								.p10{padding:10px;}<br>
								.pt10{padding-top:10px;}<br>
								.pr10{padding-right:10px;}<br>
								.pb10{padding-bottom:10px;}<br>
								.pl10{padding-left:10px;}<br>
								.p20{padding:20px;}<br>
								.pt20{padding-top:20px;}<br>
								.pr20{padding-right:20px;}<br>
								.pb20{padding-bottom:20px;}<br>
								.pl20{padding-left:20px;}
								</code>
								</td>
							</tr>
							<tr>
								<th>文本定义区</th>
								<td><code>.fz12{
									font-size:12px;
								}<br>
								.fz13{
									font-size:13px;
								}<br>
								.fz14{
									font-size:14px;
								}<br>
								.fz15{
									font-size:15px;
								}<br>
								.fz16{
									font-size:16px;
								}<br>
								.fz18{
									font-size:18px;
								}<br>

								.bold{
									font-weight: bold;
								}<br>
								.normal{
									font-weight: normal;
								}
								</code>
								</td>
								<th>颜色定义区</th>
								<td><code>
								.red{
									color:#F54F4F;
								}
								</code>
								</td>
							</tr>
						</thead>
					</table>
				</div>
				<div class="ucs-tab-body-list" v-show="tab==tabType.d">
					<table class="table-public table-public-left">
						<thead>
							<tr>
								<th>chineseZodiac<br></th>
								<td>/**<br>
									* 年份转生肖<br>
									* dateVal：日期 <br>
									* @chineseZodiac {*} <br>
									**/
								</td>
								<th>avayaMonitor<br></th>
								<td>/**<br>
									* AVAYA监听方法<br>
									* type：监听位置 <br>
									* ucsChannel：渠道类型 <br>
									* @softParam {*} avaya上送对象<br>
									*/
								</td>
							</tr>
							<tr>
								<th>CSRtransIVR<br></th>
								<td>//CSR转IVR
									/**<br>
									* IVR_TRANSFER_ID：IVR节点 <br>
									* @custInfo {<br>
									　　CALLER:"777776",//主叫号码<br>
									　　ID_TYPE："",//证件类型<br>
									　　ID_NO："",//证件号<br>
									　　CARD_NO："",//卡号<br>
									*} IVR上送对象<br>
									*/
								</td>
								<th>transferIvrForPw<br></th>
								<td>//验证密码
									/**<br>
									*IVR_PW_TYPE:IVR代收类型 <br>
									* IVR_TRANSFER_ID：IVR节点 <br>
									* @custInfo {<br>
									　　CALLER:"777791",//主叫号码<br>
									　　ID_TYPE："",//证件类型<br>
									　　ID_NO："",//证件号<br>
									　　CARD_NO："",//卡号<br>
									　　TRANSFER_FROM:"",//座席ID<br>
									　　RECEPTION_ID:"",//接待单ID<br>
									　　IS_NEW_CALL:"",//是否新电话<br>
									　　CALL_LOG_ID:""，//日志流水号<br>
									*} IVR上送对象<br>
									*/
								</td>
							</tr>
							<tr>
								<th>dynamicSort<br></th>
								<td>/**
									* @method dynamicSort 动态排序<br>
									* @param {Object} obj 排序对象 <br>
									* @param {string} name 排序名称<br>
									* @param {string} type [type=1]升序 [type=2]降序 <br>
									* @param {boolean} num [num=true]数字 [num=false]非数字<br>
									*/
								</td>
								<th>strLenthByByte</th>
								<td>功能：取字符串的字节长度. 即英文算一个，中文算两个字节<br>
输入：str    要计算字节长度的字符串<br>
输出：字符串的字节长度
								</td>
							</tr>
						</thead>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'public',
		data() {
			return {
				tab: 1,
				tabType: {
					a: 1,
					b: 2,
					c: 3,
					d: 4,
					e: 5
				},
				formObj:{
					msg:""
				},
				tagsList: [
					{
						"title": "《UCS系统》上线时间通知",
						"noticeType": "业务/流程变更",
						"creatorName": "张三",
						"startTimeString": "2019-02-25",
						"endTimestrString": "2099-12-31",
						"emergencyLevel": "1非常紧急"
					},
					{
						"title": "《UCS系统》上线时间通知",
						"noticeType": "业务/流程变更",
						"creatorName": "李四",
						"startTimeString": "2019-02-25",
						"endTimestrString": "2099-12-31",
						"emergencyLevel": "2非常紧急"
					},
					{
						"title": "《UCS系统》上线时间通知",
						"noticeType": "业务/流程变更",
						"creatorName": "王五",
						"startTimeString": "2019-02-25",
						"endTimestrString": "2099-12-31",
						"emergencyLevel": "2非常紧急"
					},
					{
						"title": "《UCS系统》上线时间通知",
						"noticeType": "业务/流程变更",
						"creatorName": "赵六",
						"startTimeString": "2019-02-25",
						"endTimestrString": "2099-12-31",
						"emergencyLevel": "3非常紧急"
					},
					{
						"title": "《UCS系统》上线时间通知",
						"noticeType": "业务/流程变更",
						"creatorName": "张磊",
						"startTimeString": "2019-02-25",
						"endTimestrString": "2099-12-31",
						"emergencyLevel": "5非常紧急"
					}
				],
				contentObj: {
					height: "200",
					innerWidth: "1800",
					titles: [
						{ name: "序", width: "1" },
						{ name: "名称", width: "1" },
						{ name: "生成时间", width: '4' },
						{ name: "产品", width: '3' },
						{ name: "卡号", width: '4' },
						{ name: "状态", width: '2' },
					],
					foot: true,
					content: '',
					caption: "表格表头固定，内容滚动",

                },
                ucsTime: '',
                fakaTime: '',
			}
		},
		computed: {
			theme: function () {
				let _theme = this.$store.state.userSession.theme;//用户主题色
				return _theme;
			},
		},
		mounted() {
			$('.m-bootstrap-select').selectpicker("refresh");
			// $(".beginTime, .endTime").datetimepicker({
			// 	minView: 'month',
			// 	language: 'zh-CN',
			// 	todayBtn: 1,
			// 	autoclose: true,
			// 	format: 'yyyy-mm-dd',
			// 	pickerPosition: "bottom-center",
			// 	weekStart: 0,//从周日开始
			// 	// endDate:new Date(),//结束日期
			// 	todayHighlight: 1,
			// 	startView: 2,
			// 	forceParse: 0,
			// 	showMeridian: 1
			// });
			// $(".beginTime").on("changeDate", function (ev) {
			// 	$(".endTime").datetimepicker("setStartDate", ev.date);
			// }.bind(this));
			// $(".endTime").on("changeDate", function (ev) {
			// 	$(".beginTime").datetimepicker("setEndDate", ev.date);
            // }.bind(this));
            this.getSysDate();
		},
		methods: {
			changTab(e) {
				this.tab = e;
			},
			abc(name, type, num) {
				this.tagsList = dynamicSort(this.tagsList, name, type, num);
			},
            getSysDate(){
                this.$MainAjax.doPost(urlConfig.transbase.getSystemDate,{format: 'yyyy-MM-dd'},1).then(req =>{
                    if(req.reply){
                        this.ucsTime = req.reply.ucsTime;
                        this.fakaTime = req.reply.fakaTime;
                    }
                });
            },
			strLenthByByte(str){
				return strLenthByByte(str);
			},
		},
		watch:{
			formObj:{
				handler(newValue,oldValue){
					if(this.strLenthByByte(newValue.msg)>200){
						//console.log(this.formObj.msg)
						this.formObj.msg = oldValue.msg
					}
            	},
				deep:true
			}
		}

	}
</script>
<style>
	.ucs-tab-body-list h2 {
		font-weight: bold;
		font-size: 16px;
	}
</style>