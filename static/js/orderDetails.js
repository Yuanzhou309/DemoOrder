var cartList = {}
const colOrder = ["title", "amount", "price"]
var tableDOM = {}
var rowList = {}
var sum = 0


window.onload = () => {
    if(!!localStorage.getItem("cartList"))
        cartList = JSON.parse(localStorage.getItem("cartList"))
    renderCart()
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
        rowList[idx] = row
        table.appendChild(row)
        sum = Number.parseFloat(sum) + Number.parseFloat(cartList[idx].price)
    })
    totalPrice.textContent = `Total Price: ${Number.parseFloat(Math.abs(sum)).toFixed(2)}`
}
const confirm = () => {
    axios.post("/checkout", {
        totalPrice: sum,
        entry: cartList
    })
    .then((response) => {
        console.log(response)
        localStorage.removeItem("cartList")
        alert("Thank for your purchase!")
        location.href = "/"
    })
    .catch((err) => console.log(err));
}

const goBack = () => {
    location.href = "/"
}