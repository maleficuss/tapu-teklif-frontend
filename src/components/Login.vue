<template >
  <div class="d-flex justify-content-center align-items-center mt-5">
    <div class="card">
      <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li class="nav-item text-center"> <a class="nav-link active btl" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">Login</a> </li>
        <li class="nav-item text-center"> <a class="nav-link btr" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">Signup</a> </li>
      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
          <div class="form px-4 pt-5">
            <form action="#" @submit.prevent="login">
            <input type="text" name="" class="form-control" placeholder="Email" v-model="email">
            <input type="password" name="" class="form-control" placeholder="Password" v-model="password">
            <button :disabled="!loginButton" class="btn btn-dark btn-block">Login</button>
            </form>
          </div>
          <div v-show="loginError" class="alert alert-danger">
            <strong>Error!</strong> Invalid Password Or E-Mail
          </div>
        </div>
        <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
          <div class="form px-4">
            <form action="#" @submit.prevent="register">
              <input type="text" name="" class="form-control" placeholder="Email" v-model="r_email">
              <input type="password" name="" class="form-control" placeholder="Password" v-model="r_password">
              <button :disabled="!registerButton" class="btn btn-dark btn-block">Signup</button>
            </form>
          </div>
          <div v-for="error in registerFormErrors" :key="error" class="alert alert-danger">
            {{ error }}
          </div>

        </div>
      </div>
    </div>
  </div>

</template>

<script>



export default {
  name:'login',
  data(){
    return{
      registerFormErrors:{},
      loginButton:true,
      registerButton:true,
      loginError:false,
      email:'',
      password:'',
      r_email:'',
      r_password:''
    }
  },

  methods:{
    login: function () {
      this.loginButton = false;
      this.$store.dispatch("getTokenAndSave", {
        username: this.email,
        password: this.password
      }).then(() => {
        this.$router.push({ name: 'home' });
      }).catch(() => this.loginError = true)
      .finally(() => this.loginButton = true)
    },

    register(){
      this.registerFormErrors = {};
      this.$store.dispatch("registerUser",{
        username: this.r_email,
        password: this.r_password
      }).then(() => {
        this.email = this.r_email;
        this.password = this.r_password;
        this.login();
      })
      .catch(reason => {
        if (reason.status === 404) {
          this.registerFormErrors = reason.errors;
        }
      });
    }
  }
}
</script>

<style>

.card {
  width: 400px;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,.5);
}

.btr {
  border-top-right-radius: 5px !important
}

.btl {
  border-top-left-radius: 5px !important
}

.btn-dark {
  color: #ffffff;
  background-color: #0d6efd;
  border-color: #0d6efd
}

.btn-dark:hover {
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd
}

.nav-pills {
  display: table !important;
  width: 100%
}

.nav-pills .nav-link {
  border-radius: 0px;
  border-bottom: 1px solid #0d6efd40
}

.nav-item {
  display: table-cell;
  background: #0d6efd2e
}

.form {
  padding: 10px;
  height: 300px
}

.form input {
  margin-bottom: 12px;
  border-radius: 3px
}

.form input:focus {
  box-shadow: none
}

.form button {
  margin-top: 20px
}
</style>