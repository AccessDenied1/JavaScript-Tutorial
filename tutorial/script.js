const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearBtn = document.getElementById('clear');
const filterItem = document.getElementById('filter')
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function onAddItemSubmit(e) {
    e.preventDefault();
    let newItem = itemInput.value;
    newItem = newItem.trim()
    //validate input
    if(newItem === '') {
        alert('Please add an item');
        return;
    }
    if(checkDuplicate(newItem)){
        alert("This item is already present!!");
        return;
    }
    if(isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }
    addItemToDOM(newItem);
    addItemToStorage(newItem);
    checkUI();
    itemInput.value = '';
}

function addItemToDOM(item) {
    //Create new list item
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);
    itemList.appendChild(li);

}

function createButton(classes){
    const button = document.createElement('button');
    button.className = classes
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item'))
    {
        removeItem(e.target.parentElement.parentElement);
    }
    else if(e.target.tagName == 'LI'){
        setItemToEdit(e.target);
    }
}

function checkDuplicate(item){
    const itemFromStorage = getItemFromStorage();
    return itemFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;
    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode')
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent;

}

function removeItem(item){
    if(confirm('Are you sure!!!!')){
        item.remove();
        removeItemFromStorage(item.textContent);
    }
    checkUI();
}

function clearItem(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }
    //Clear from local Storage
    localStorage.removeItem('items');
    checkUI();
}

function filterList(e){
    const filterValue = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li')
    items.forEach((x) => {
        if(!x.firstChild.textContent.toLocaleLowerCase().includes(filterValue))
        {
            x.style.display = 'none'
        }
        else
        x.style.display = 'flex'
    }
    )
}

function addItemToStorage(item){
    const itemFromStorage = getItemFromStorage()
    itemFromStorage.push(item);

    //convert to JSON string
    localStorage.setItem('items', JSON.stringify(itemFromStorage));
}

function removeItemFromStorage(itemToRemove){
    let itemFromStorage = getItemFromStorage();
    itemFromStorage = itemFromStorage.filter(item => item !== itemToRemove );
    localStorage.setItem('items', JSON.stringify(itemFromStorage));
}

function getItemFromStorage(){
    let itemFromStorage;

    if(localStorage.getItem('items') === null){
        itemFromStorage = [];
    } else{
        itemFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemFromStorage;
}

function displayItems(){
    const itemFromStorage = getItemFromStorage();
    itemFromStorage.forEach((item) => addItemToDOM(item));
    checkUI();
}

function checkUI(){
    itemInput.value = '';
    const items = itemList.querySelectorAll('li')
    if(items.length === 0){
        clearBtn.style.display = 'none';
        filterItem.style.display = 'none';
    }
    else{
        clearBtn.style.display = 'block';
        filterItem.style.display = 'block';
    }
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333'
    isEditMode = false;


}
//Event Listeners
function init(){
    
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItem);
    filterItem.addEventListener('input', filterList);
    document.addEventListener('DOMContentLoaded', displayItems);
    checkUI();
}

init();