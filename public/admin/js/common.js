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



