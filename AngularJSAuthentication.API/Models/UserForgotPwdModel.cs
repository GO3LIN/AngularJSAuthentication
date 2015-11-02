using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AngularJSAuthentication.API.Models
{
    public class UserForgotPwdModel
    {
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }
    }
}