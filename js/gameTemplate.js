(function(window) {
    'use strict';

    class GameTemplate {
        constructor(store){
            this.store=store;
            this.matrix=[];
            this.domMatrix=[];
            this.level=0;
            this.mineCount=0;
            this.totalGrid=0;
            this.domGrid = document.getElementById("gameGrid");
            this.welcomeNote = document.getElementById("welcomeNote");
            this.matchResult= document.getElementById("matchResult");
            this.userResultList= document.getElementById("userResultList");
           
        }
      
        
        welcomeUser(){
            let data= this.store.getData();
            let {loggedinUser}=data;
            if(loggedinUser){
                this.welcomeNote.innerHTML=`Welcome ${loggedinUser}`;
                
                }
            else{
                this.welcomeNote.innerHTML=`Please Login`;
            }
            this.userResultList.innerHTML='';
            this.matchResult.innerHTML= '';
            this.domGrid.innerHTML= '';
            this.userResultList.innerHTML= '';
            
        }
        formMatrix(){
           for(let i=0;i<this.level;i++){
               let arr=[];
               for(let j=0;j<this.level;j++){
                   arr.push(Math.random()*10>8 ?false :true)
               }
               this.matrix.push(arr);
           }
        }
        getNeighbourMineCount(row,col){
            let neighbors=[];
            let count=0;
            let len=this.matrix.length;
            row=parseInt(row);
            col=parseInt(col);
            let rowPone=row+1;
            let colPone=col+1;
            let rowMone=row-1;
            let colMone=col-1;
            rowMone>-1 && colMone>-1 && !this.matrix[rowMone][colMone] && count++;
            rowMone>-1 && !this.matrix[rowMone][col] && count++;
            rowMone>-1 && colPone<len && !this.matrix[rowMone][colPone] && count++;
            colMone>-1 && !this.matrix[row][colMone] && count++;
            colPone<len && !this.matrix[row][colPone] && count++;
            rowPone<len && colMone>-1 && !this.matrix[rowPone][colMone] && count++;
            rowPone<len && !this.matrix[rowPone][col] && count++;
            rowPone<len && colPone<len && !this.matrix[rowPone][colPone] && count++;
            return count;
        }
        formDomMatix(){
            let len=this.matrix.length;
            for(let i=0;i<len;i++){
                let arr=[];
                for(let j=0;j<len;j++){
                    if(this.matrix[i][j]){
                        arr[j]=this.getNeighbourMineCount(i,j);
                    }
                    else{
                        arr[j]=false;
                    }
                }
                this.domMatrix.push(arr);
            }
        }
        renderDomMatrix(){

            let len=this.domMatrix.length;
            let ulInnerHtml='';
            let isMine;
            this.mineCount=0;
             for(let i=0;i<len;i++){
                let li=`<li class="row">`
                for(let j=0;j<len;j++){
                  isMine=this.domMatrix[i][j]===false;
                  if(isMine){
                    this.mineCount++;
                  }
                  li=li+`<div class="column">
                          <span class=${isMine?"redDot":""}>${isMine?"":this.domMatrix[i][j]}</span>
                          <div class="wrapper" data-id="${i}-${j}"></div>
                         </div>`
                }
                li=li+`</li>`;
                ulInnerHtml=ulInnerHtml+li;
            }
            return ulInnerHtml;
        }
        buildMatrix(){
            let data= this.store.getData();
            let {loggedinUser}=data;
            let games=data.userData[loggedinUser].games;
            this.level=parseInt(games[games.length-1].level);
            this.matrix=[];
            this.domMatrix=[];
            this.domGrid.innerHTML='';
            this.matchResult.innerHTML='';
            this.totalGrid=this.level*this.level;
            this.formMatrix();
            this.formDomMatix();
            console.log(this.matrix);
            console.log(this.domMatrix);
            this.domGrid.innerHTML= this.renderDomMatrix();
        }
        checkMine(row,col){
            let data= this.store.getData();
            let {loggedinUser}=data;
            let games=data.userData[loggedinUser].games;        
            if(this.matrix[row][col]===false){
                if(games[games.length-1].gameOver!==true){
                    data.userData[loggedinUser].games[games.length-1].gameOver=true;
                    this.store.setData(data);
                    alert('You Lost!');
                    this.matchResult.innerHTML='You Lost!';
                }
                
            }
            else{
                this.totalGrid--;
                if(this.mineCount===this.totalGrid){
                    if(games[games.length-1].gameOver!==true){
                        games[games.length-1].won=1;
                        data.userData[loggedinUser].games[games.length-1].gameOver=true;
                        this.store.setData(data);
                        alert('You Won!');
                        this.matchResult.innerHTML='You Won!';
                    }
                }
                
            }

        }
        getHeader(){
            return `
            <li class="row" >
                <div class="column">Match No</div>
                <div class="column">Level</div>
                <div class="column">Result</div>
                <div class="column">Time</div>
                <div class="column">In Progress</div>
            </li>
            `
        }
        getFullDate(currentdate){
           currentdate=new Date(currentdate);
           let date = `${currentdate.getDate()}-${(currentdate.getMonth()+1)}-${currentdate.getFullYear()} ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}` ;
           return date;
        }
        getResults(item,sno){
          return  ` 
            <li class="row" >
                <div class="column">${sno}</div>
                <div class="column">${item.level}</div>
                <div class="column">${item.won===0?"Lost":"Won"}</div>
                <div class="column">${this.getFullDate(item.time)}</div>
                <div class="column">${item.gameOver===true?"No":"Yes"}</div>
            </li>`
        }
        showResults(){
            let data= this.store.getData();
            let {loggedinUser}=data;
            let resultInnerHtml='';
            if(loggedinUser){
                let games=data.userData[loggedinUser].games;
                if(games.length===0){
                    this.userResultList.innerHTML='No matches played!'
                    return;
                }
                resultInnerHtml=resultInnerHtml.concat(this.getHeader())
                for(let i=0;i<games.length;i++){
                    resultInnerHtml=resultInnerHtml.concat(this.getResults(games[i],i+1));
                }
                this.userResultList.innerHTML=resultInnerHtml;
            }
            else{
                alert('Please Login!');
            } 
        }
       
    }
  
    window.app = window.app || {};
    window.app.GameTemplate = GameTemplate;
})(window);