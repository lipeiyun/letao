$(function(){
  // currentPage:当前页码   pageSize:每页条数
  var nowPage = 1;
  var pageSize = 5;
  function render() {
    $.ajax({
      type:"get",
      url:"/user/queryUser",
      data:{
        page:nowPage,
        pageSize:pageSize,
      },
      success:function(data){
        // console.log(data);
        //渲染页面
        var html = template("tpl",data);
        $("tbody").html(html);
  
        //渲染分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:nowPage,//当前页
          totalPages:Math.ceil(data.total/data.size),//总页数
          onPageClicked:function(event, originalEvent, type,p){
            //为按钮绑定点击事件 page:当前点击的按钮值
            nowPage = p;
            // 修改之后需要重新渲染页面
            render();
          }
        });
      }
    })
  }
  // 打开页面就渲染一下页面
  render();


  //点击操作中的按钮btn，注册点击事件，改变状态(显示模态框，确认是否需要进行此操作)

  // 注意：模版渲染出来的,刚开始页面没有，找不到btn（用委托可以给未来的元素绑定事件）
  $("tbody").on("click",".btn",function(){
    //显示模态框
    $("#userModal").modal("show");
    //获取用户id
    var uid = $(this).parent().data("id");
    console.log(uid);
    //获取是否停用的isDelete 
    var isDelete = $(this).hasClass("btn-danger") ? "0" : "1";
    console.log(isDelete);



    //当点击模态框确认按钮后，向后台发送ajax请求，修改用户的状态
    $(".btn_confirm").on("click",function(){
      $.ajax({
        type:"post",
        url:"/user/updateUser",
        data:{
          id:uid,
          isDelete:isDelete
        },
        success:function(data){
          //关闭模态框
          $("#userModal").modal("hide");
          //重新渲染页面
          render();
        }
      })
    })
  })
})