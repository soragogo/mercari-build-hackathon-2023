import React from "react";
import { Item } from "../Item";
import "./ItemList.css"
interface Item {
  id: number;
  name: string;
  price: number;
  category_name: string;
}

interface Prop {
  items: Item[];
}

export const ItemList: React.FC<Prop> = (props) => {
  return (
    <div className="ItemBundle">
      {props.items &&
        props.items.map((item) => {
          return <Item item={item} />;
        })}
    </div>
  );
};
