<template>

  <div class="container">
    <nav class="navbar navbar-light bg-light justify-content-between mt-2">
      <a class="navbar-brand">Todo List</a>
      <button @click="logout" class="btn btn-secondary my-2 my-sm-1" type="submit">Logout</button>
    </nav>
      <div class="form-group mt-5">
        <form action="#" @submit.prevent="createTodo" class="form-inline" role="form">
        <input type="text" class="form-control" id="todo" placeholder="Enter a Todo" v-model="formInputs.title"><br/>
        <input  type="submit" class="btn btn-primary mt-1"  value="Add">
        </form>
      </div>



    <br/>

    <ul class="list-group">
      <li v-for="todo in todos" :key="todo.id" class="list-group-item d-flex justify-content-between align-items-center">
        {{todo.title}} <input @click="deleteTodo(todo.id)" type="button" class="btn btn-danger mt-1" value="Delete">
      </li>
    </ul>

    <div v-for="error in errors" :key="error" class="alert alert-danger">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {

  data(){
    return {
      errors:{},
      formInputs:{},
      todos:{}
    }
  },

  beforeMount() {
    this.loadTodos();
  },

  methods:{
    loadTodos(){
      this.$store.dispatch("getTodoList").then(response => {
        this.todos = response.list;
      })
      .catch(reason => {
        if (reason.redirect) {
          this.$router.push(reason.redirect);
        }
      })
    },
    createTodo(){
      this.errors = {}
      this.$store.dispatch("createTodo",this.formInputs).then(response => {
        this.todos = response.list;
        this.loadTodos();
        this.formInputs = {}
      })
        .catch(reason => {
          if (reason.redirect) {
            this.$router.push(reason.redirect);
            return;
          }

          this.errors = reason.errors;

        })
    },

    deleteTodo(id){
      this.$store.dispatch("deleteTodo",id).then(() => {
        this.loadTodos();
      })
          .catch(reason => {
            if (reason.redirect) {
              this.$router.push(reason.redirect);
            }
          })
    },

    logout(){
      this.$store.dispatch("clearAuthentication").then(() => {
        this.$router.push({name:'login'});
      })
    }

  }
}
</script>
