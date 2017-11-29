$(function(){
    //实现左侧侧边栏二级分类的显示与隐藏
    $(".child").prev().on("click", function () {
        $(this).next().slideToggle();
    });

    //实现侧边栏的显示与隐藏
    $(".icon_menu").on("click",function(){
        // 让左侧侧边栏移除屏幕（负自身的宽度）
        $(".lt_aside").toggleClass("now");
        //把右侧的padding取消
        $(".lt_main").toggleClass("now");
    })

    //实现退出功能
    $(".icon_logout").on("click",function(){
        // console.log(111);
        //（1）显示模态框
        $("#logoutModal").modal("show");
        //（2）连接后台给出的借口，退出
        $(".btn_logout").off().on("click", function () {
            
            //发送ajax请求，告诉服务器，需要退出
            $.ajax({
              type:"get",
              url:"/employee/employeeLogout",
              success:function(data) {
                if(data.success){
                  //退出成功，才跳转到登录页面
                  location.href = "login.html";
                }
              }
            });
          });
    })
})