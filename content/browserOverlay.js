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
    if (doc) XULSchoolChrome.findCourse(doc);    
}

//查找可能的课程列表并自动提交
XULSchoolChrome.findCourse = function(doc){
	var table=doc.getElementById('tbCourseList');
	if (!table) return;
	
	var preferredCourse = 'XXX';
	//TODO:查找课程ID，并提交
	
}


window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    XULSchoolChrome.init();  
},false);
