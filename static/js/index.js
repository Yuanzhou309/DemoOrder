var cartList = {}
const colOrder = ["title", "amount", "price"]
var tableDOM = {}
var rowList = {}
var sum = 0


window.onload = () => {
    if(!!localStorage.getItem("cartList"))
        cartList = JSON.parse(localStorage.getItem("cartList"))
    storeCart()
    renderCart()
}
const add2Cart = (idx) => {
    if(!cartList[idx]) {
        cartList[idx] = {...menuList[idx], amount: 0, price: 0}
        delete cartList[idx].imgSrc
        renderCart()
    }
    updateItem(idx, 1)
    storeCart()
}

const storeCart = () => {
    localStorage.setItem("cartList", JSON.stringify(cartList))
    console.log(cartList)
}

const updateItem = (idx, amount) => {
    setTimeout( () => {
        let totalPrice = document.querySelector(".total-price")
        cartList[idx].amount += amount
        cartList[idx].price = Number.parseFloat(cartList[idx].price) + Number.parseFloat(amount * menuList[idx].price)
        cartList[idx].price = Number.parseFloat(cartList[idx].price).toFixed(2)
        tableDOM[idx].amount.textContent = cartList[idx].amount
        tableDOM[idx].price.textContent = cartList[idx].price
        sum = Number.parseFloat(sum) + Number.parseFloat(amount * menuList[idx].price)
        totalPrice.textContent = Number.parseFloat(Math.abs(sum)).toFixed(2)
        if(cartList[idx].amount <= 0) {
            rowList[idx].remove()
            delete cartList[idx]
            delete rowList[idx]
            delete tableDOM[idx]
        }
        storeCart()
    }, 0)
}

const deleteItem = (idx) => {
    updateItem(idx, -cartList[idx].amount)
    storeCart()
}

const clearCart = () => {
    Object.keys(cartList).map((idx) => deleteItem(idx))
    renderCart()
}

const collapseSideBar = () => {
    let sidebar = document.querySelector(".right-sidebar")
    if(!!sidebar.classList.contains("display")) {
        sidebar.classList.remove("display")
    } else {
        sidebar.classList.add("display")
    }
}
const addTableHeader = (element) => {
    let row = document.createElement("tr")
    colOrder.map((item) => {
        let th = document.createElement("th")
        let title = [...item]
        title[0] = title[0].toUpperCase()
        title = title.join("")
        console.log(title)
        th.textContent = title
        row.appendChild(th)
    })
    row.appendChild(document.createElement("th"))
    element.appendChild(row)
}
const renderCart = () => {
    let totalPrice = document.querySelector(".total-price")
    let table = document.querySelector(".cart-list")
    sum = 0
    table.innerHTML= ""
    addTableHeader(table)
    tableDOM = {}
    Object.keys(cartList).map((idx) => {
        tableDOM[idx] = {}
        let row = document.createElement("tr")
        row.className = `row-${idx}`
        colOrder.map((property) => {
            tableDOM[idx][property] = document.createElement("td")
            tableDOM[idx][property].className = property
            tableDOM[idx][property].textContent = cartList[idx][property]
            row.appendChild(tableDOM[idx][property])
        })
        let deleteBtn = document.createElement("td")
        deleteBtn.onclick = () => deleteItem(idx)
        deleteBtn.innerHTML = "<img class='icon-delete' src='/static/img/icon-delete.svg' />"
        row.appendChild(deleteBtn)
        rowList[idx] = row
        table.appendChild(row)
        sum = Number.parseFloat(sum) + Number.parseFloat(cartList[idx].price)
    })
    totalPrice.textContent = Number.parseFloat(Math.abs(sum)).toFixed(2)
}
const checkout = () => {
    location.href = "/order-details"
}