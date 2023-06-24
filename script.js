const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter=document.getElementById('filter')
const formBtn = itemForm.querySelector('button')
let isEditMode=false;

function displayItems(){
    const itemsFromStorage=getItemsFromStorage();
    itemsFromStorage.forEach(item=>addItemToDom(item))
    checkUI()
}

function onaddItemSubmit(e){
    e.preventDefault();

    const newItem=itemInput.value
    
    // Validate Input
    if(newItem===''){
        alert('please add an item')
        return;
    }
  
    /* 
    ? 1. Yöntem
     list.innerHTML=`          ${newItem}
     <button class="remove-item btn-link text-red">
       <i class="fa-solid fa-xmark"></i>
     </button>`

     itemList.appendChild(list);
    */

    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode')

        removeItemFromStorage(itemToEdit.textContent)
 
        itemToEdit.classList.remove('edit-mode')
        itemToEdit.remove();
        isEditMode=false
    }else{
        if(checkIfItemExist(newItem)){
            alert('That Item Already Exist!')
            return;
        }
    }

   addItemToDom(newItem) 
   addItemStorage(newItem) 
   checkUI() 
   itemInput.value='';
    
}


function addItemToDom(item){
     // Create List Item

     const list=document.createElement('li')
     list.appendChild(document.createTextNode(item))
     const button =createBtn('remove-item btn-link text-red')
    list.appendChild(button)
 
    itemList.appendChild(list)

}



function createBtn(classes){
    const button = document.createElement('button')
    button.className=classes;
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    return button;
}

function createIcon(classes){
    const icon = document.createElement('i')
    icon.className=classes
    return icon;
}
function addItemStorage(item){
    const itemsFromStorage= getItemsFromStorage();
        // Add new item to array
    
        itemsFromStorage.push(item)
    
        // Convert to JSON string and set to local storage
    
        localStorage.setItem('items',JSON.stringify(itemsFromStorage))
    }
    
    function getItemsFromStorage(){
        let itemsFromStorage;
        if(localStorage.getItem('items')===null){
            itemsFromStorage=[]
        }else{
            itemsFromStorage=JSON.parse(localStorage.getItem('items'))
        }
        return itemsFromStorage
    }


    function onClickItem(e){
        if(e.target.parentElement.classList.contains('remove-item')){
            removeItems(e.target.parentElement.parentElement)
        }else{
            setItemToEdit(e.target)
        }
    }

    function checkIfItemExist(item){
        const itemsFromStorage =getItemsFromStorage();
        return itemsFromStorage.includes(item)
    }

    function setItemToEdit(item){
        isEditMode=true;
        itemList.querySelectorAll('li').forEach((i)=>i.classList.remove('edit-mode'))
        item.classList.add('edit-mode')
        formBtn.innerHTML='<i class= "fa-solid fa-pen " ></i>   Update Item'
        formBtn.style.backgroundColor='#228B22'
        itemInput.value=item.textContent
    }
    

    function removeItems(item){
        if(confirm('Are You Sure?')){
            // Remove item from DOM
            item.remove()

            // Remove item from storage
            removeItemFromStorage(item.textContent)

            checkUI()
        }
}

    function removeItemFromStorage(item){
        let itemsFromStorage = getItemsFromStorage()
        // Filter out item to be removed
        itemsFromStorage= itemsFromStorage.filter((i)=> i !== item)

        // Re-set to localstorage
        localStorage.setItem('items',JSON.stringify(itemsFromStorage))
    }

function clearItems(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild)
    }

    // Clear from localStorage

    localStorage.removeItem('items')
    checkUI()
}

function checkUI(){
    itemInput.value='';
    const items = itemList.querySelectorAll('li')
    if(items.length===0){
        itemFilter.style.display="none"
        clearBtn.style.display="none"
    }else{
        itemFilter.style.display="block"
        clearBtn.style.display="block"
    }
    
    formBtn.innerHTML ='<i class= "fa-solid fa-plus"></i>Add Item';
    formBtn.style.backgroundColor='#333';
}

function filter(e){
    const items = itemList.querySelectorAll('li')
    const text = e.target.value.toLowerCase()
    items.forEach((item)=>{
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text)!=-1){
            item.style.display='flex'
        }else{
            item.style.display='none'
        }

    })

}

itemForm.addEventListener('submit',onaddItemSubmit)
itemList.addEventListener('click',onClickItem);
clearBtn.addEventListener('click',clearItems)
itemFilter.addEventListener('input', filter)
document.addEventListener('DOMContentLoaded',displayItems)
checkUI()
