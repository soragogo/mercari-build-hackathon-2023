import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { MerComponent } from "../MerComponent";
import { toast } from "react-toastify";
import { fetcher, fetcherBlob } from "../../helper";
import "./ItemDetail.css"

const ItemStatus = {
  ItemStatusInitial: 0,
  ItemStatusOnSale: 1,
  ItemStatusSoldOut: 2,
} as const;

type ItemStatus = (typeof ItemStatus)[keyof typeof ItemStatus];

interface Item {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  user_id: number;
  price: number;
  status: ItemStatus;
  description: string;
}

export const ItemDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [item, setItem] = useState<Item>();
  const [itemImage, setItemImage] = useState<Blob>();
  const [cookies] = useCookies(["token", "userID"]);

  const fetchItem = () => {
    fetcher<Item>(`/items/${params.id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("GET success:", res);
        setItem(res);
      })
      .catch((err) => {
        console.log(`GET error:`, err);
        toast.error(err.message);
      });

    fetcherBlob(`/items/${params.id}/image`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("GET success:", res);
        setItemImage(res);
      })
      .catch((err) => {
        console.log(`GET error:`, err);
        toast.error(err.message);
      });
  };



  const onSubmit = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    fetcher<Item[]>(`/purchase/${params.id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        user_id: Number(cookies.userID),
      }),
    })
      .then((_) => window.location.reload())
      .catch((err) => {
        console.log(`POST error:`, err);
        toast.error(err.message);
      });
  };

  useEffect(() => {
    fetchItem();
  }, []);

  return (
    <div className="ItemDetail">
      <MerComponent condition={() => item !== undefined}>
        {item && itemImage && (
          <div className="item-details">
            <img
              className="item-image"
              src={URL.createObjectURL(itemImage)}
              alt="item"
              onClick={() => navigate(`/item/${item.id}`)}
            />
            <p>
            </p>
            <div className="user-info-text">
              <span className="item-name">{item.name}</span>
              <br />
              <div className="description-container">
                <span className="detail-title">
                  <strong>Descripetion</strong>
                </span>
              </div>
              <span className="description">{item.description}</span>
              <br />
              <div className="description-container">
                <span>
                  <strong className="detail-title">Information</strong>
                </span>
              </div>
              <table className="user-info-table">
                <tbody>
                  <tr>
                    <th>User ID</th>
                    <td>{item.user_id}</td>
                  </tr>
                  <tr>
                    <th>Category</th>
                    <td>{item.category_name}</td>
                  </tr>
                </tbody>
              </table>
              <div className="spacer"></div>
            </div>


            {item.status === ItemStatus.ItemStatusSoldOut ? (
              <div className="PriceandPurchase">
                <span className="price">
                  <strong>
                    <span className="currency-mark">￥</span>
                    {item.price.toLocaleString()}
                  </strong>
                </span>
                <button disabled={true} onClick={onSubmit} id="SoldOutMerButton">
                  <strong>SoldOut</strong>
                </button>
              </div>
            ) : (
              <div className="PriceandPurchase">
                <span className="price">
                  <strong>
                    <span className="currency-mark">￥</span>
                    {item.price.toLocaleString()}
                  </strong>
                </span>
                <button onClick={onSubmit} id="PurchaseMerButton">
                  <strong>Purchase</strong>
                </button>
              </div>
            )}
          </div>
        )
        }
      </MerComponent >
    </div>
  );


};
