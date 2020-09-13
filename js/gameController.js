(function(window) {
    'use strict';

    class GameController{

        constructor(template,store) {
            let user;
            this.template = template;
            this.store=store;
            const data=this.store.getData();
            user = data.loggedinUser;
            if(user){
                this.template.welcomeUser();
            }
            this.bindEvents();
        }
       
       
        loginUser(){
            let user =document.getElementById('userName').value;

            const data=this.store.getData();
            if(user===''){
                data.loggedinUser='';
                this.store.setData(data);
                alert('Please login');
                this.template.welcomeUser();
                return;
            }
            data.loggedinUser=user;

            if(data.userData[user]===undefined){
             data.userData[user]={
                games:[],
                loggedin:1
             }
            }
            this.store.setData(data);
            this.template.welcomeUser();
        }
        newGame(){
            let level =document.getElementById('gameLevel').value;
            
            if(level===''){
                alert('Please enter level');
                return
            }
            level=parseInt(level);
            if(level < 1 || level >10){
                alert('Please enter level between 1 to 10');
                return
            }
            const data=this.store.getData();
            let user = data.loggedinUser;
            if(user){
                    let games=data.userData[user].games;
                    if(games.length>0){
                        data.userData[user].games[games.length-1].gameOver=true;
                    }
                    data.userData[user].games.push({
                    level,
                    time:new Date(),
                    won:0,
                    gameOver:false
                })  
                this.store.setData(data);
                this.template.buildMatrix();
            }
            else{
                alert('login');
                return;
            }
            
            
        }
        
        checkMine(event){
            event.stopPropagation();
            let target=event.target;
            let dataId=target.getAttribute("data-id");
            if(dataId){
                let [row,column]=dataId.split('-');
                target.style.display='none';
                this.template.checkMine(row,column);
            }
            else {
                return;
            }
            
        }
        bindEvents(){  
           document.getElementById('newGame').addEventListener("click",(event)=>{ this.newGame(event)}); 
           document.getElementById('submit').addEventListener("click",(event)=>{ this.loginUser(event)}); 
           document.getElementById('gameGrid').addEventListener("click",(event)=>{ this.checkMine(event)});
           document.getElementById('showUserResults').addEventListener("click",(event)=>{ this.template.showResults(event)}); 
        }
     
      
    }
    window.app = window.app || {};
    window.app.GameController = GameController;
})(window);