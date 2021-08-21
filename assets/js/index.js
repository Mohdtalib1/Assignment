if (window.location.pathname == "/index") {
  $ondelete = $(".table tbody td a.delete");
  $ondelete.click(function() {
    var id = $(this).attr("data-id");

    var request = {
      "url": `http://localhost:3000/CRUD/DeleteUser/${id}`,
      "method": "DELETE"
    }

    if (confirm("Do you really want to delete this record?")) {
      $.ajax(request).done(function(response) {
        alert("Data deleted successfully");
        location.reload();
      });
    }
  });
}

function validateLoginform() {
  var email = document.loginForm.email.value;
  var password = document.loginForm.password.value;

  if (email == null || email == "") {
    alert("Email can't be blank");
    return false;
  } else if (password == null || password == "") {
    alert("Password can't be blank.");
    return false;
  }
}

function validateSignupform() {
  var email = document.loginForm.email.value;
  var password = document.loginForm.password.value;
  var name = document.loginForm.username.value;
  var phone = document.loginForm.phone.value;
  var gender = document.loginForm.gender.value;
  var bio = document.loginForm.bio.value;

  if (email == null || email == "") {
    alert("Email can't be blank");
    return false;
  } else if (password == null || password == "") {
    alert("Password can't be blank.");
    return false;
  } else if (name == null || name == "") {
    alert("name can't be blank.");
    return false;
  } else if (phone == null || phone == "") {
    alert("phone can't be blank.");
    return false;
  } else if (gender == null || gender == "") {
    alert("gender can't be blank.");
    return false;
  } else if (bio == null || bio == "") {
    alert("bio can't be blank.");
    return false;
  }
}
