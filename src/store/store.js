import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
axios.defaults.baseURL = 'http://localhost:8080/api'
Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
        token:localStorage.getItem('token'),
        isAuthenticated : localStorage.getItem('isAuthenticated'),
        todos:[]
    },
    actions:{
        getTokenAndSave(ctx,credentials){
            return new Promise((resolve,reject) => {
                let result = {
                    success : false,
                    token: null
                }
                axios.post('/token', {},{
                    auth:{
                        username: credentials.username,
                        password: credentials.password,
                    }
                }).then(response => {
                    const token = response.data.data.token;
                    localStorage.setItem('token',token);
                    this.state.token = token;
                    this.state.isAuthenticated = true;
                    localStorage.setItem('isAuthenticated',this.state.isAuthenticated),
                    result.success = true;
                    result.token = token;
                    resolve(result)
                }).catch(() => {
                    reject(result)
                })
            });
        },

        registerUser(ctx,credentials){
            return new Promise((resolve,reject) => {
                let result = {
                    status:null,
                    success : false,
                    errors: {}
                }
                const qs = require('qs');
                axios.post('/users',qs.stringify({email: credentials.username, password: credentials.password}),
                    {
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                        }
                    }
                ).then(response => {
                    result.status = response.status;
                    result.success = true;
                    resolve(result);
                }).catch(function (error) {
                    let response = error.response;
                    result.status = response.status
                    result.success = false;
                    result.errors = response.data.errors;
                    reject(result)
                });
            });
        },


        getTodoList(ctx){
            return new Promise((resolve,reject) => {
                let result = {
                    status:null,
                    success : false,
                    message: null,
                    list:{}
                }
                axios.get('/todos',{
                    headers:{
                        Authorization:'bearer '+this.state.token
                    }
                }).then(response => {
                    result.status = response.status;
                    result.success = true;
                    result.list = response.data.data;
                    resolve(result);
                }).catch(function (error) {
                    let response = error.response;
                    result.status = response.status
                    result.success = false;
                    result.message = response.data.message;
                    ctx.dispatch('modifyResult',result)
                    reject(result)
                });
            });
        },


        createTodo(ctx,data){
            return new Promise((resolve,reject) => {
                let result = {
                    status:null,
                    success : false,
                    errors: {}
                }
                const qs = require('qs');
                axios.post('/todos',qs.stringify(data),
                    {
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                            Authorization:'bearer '+this.state.token
                        }
                    }
                ).then(response => {
                    result.status = response.status;
                    result.success = true;
                    resolve(result);
                }).catch(function (error) {
                    let response = error.response;
                    result.status = response.status
                    result.success = false;
                    result.errors = response.data.errors;
                    ctx.dispatch('modifyResult',result)
                    reject(result)
                });
            });
        },


        deleteTodo(ctx,id){
            return new Promise((resolve,reject) => {
                let result = {
                    status:null,
                    success : false,
                    message: null,
                }
                axios.delete('/todos/'+id,{
                    headers:{
                        Authorization:'bearer '+this.state.token
                    }
                }).then(response => {
                    result.status = response.status;
                    result.success = true;
                    resolve(result);
                }).catch(function (error) {
                    let response = error.response;
                    result.status = response.status
                    result.success = false;
                    result.message = response.data.message;
                    ctx.dispatch('modifyResult',result)
                    reject(result)
                });
            });
        },

        clearAuthentication(){
            this.state.isAuthenticated = false;
            this.state.token = null;
            localStorage.setItem('token',this.state.token);
            localStorage.setItem('isAuthenticated',this.state.isAuthenticated);
        },

        modifyResult(ctx,result){
            if (result.status === 401) {
                ctx.dispatch('clearAuthentication')
                result.redirect = {name:'login'}
            }
        },

    }
})