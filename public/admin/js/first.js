$(function() {
  var nowPage = 1;
  var pageSize = 4;
  var render = function() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: nowPage,
        pageSize: pageSize
      },
      success: function(data) {
        console.log(data);
        //数据与模板绑定
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

  //点击添加分类，弹出模态框
  $(".btn_add").on("click", function() {
    //显示模态框
    $("#firstModal").modal("show");
  });

  //校验表单
  $form = $("form");
  //(1)使用表单校验插件（初始化表单校验）
  $form.bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    // excluded: [":disabled", ":hidden", ":not(:visible)"],

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: "glyphicon glyphicon-ok",
      invalid: "glyphicon glyphicon-remove",
      validating: "glyphicon glyphicon-refresh"
    },

    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      categoryName: {
        validators: {
          //不能为空
          notEmpty: {
            message: "一级分类名称不能为空"
          }
        }
      }
    }
  });

  //点击添加按钮时，发送ajax请求
  //阻止表单的默认提交，通过ajax提交数据
  //（success.form.bv事件：当表单校验成功时，会触发success.form.bv事件，此时会提交表单）
  $form.on("success.form.bv", function(e) {
    e.preventDefault();
    // console.log(111);
    //使用ajax提交逻辑
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $form.serialize(),
      success: function(data) {
        // console.log(data);
        //关闭模态框
        $("#firstModal").modal("hide");
        //重新渲染页面
        nowPage = 1;
        render();
        //重置样式和表单的value值
        $form.data("bootstrapValidator").resetForm();
        // $form[0]:[0]将jquery对象转换成dom对象  因为reset()是dom方法
        $form[0].reset();
      }
    });
  });
});
