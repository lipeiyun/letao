$(function() {
  var nowPage = 1;
  var pageSize = 5;
  var render = function() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: nowPage,
        pageSize: pageSize
      },
      success: function(data) {
        console.log(data);

        //渲染页面(将模板与数据绑定)
        var html = template("tpl", data);
        $("tbody").html(html);

        //渲染分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: nowPage, //当前页
          totalPages: Math.ceil(data.total / data.size), //总页数
          onPageClicked: function(event, originalEvent, type, p) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            nowPage = p;
            render();
          }
        });
      }
    });
  };
  render();

  //当点击操作中的禁用或者启用的按钮时，改变状态
  $("tbody").on("click", ".btn", function() {
    //  console.log(111);
    //获取用户id
    var uid = $(this)
      .parent()
      .data("id");
    console.log(uid);
    //获取是否停用的isDelete
    var isDelete = $(this).hasClass("btn-danger") ? "0" : "1";
    console.log(isDelete);

    //(1)显示模态框
    $("#userModal").modal("show");
    //(2)给确认按钮注册点击事件,发送ajax请求
    $(".btn_confirm").on("click", function(data) {
      $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: {
          id: uid,
          isDelete: isDelete
        },
        success: function(data) {
          //关闭模态框
          $("#userModal").modal("hide");
          //重新渲染页面
          render();
        }
      });
    });
  });
});
