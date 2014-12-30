/**
 * XULSchoolChrome namespace.
 */
if ("undefined" == typeof(XULSchoolChrome)) {
  var XULSchoolChrome = {};
};

/**
 * Controls the browser overlay for the Hello World extension.
 */
XULSchoolChrome.BrowserOverlay = {
  /**
   * Says 'Hello' to the user.
   */
  sayHello : function(aEvent) {
    alert('Hello!');
  }
};

//初始化工作：监听页面的onload事件
XULSchoolChrome.init = function(){
    var appcontent = document.getElementById("appcontent");   // browser
    if(appcontent){
      appcontent.addEventListener("DOMContentLoaded", XULSchoolChrome.onPageLoad, true);
    }
    var messagepane = document.getElementById("messagepane"); // mail
    if(messagepane){
      messagepane.addEventListener("load", function(event) { XULSchoolChrome.onPageLoad(event); }, true);
    }
}

//处理onload事件，若页面不为空则调用findCourse作进一步处理
XULSchoolChrome.onPageLoad = function(aEvent) {
    var doc = aEvent.originalTarget; // doc is document that triggered "onload" event
    // do something with the loaded page.
    // doc.location is a Location object (see below for a link).
    // You can use it to make your code executed on certain pages only.
    if (doc)
    {
    	var list=doc.getElementById('courseList');	//判断是否为所需页面
		if (!list) return;
		
		XULSchoolChrome.lastPage=doc;	//将页面缓存，便于后续处理
		
		var db = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);	//获取Firefox的数据库
		var preferredCourse=db.getComplexValue('extensions.xulschoolhello.prefCourse',
      Components.interfaces.nsISupportsString).data;	//根据preference.xul中定义的选项名获取对应数据（课程名）
		if (!preferredCourse || preferredCourse=='')
		{
			alert('未设置课程。请先在插件“首选项”中设置课程！');
			return;
		}
		XULSchoolChrome.course=preferredCourse;			
    	
    	if (XULSchoolChrome.timer)	//若已有定时器，则先清除之
    	{
    		clearInterval(XULSchoolChrome.timer);
    	}
    	XULSchoolChrome.timer=setInterval(XULSchoolChrome.findCourse,500);	//设置定时器，每隔0.5秒检查是否已经取得课程列表
	}
}

//查找可能的课程列表并自动提交
XULSchoolChrome.findCourse = function(){	
	
	var table=XULSchoolChrome.lastPage.getElementById('tbCourseList');
	if (!table) return;
	
	clearInterval(XULSchoolChrome.timer);	//检测到课程列表后就停止计时器
	XULSchoolChrome.timer=null;
	
	//TODO:根据preferredCourse查找课程ID，并提交
	//参考：体育选课.htm
	
	var p=table.innerHTML.indexOf(XULSchoolChrome.course);	//先查找课程名所在位置
	if (p<0)
	{
		alert('未找到指定课程！请手动选择课程！');
		return;
	}
	
	var tag1='javascript:selectedClass(' , tag2=')';
	p1=table.innerHTML.indexOf(tag1,p);	//再定位紧随其后的课程ID
	p2=table.innerHTML.indexOf(tag2,p1);
	var courseID=table.innerHTML.substr(p1+tag1.length,p2-p1-tag1.length);	//截取课程ID
	if (courseID=='')
	{
		alert('查找课程失败！请手动选择课程！');
		return;
	}
	
	var baseURL=XULSchoolChrome.lastPage.URL;	//页面地址
	baseURL=baseURL.substr(0,baseURL.indexOf('/jiaowu'));	//截取服务器地址
	var pars = 'method=addGymSelect&amp;classId=' + courseID;	//提交选择
		var myAjax = new Ajax.Request(
			baseURL + '/jiaowu/student/elective/selectCourse.do',
			{
				method : 'post',
				parameters : pars,
				onComplete : XULSchoolChrome.onSelectedEnd
			}
		);
}


//以下代码根据原网页函数改写
XULSchoolChrome.onSelectedEnd=function(response){
		XULSchoolChrome.lastPage.getElementById('courseList').disabled = false;
		XULSchoolChrome.lastPage.getElementById('courseOperation').innerHTML = response.responseText;
		/*
		initClassList();
		if(document.getElementById('errMsg')!=null){
			alert(document.getElementById('errMsg').title);
		}
		*/
		alert('已自动选择课程，请刷新页面以查看结果。');
}
XULSchoolChrome.handle = {
		onComplete: function(){
			if(Ajax.activeRequestCount == 0){
				XULSchoolChrome.lastPage.getElementById('operation').style.visibility = "hidden";
			}
		}
}


window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    XULSchoolChrome.init();  
},false);
Ajax.Responders.register(XULSchoolChrome.handle);	//监听响应信息
