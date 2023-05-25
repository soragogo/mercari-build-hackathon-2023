import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { fetcherBlob } from "../../helper";
import "./Item.css";

interface Item {
  id: number;
  name: string;
  price: number;
  category_name: string;
}

export const Item: React.FC<{ item: Item }> = ({ item }) => {
  const navigate = useNavigate();
  const [itemImage, setItemImage] = useState<string>("");
  const [cookies] = useCookies(["token"]);

  async function getItemImage(itemId: number): Promise<Blob> {
    return await fetcherBlob(`/items/${itemId}/image`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    });
  }

  useEffect(() => {
    async function fetchData() {
      const image = await getItemImage(item.id);
      setItemImage(URL.createObjectURL(image));
    }

    fetchData();
  }, [item]);

  return (
    <div className="ItemsIntheGallary">
      {/* <h3 className="item-name">{item.name}</h3> */}
      <img
        className="item-image_"
        src={itemImage}
        alt={item.name}
        // height={300}
        // width={300}
        onClick={() => navigate(`/item/${item.id}`)}
      />
      <p>
        <span className="price">
          <strong>
            <span className="currency-mark">￥</span>
            {item.price.toLocaleString()}
          </strong>
        </span>
        {/* <span className="category">Category: {item.category_name}</span> */}
        {/* <br /> */}
      </p>
    </div>
  );

};
