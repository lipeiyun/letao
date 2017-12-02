$(function() {
  var nowPage = 1;
  var pageSize = 5;
  var imgs = []; //用来存储上传图片的地址
  var render = function() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: nowPage,
        pageSize: pageSize
      },
      success: function(data) {
        console.log(data);
        //渲染到页面
        $("tbody").html(template("tpl", data));

        //渲染分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: nowPage, //当前页
          totalPages: Math.ceil(data.total / data.size), //总页数

          // 分页的处理
          //type属性：
          // 如果是首页---> first
          // 上一页-->prev
          // 下一页-->next
          // 尾页-->last
          // 具体的页码-->page
          itemTexts: function(type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              //如果是page，说明就是数字，只需要返回对应的数字即可
              default:
                return page;
            }
          },
          tooltipTitles: function(type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              //如果是page，说明就是数字，只需要返回对应的数字即可
              default:
                return "跳转到" + page;
            }
          },
          useBootstrapTooltip: true,

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

  //给添加商品注册点击按钮
  $(".btn_add").on("click", function() {
    // console.log(111);
    // 显示，模态框
    $("#productModal").modal("show");

    //点击请选中品牌名称，获取二级分类的名字渲染在下拉菜单列表下
    $("#dropdownMenu1").on("click", function() {
      // console.log(222);
      $.ajax({
        type: "get",
        url: "/category/querySecondCategoryPaging",
        data: {
          page: 1,
          pageSize: 1000
        },
        success: function(data) {
          // console.log(data);
          //渲染 下拉菜单中的二级分类
          $(".dropdown-menu").html(template("tpl2", data));
        }
      });
    });

    //给dropdown-menu类下面的a注册点击
    $(".dropdown-menu").on("click", "a", function() {
      // console.log(333);
      //获取当前a的内容，赋值给dropdown-text类
      $(".dropdown-text").text($(this).text());
      //获取当前点击a的品牌id给隐藏域的名字为brandId
      $("[name='brandId']").val($(this).data("id"));
    });
  });

  //表单校验
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
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品的名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品的描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品的库存"
          },
          //正则校验
          regexp: {
            //不能是0开头，必须是数字
            regexp: /^[1-9]\d*$/,
            message: "请输入合法的库存"
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品的尺码（32-46）"
          },
          //正则校验
          regexp: {
            //不能是0开头，必须是数字
            regexp: /^\d{2}-\d{2}$/,
            message: "请输入合法的尺码,例如(32-46)"
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品的原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品的价格"
          }
        }
      },
      product: {
        validators: {
          notEmpty: {
            message: "请上传三张图片"
          }
        }
      }
    }
  });

  //图片上传
  //初始化图片上传
  $("#fileupload").fileupload({
    dataType: "json", //指定响应的格式
    done: function(e, data) {
      //图片上传成功之后的回调函数
      //通过data.result.picAddr可以获取到图片上传后的路径
      console.log(data.result);
      //图片上传成功

      // 只允许上传三张图片
      if (imgs.length >= 3) {
        return false;
      }

      //动态的往img_box中添加图片，将图片显示在页面中
      //1. 把图片显示到页面中(传到前台)
      $(".img_box").append(
        '<img src="' +
          data.result.picAddr +
          '" width="100" height="100" alt="">'
      );
      //2。把这个返回结果存储起来
      imgs.push(data.result);
      //  console.log(imgs);

      //3.判断imgs的长度，如果imgs的长度为3，修改product为校验成功
      if (imgs.length === 3) {
        $form.data("bootstrapValidator").updateStatus("product", "VALID");
      } else {
        $form.data("bootstrapValidator").updateStatus("product", "INVALID");
      }
    }
  });

  //给表单注册校验成功事件，阻止表单默认行为，通过ajax向后台发送请求
  $form.on("success.form.bv", function(e) {
    e.preventDefault();

    var param = $form.serialize();

    param += "&picName1=" + imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
    param += "&picName2=" + imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
    param += "&picName3=" + imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;

    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: param,
      success: function(data) {
        // console.log(data);
        if (data.success) {
          //1. 关闭模态框
          $("#productModal").modal("hide");
          //2. 渲染第一页
          nowPage = 1;
          render();

          //3. 重置表单的内容和样式
          $form[0].reset();
          $form.data("bootstrapValidator").resetForm();

          //下拉菜单重置
          $(".dropdown-text").text("请选择二级分类");
          $("[name='brandId']").val("");

          //重置图片
          $(".img_box img").remove();
          imgs = [];
        }
      }
    });
  });
});
