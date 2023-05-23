import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { fetcherBlob } from "../../helper";

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
    <div className='ItemsIntheGallary'>
      <h3>{item.name}</h3>
      <img
        src={itemImage}
        alt={item.name}
        height={280}
        width={280}
        onClick={() => navigate(`/item/${item.id}`)}
      />
      <p>
        <span>Category: {item.category_name}</span>
        <br />
        <span>
          <strong>￥{item.price}</strong>
        </span>
        <br />
      </p>
    </div>
  );
};
