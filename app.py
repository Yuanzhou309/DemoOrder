import os
from flask import Flask, request, jsonify
from flask import render_template
from datetime import date, datetime
from typing import List
from sqlalchemy import create_engine
from sqlalchemy import Integer, String, Float, ForeignKey
from sqlalchemy.orm  import Session, Mapped, mapped_column, relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

app = Flask(__name__)
engine = create_engine(os.environ.get("DB_URL"))
session = Session(engine)


class Order(Base):
    __tablename__ = "order"
    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[str] = mapped_column(String(60))
    total_price: Mapped[float] = mapped_column(Float)
    entry: Mapped[List["Entry"]] = relationship(
        back_populates="order", cascade="all, delete-orphan"
    )
    def __repr__(self) -> str:
        return f"Order(date={self.date!r}, total_price={self.total_price!r}, entry={self.entry!r})"

class Entry(Base):
    __tablename__ = "entry"
    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("order.id"))
    order: Mapped["Order"] = relationship(back_populates="entry")
    title: Mapped[str] = mapped_column(String)
    amount: Mapped[int] = mapped_column(Integer)
    price: Mapped[float] = mapped_column(Float)
    def __repr__(self) -> str:
        return f"Entry(title={self.title!r}, amount={self.amount!r}, price={self.price!r})"


Base.metadata.create_all(engine)

# frontend
@app.route('/')
def menu():
    config = {
        "today": date.today().strftime("%B %d, %Y"),
        "menuList": [{
            "title": "Fried Rice",
            "imgSrc": "food-1.jfif",
            "price": 22.88
        },
        {
            "title": "Black Forest",
            "imgSrc": "food-2.jfif",
            "price": 15.88
        },
        {
            "title": "Fresh Morning",
            "imgSrc": "food-3.jfif",
            "price": 19.88
        },
        {
            "title": "Cappuccino",
            "imgSrc": "food-4.jfif",
            "price": 4.00
        },]
    }
    return render_template('index.html', **config, iterMenu=enumerate(config['menuList']))

@app.route('/order-details')
def details():
    return render_template('orderDetails.html', today=date.today().strftime("%B %d, %Y"))

@app.route('/order-history')
def history():
    result = session.query(Order).join(Entry).filter(Order.id == Entry.order_id).all()
    ans = []
    for idx in result:
        # print(f"{item.date} {item['entry']}")
        item = {**idx.__dict__}
        item['entry'] = []
        item.pop("_sa_instance_state", None)
        for j in idx.entry:
            # print(j.__dict__)
            item['entry'].append(j.__dict__)
            item['entry'][-1].pop("_sa_instance_state", None)
        ans.append(item)
        print(item['entry'])
    print(ans)
    history = ans
    return render_template('orderHistory.html', today=date.today().strftime("%B %d, %Y"), history=history)

# backend
@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.json
    entryList = data['entry']
    for idx in entryList:
        entryList[idx] = Entry(**entryList[idx])

    # print(list(entryList.values()))
    order = Order(
        date=datetime.now().strftime("%B %d, %Y %H:%M"),
        total_price = data['totalPrice'],
        entry=list(entryList.values()),
    )

    session.add(order)
    session.commit()
    return "Insert Successfully！"
