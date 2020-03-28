let db;
let dbname = "lab";
let storename = "expenses";
let sum=0;

window.onload = function(){
    let openRequest = indexedDB.open(dbname,1);
    openRequest.onupgradeneeded = function(event){
        console.log("db upgrade");
        db = event.target.result;
        db.createObjectStore(storename,{keyPath: 'id',autoIncrement: true});
    }
    openRequest.onsuccess = function(event){
        console.log("db success");
        db = event.target.result;
        getAll();
    }
    openRequest.onerror = function(event){
        console.log("db error");
    }
}

function getAll(){
    let transaction = db.transaction(storename,"readonly");
    let store = transaction.objectStore(storename);
    let getRequest = store.getAll();
    getRequest.onsuccess = function(event){
        let allData = event.target.result;
        console.log("get success",allData);
        let table = document.getElementById('event-expenses');
        sum = 0;
        for(let i=0;i<allData.length;i++){
            let row = table.insertRow(-1);
            row.insertCell(-1).innerHTML = allData[i]['id'];
            row.insertCell(-1).innerHTML = allData[i]['use'];
            row.insertCell(-1).innerHTML = allData[i]['expense'];
            row.insertCell(-1).innerHTML = allData[i]['updatedAt'];
            row.insertCell(-1).innerHTML = "<input type='button' class='btn btn-danger btn-sm' value='Delete' onclick='deleteRow(this)'>";
            sum+=Number(allData[i]["expense"]);
        }
        document.getElementById('sum').innerHTML = "収支："+sum;
    }
}


function add(){
    let use = document.getElementById('use').value;
    let expense = document.getElementById('expense').value;
    let date = new Date();
    let updatedAt = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
    // updatedAt = Number(updatedAt)

    let data = {use: use, expense: expense, updatedAt: updatedAt};
    let transaction = db.transaction(storename,"readwrite");
    let store = transaction.objectStore(storename);
    let addRequest = store.add(data);
    addRequest.onsuccess = function(){
        console.log("add success",addRequest.result);
        let table = document.getElementById('event-expenses');
        for(let i=table.rows.length-1;i>=1;i--){
            table.deleteRow(i);
        }
        getAll();
    }
    addRequest.onerror = function(){
        console.log("add error",addRequest.error);
    }
    
}


function deleteRow(obj){
    let tr = obj.parentNode.parentNode;
    let transaction = db.transaction(storename,"readwrite");
    let store = transaction.objectStore(storename);
    let deleteRequest = store.delete(Number(tr.cells[0].textContent));
    deleteRequest.onsuccess = function(event){
        console.log("delete success");
    }
    deleteRequest.onerror = function(event){
        console.log("delete error",event.target.error);
    }

    sum -= Number(tr.cells[2].textContent);
    document.getElementById('sum').innerHTML = "収支："+sum;
    tr.parentNode.deleteRow(tr.sectionRowIndex);
}