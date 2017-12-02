// 入口函数的好处：（1）等待页面加载完成再执行js的代码
//（2）相当于沙箱，里面的变量都是局部变量，不会影响外部
$(function() {
  //校验用户名和密码（使用插件bootstrap-validator）

  /*
  校验规则：用户名不能为空
  密码不能为空
  密码的长度在6-12位
  */

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
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: "用户名不能为空"
          },
          callback: {
            message:"输入的用户名错误"
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
            message: "密码长度必须在6到12之间"
          },
          callback: {
            message:"输入的密码错误"
          }
        }
      }
    }
  });

  //(2)重置表单样式
  //重置功能，重置样式
  $("[type='reset']").on("click", function() {
    //重置样式
    $form.data("bootstrapValidator").resetForm();
  });

  //(3)注册注册表单验证成功事件success.form.bv,此时会提交表单，阻止表单的默认行为，发送ajax请求提交数据
  $form.on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type:"post",
      url:"/employee/employeeLogin",
      data:$form.serialize(),
      // success:function(data){
      //   // console.log(data);
      //   //如果成功，跳转到首页
      //   location.href="index.html";
      // },
      // error:function(data){
      //   if(data.error === 1000){
      //     alert("用户名不存在");
      //   }else if(data.error === 1000){
      //     alert("密码错误");
      //   }
      // }

      success:function (data) {
        //如果成功，就跳转到首页
        if(data.success){
          location.href = "index.html";
        }

        if(data.error === 1000){
          // alert("用户名不存在");

          //手动调用方法，updateStatus让username校验失败即可
          //第一个参数：改变哪个字段
          //第二个参数：改成什么状态  VALID:通过  INVALID:不通过
          //第三个参数：选择提示的信息
          $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
        }

        if(data.error === 1001){
          // alert("密码错误");

          $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
        }
      }
    })
});

  
});
