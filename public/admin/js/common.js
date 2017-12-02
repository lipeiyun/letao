//进度条功能
//禁用进度环
NProgress.configure({ showSpinner: false });

//注册一个全局的ajaxStart事件，所有的ajax在开启的时候，会触发这个事件
$(document).ajaxStart(function () {
  //开启进度条
  NProgress.start();
});

$(document).ajaxStop(function () {
  //完成进度条
  setTimeout(function () {
    NProgress.done();
  }, 500);
});




//(1)实现左侧侧边栏二级分类的显示与隐藏(点击分类管理让二级菜单显示与隐藏)
// $(".child").prev().on("click", function() {
//   $(this).next().slideToggle();
// });

$(".cate").on("click", function() {
  $(".child").slideToggle();
});

//(2)点击右侧左上角图标，让侧边栏显示与隐藏
$(".icon_menu").on("click", function() {
  console.log(111);
  $(".lt_aside").toggleClass("now");
  $(".lt_main").toggleClass("now");
});

//(3)退出登录
$(".icon_logout").on("click", function() {
  console.log(1111);
  //(i)显示模态框
  $("#logoutModal").modal("show");
  //(ii)点击模态框的退出按钮，发送ajax请求退出登录
  $(".btn_logout").on("click", function() {
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      success: function(data) {
        // console.log(data);
        location.href = "login.html";
      }
    });
  });
});

//(4)非登陆页面，判断当前用户是否是登录了，如果登录了，就继续，如果没登陆，需要跳转到登录页面。
if(location.href.indexOf("login.html") == -1){
  $.ajax({
    type:"get",
    url:"/employee/checkRootLogin",
    success:function (data) {
      if(data.error === 400){
        //说明用户没有登录，跳转到登录页面
        location.href = "login.html";
      }
    }
  })
}



