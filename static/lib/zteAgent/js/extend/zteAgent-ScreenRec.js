/**
 * ZteAgent扩展功能之录屏服务
 * 封装录屏功能方法
 */
(function(ZteAgent)
{
    ZteAgent.extend(
    {
	/**
	*组件是否实例化 
	*/
	isInit:false,
	/**
	 * 是否正在录屏
	 */
	isRecording:false,
	/**
	*第一屏
	*/
	screenIndex:1,
	/**
	*是否录制音频标识，0 - 不录制声音（缺省）；1 - 录制声音
	*/
	withAudio:0,
	/**
	 *文件上传信息
	 */
	uploadInfo:"",

	/**
	*本地录制文件存放路径
	*/
	initPath:null,
	
	/**
	*初始化录屏
	*/
	initScreenRec:function()
	{
		var  thisobj = this;
		thisobj.isInit = true;
		
		//初始化注册事件
		ZteAgent.regAINFEvent("OnBeginScreenRecSuccess", function(){
			thisobj.isRecording = true;
		});
		ZteAgent.regAINFEvent("OnBeginScreenRecFailure", function(){
			thisobj.isRecording = false;	
		});
		ZteAgent.regAINFEvent("OnStopScreenRecSuccess", function(){
		   	thisobj.isRecording = false;	
		});
		ZteAgent.regAINFEvent("OnStopScreenRecFailure", function(){
		   	thisobj.isRecording = true;	
		});
	},
	
	/**
	*开始录屏
	* pixel:录制屏幕序号 录屏大小，例"640*320"
	* screenframe ： 帧率
	* idno：流水号
	*/
	startRec:function(pixel,screenframe,idno)
	{
		var  thisobj = this;
		if(!thisobj.isLogined)
		{
			thisobj.log("agent not logined","error");
			return;
		}
		if(!thisobj.isInit)
		{
			thisobj.log("screen  not init","error");
			return;
		}
		if(thisobj.isRecording)
		{
			thisobj.log("recording，startRec fail","error");
			return;
		}
		thisobj._getUploadInfo(function(_uploadInfo){
			thisobj._initFilePath(function(_recpath)
			{
				thisobj.initPath = _recpath ;
				thisobj.log("local initPath:" + _recpath,"info");
				
				var filename = null;
				if(!idno){
					filename = zteUtils.dateFormatStr(new Date(),"yyyyMMddhhmmss") + ".wmv"; 
				}else
				{
					filename = idno + ".wav"
				}
				var filePath =  _recpath +"/" + filename;
				ZteAgent.invokeAINF("ScreenRec", ["Start:" + encodeURIComponent(filePath),thisobj.screenIndex, thisobj.withAudio, encodeURIComponent(_uploadInfo),pixel,screenframe,idno]);	
			});
		});
	},
	/**
	*停止录屏
	*/
	endRec:function(){
		var  thisobj = this;
		if(!thisobj.isLogined)
		{
			thisobj.log("agent not logined","error");
			return;
		}
		if(!thisobj.isInit)
		{
			thisobj.log("screen  not init","error");
			return;
		}
		if(!thisobj.isRecording)
		{
			thisobj.log("not recording","error");
			return;
		}
		ZteAgent.invokeAINF("ScreenRec", ["stop"]);
	},
	
	/**
	*组装上传信息
	*/
	_getUploadInfo:function(fun){
		var uploadInfo = "isupload=1|<";
			WebAgent.invoker("GetConfigFileString",["uploadrec", "screenrec_url","",".\\conf\\zxcc.ini",2], function(httpurl){
				//httpurl  vrm的上传ip
				uploadInfo = uploadInfo + httpurl + "#"
				WebAgent.invoker("GetConfigFileString",["uploadrec", "recinitpath","",".\\conf\\zxcc.ini",2], function(recinitpath){
				    //recinitpath：文件的上传初始化路径
					uploadInfo = uploadInfo + recinitpath + "#"
					     //组装上传文件的相对路径
						var tmptime = zteUtils.dateFormatStr(new Date(),"yyyyMMddhhmmss"), tempdate =  zteUtils.dateFormatStr(new Date(),"yyyyMMdd"),filename = tmptime +".wmv";
						var vcid = ZteAgent.getAgtInfo().vcid,agtId = ZteAgent.getAgtInfo().agtId;	
						var recordpath = vcid+"/screenRec/"+tempdate+"/"+agtId+"/"+filename;
						
						uploadInfo = uploadInfo + recordpath + ">";
						uploadInfo = uploadInfo + "|starttime="+tmptime+"|compressmode=wav|enhanced=0";
						
						if(fun)fun( uploadInfo );	  
				});
			});
		
	},
	
	/**
	* 获取录屏文件本地存放路径
	*/
	_initFilePath:function(fun){
		WebAgent.invoker("GetConfigFileString",["sipphone", "recpath","",".\\conf\\zxcc.ini",2], function(recpath){	
			if(fun) fun(recpath);
		});
	}
    });
})(ZteAgent);