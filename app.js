// Storage Controller
let StorageCtrl = (function(){
    return{
        storeItem: function(item){
            let items;
            if(localStorage.getItem("items") === null){
                items = []
                items.push(item)
                localStorage.setItem("items", JSON.stringify(items))
            }else{
                items = JSON.parse(localStorage.getItem("items"))
                items.push(item)
                localStorage.setItem("items", JSON.stringify(items))
            }
            
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem("items") === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem("items"))
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem("items"))
            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            })
            localStorage.setItem("items", JSON.stringify(items))
        },
        deleteItemFromSt: function(id){
            let items = JSON.parse(localStorage.getItem("items"))
            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            })
            localStorage.setItem("items", JSON.stringify(items))
        },
        clearItemFromSt: function(){
            localStorage.removeItem("items")
        }
    }
})()

// Item Controller
let ItemCtrl = (function(){
// Item Constructor
    let Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

// Data Structure
    let data = {
        Items : StorageCtrl.getItemsFromStorage(),
        currentItem : null,
        totalCalories: 0
    }
    
    return{
        getItems: function(){
            return data.Items
        },
        addItems: function(name, calories){
            let ID;
            if(data.Items.length>0){
                ID = data.Items[data.Items.length - 1].id + 1
            }else{
                ID = 0
            }
            calories = parseInt(calories)
            newItem = new Item(ID, name, calories)
            data.Items.push(newItem)
            return newItem
        },
        getItemById: function(id){
            let found = null;
            data.Items.forEach(function(item){
                if(item.id === id){
                    found = item
                }
            })
            return found
        },
        updateItem: function(name, calories){
            let found = null;
            data.Items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name
                    item.calories = parseInt(calories)
                    found = item
                }
            })
            return found
        },
        deleteItem: function(id){
            let ids = data.Items.map(function(item){
                return item.id
            })
            data.Items.splice(ids.indexOf(id), 1)
        },
        clearAllItems: function(){
            return data.Items = [] 
        },
        setCurrentItem: function(item){
            data.currentItem = item
        },
        getCurrentItem: function(){
            return data.currentItem
        },
        getTotalCalories: function(){
            let total = 0
            data.Items.forEach(function(item){
                total += item.calories
            })
            data.totalCalories = total
            return data.totalCalories
        },

        logData: function(){
            return data
        }
    }
})()


// UI Controller
let InterfaceCtrl = (function(){
    let UISelectors = {
        itemList: "#item-list",
        listItems: "#item-list li",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        clearBtn: ".clear-btn",
        itemNameInput: "#item-name",
        itemCalorieInput: "#item-calories",
        totalCalories: ".total-calories"
    }
    return{
    PopulateItemList: function(items){
        let html = "";
        items.forEach(function(item){
            html += `<li class="collection-item" id="item-${item.id}"><strong>${item.name}:</strong><br><em> ${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class=" edit-item fa fa-pencil"></i></a>
        </li>`;
        });
        document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getInputs: function(){
        return{
            name: document.querySelector(UISelectors.itemNameInput).value,
            calories: document.querySelector(UISelectors.itemCalorieInput).value
        }
    },
    addListItem: function(item){
        document.querySelector(UISelectors.itemList).style.display = "block"
        let li = document.createElement("li");
        li.className = "collection-item";
        li.id = `item-${item.id}`
        li.innerHTML = `<strong>${item.name}:</strong><em> ${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class=" edit-item fa fa-pencil"></i></a>`
        document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li)
    },
    updateListItem: function(item){
        let listItems = Array.from(document.querySelectorAll(UISelectors.listItems))
        listItems.forEach(function(listItem){
            if(listItem.getAttribute("id") === `item-${item.id}`){
                document.querySelector(`#${listItem.getAttribute("id")}`).innerHTML = 
                `<strong>${item.name}:</strong><em> ${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class=" edit-item fa fa-pencil"></i></a>`
            }
        })
        
    },
    deleteItem: function(id){
        let itemID = `#item-${id}`
        let item = document.querySelector(itemID);
        item.remove()
    },
    removeItems: function(){
        let listItems = Array.from(document.querySelectorAll(UISelectors.listItems))
        listItems.forEach(function(item){
            item.remove()
        })
    },
    showTotalCalories: function(total){
        document.querySelector(UISelectors.totalCalories).textContent = total
    },
    hideList: function(){
        document.querySelector(UISelectors.itemList).style.display = "none"
    },
    clearInputs: function(){
        document.querySelector(UISelectors.itemNameInput).value = ""
        document.querySelector(UISelectors.itemCalorieInput).value = ""
    },
    addItemToForm: function(){
        InterfaceCtrl.showEditState()
        document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
        document.querySelector(UISelectors.itemCalorieInput).value = ItemCtrl.getCurrentItem().calories
        
    },
    clearEditState: function(){
        InterfaceCtrl.clearInputs()
        document.querySelector(UISelectors.updateBtn).style.display = "none"
        document.querySelector(UISelectors.deleteBtn).style.display = "none"
        document.querySelector(UISelectors.backBtn).style.display = "none"
        document.querySelector(UISelectors.addBtn).style.display = "inline"
    },
    showEditState: function(){
        document.querySelector(UISelectors.updateBtn).style.display = "inline"
        document.querySelector(UISelectors.deleteBtn).style.display = "inline"
        document.querySelector(UISelectors.backBtn).style.display = "inline"
        document.querySelector(UISelectors.addBtn).style.display = "none"
    },
    getSelectors: function(){
        return UISelectors
    }
  }
})();

