$(function() {
  var nowPage = 1;
  var pageSize = 5;
  var render = function() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
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
    $("#secondModal").modal("show");
    //发送ajax请求，获取所有的一级分类数据，渲染下拉框组建
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 1000 //希望获取所有
      },
      success: function(data) {
        // console.log(data);
        $(".dropdown-menu").html(template("tpl2", data));
      }
    });
  });

  // 给下拉框中左右的a注册点击事件  （委托事件）
  $(".dropdown-menu").on("click", "a", function() {
    //  console.log(1111);
    //1. 设置按钮的内容
    console.log($(this).text());
    $(".dropdown-text").text($(this).text());

    //  //获取到当前a的id值，设置给categoryId
    console.log($(this).data("id"));
    $("[name='categoryId']").val($(this).data("id"));

    //  //3. 让categoryId校验变成成功
    $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });

  //初始化图片上传
  $("#fileupload").fileupload({
    dataType: "json", //指定响应的格式
    done: function(e, data) {
      //图片上传成功之后的回调函数
      //通过data.result.picAddr可以获取到图片上传后的路径
      console.log(data);
      console.log(data.result.picAddr);

      //设置给img_box中img的src属性
      $(".img_box img").attr("src", data.result.picAddr);

      //把图片的地址赋值给brandLogo
      $("[name='brandLogo']").val(data.result.picAddr);

      //把brandLogo改成成功
      $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });

  //表单校验功能
  var $form = $("form");
  $form.bootstrapValidator({
    excluded: [], //不校验的内容
    feedbackIcons: {
      valid: "glyphicon glyphicon-ok",
      invalid: "glyphicon glyphicon-remove",
      validating: "glyphicon glyphicon-refresh"
    },
    //校验规则
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类的名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传品牌图片"
          }
        }
      }
    }
  });

  //给表单注册校验成功事件
  $form.on("success.form.bv", function(e) {
    e.preventDefault();

    //发送ajax
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $form.serialize(),
      success: function(data) {
        if (data.success) {
          //成功了
          //1. 关闭模态框
          $("#secondModal").modal("hide");
          //2. 重新渲染第一页
          nowPage = 1;
          render();

          //3. 重置内容和样式
          $form[0].reset();
          $form.data("bootstrapValidator").resetForm();

          //4. 重置下拉框组件和图片
          $(".dropdown-text").text("请选择一级分类");
          $("[name='categoryId']").val("");
          $(".img_box img").attr("src", "images/none.png");
          $("[name='brandLogo']").val("");
        }
      }
    });
  });
});
