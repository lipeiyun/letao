$(function() {
  /*校验规则：
    用户名不能为空
    密码不能为空
    密码长度在6-12位
  */

  var $form = $("form");
  //使用表单校验插件(初始化表单)
  $form.bootstrapValidator({
    //1. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: "glyphicon glyphicon-ok",
      invalid: "glyphicon glyphicon-remove",
      validating: "glyphicon glyphicon-refresh"
    },

    //2. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: "用户名不能为空"
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        validators: {
          //不能为空
          notEmpty: {
            message: "密码不能为空"
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度必须在6到12之间'
          },
          callback: {
            message: "密码不存在"
          }
        }
      }
    }
  });


  //阻止表单的默认提交，通过ajax提交数据
  //（success.form.bv事件：当表单校验成功时，会触发success.form.bv事件，此时会提交表单）
  $form.on('success.form.bv', function (e) {
    e.preventDefault();
    // console.log(111);
    //使用ajax提交逻辑
    $.ajax ({
      type:"post",
      url:"/employee/employeeLogin",
      data:$form.serialize(),
      success:function(data){
       // console.log(data);
        if(data.success){
            location.href="index.html"
        }
        if(data.error == 1000){
          //用户名的校验失败
          //第一个参数：想要修改的字段
          //第二个参数：改成什么状态  INVALID  VALID
          //第三个参数： 指定显示的错误信息
          $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
        }
        if(data.error == 1001){
          $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
        }
      }
    })
  });

  //重置样式
  $("[type='reset']").on("click", function(){
    //需要重置表单的样式,需要获取到插件对象
    $form.data("bootstrapValidator").resetForm();
  });
});