//App Controller
let AppCtrl = (function(ItemCtrl,StorageCtrl,InterfaceCtrl){

    let loadEvent = function(){
        let UIselectors = InterfaceCtrl.getSelectors();
        document.querySelector(UIselectors.addBtn).addEventListener("click", itemAddSubmit)
        document.addEventListener("keypress", function(e){
            if(e.keycode === 13 || e.which === 13){
                e.preventDefault()
                return false
            }
        })
        document.querySelector(UIselectors.itemList).addEventListener("click", itemEditClick)
        document.querySelector(UIselectors.updateBtn).addEventListener("click", itemUpdateSubmit)
        document.querySelector(UIselectors.deleteBtn).addEventListener("click", itemDeleteSubmit)
        document.querySelector(UIselectors.backBtn).addEventListener("click", function(e){
            InterfaceCtrl.clearEditState()
            e.preventDefault()
        })
        document.querySelector(UIselectors.clearBtn).addEventListener("click", clearItems)
    }
    let itemAddSubmit = function(e){
        let input = InterfaceCtrl.getInputs()
        if(input.name !== "" && input.calories !== ""){
            let newItem = ItemCtrl.addItems(input.name, input.calories);
            InterfaceCtrl.addListItem(newItem)
            let totalCalories = ItemCtrl.getTotalCalories()
            InterfaceCtrl.showTotalCalories(totalCalories)
            StorageCtrl.storeItem(newItem)
            InterfaceCtrl.clearInputs()

        }else{
            alert("Fill Them Inputs Correctly")
        }

        e.preventDefault()
    }
    let itemEditClick = function(e){
        if(e.target.classList.contains("edit-item")){
            let listId = e.target.parentNode.parentNode.id
            let id = parseInt((listId.split("-"))[1])
            let itemToEdit = ItemCtrl.getItemById(id)
            ItemCtrl.setCurrentItem(itemToEdit)
            InterfaceCtrl.addItemToForm()
        }
        e.preventDefault()
    }
    let itemUpdateSubmit = function(e){
        let input = InterfaceCtrl.getInputs()
        let updatedItem = ItemCtrl.updateItem(input.name, input.calories)
        InterfaceCtrl.updateListItem(updatedItem)
        let totalCalories = ItemCtrl.getTotalCalories()
        InterfaceCtrl.showTotalCalories(totalCalories)
        StorageCtrl.updateItemStorage(updatedItem)
        InterfaceCtrl.clearEditState()
        e.preventDefault()
    }
    let itemDeleteSubmit = function(e){
        let currentItem = ItemCtrl.getCurrentItem()
        ItemCtrl.deleteItem(currentItem.id)
        InterfaceCtrl.deleteItem(currentItem.id)
        StorageCtrl.deleteItemFromSt(currentItem.id)
        InterfaceCtrl.clearEditState()
        let totalCalories = ItemCtrl.getTotalCalories()
        InterfaceCtrl.showTotalCalories(totalCalories)
        e.preventDefault()
    }
    let clearItems = function(){
        ItemCtrl.clearAllItems()
        InterfaceCtrl.removeItems()
        StorageCtrl.clearItemFromSt()
        let totalCalories = ItemCtrl.getTotalCalories()
        InterfaceCtrl.showTotalCalories(totalCalories)
        InterfaceCtrl.hideList()
    }

    return{
        init: function(){
            InterfaceCtrl.clearEditState()
          let items = ItemCtrl.getItems(); 
          if(ItemCtrl.getItems().length === 0){
              InterfaceCtrl.hideList()
          }else{
            InterfaceCtrl.PopulateItemList(items)
          }
            let totalCalories = ItemCtrl.getTotalCalories()
            InterfaceCtrl.showTotalCalories(totalCalories)
            loadEvent() 
         }
    }

})(ItemCtrl,StorageCtrl,InterfaceCtrl)


AppCtrl.init()