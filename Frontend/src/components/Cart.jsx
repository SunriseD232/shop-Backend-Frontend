


import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from 'react-bootstrap';

const Cart = () => {
  const { cart, removeFromCart , clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      console.log("Cart", cart);
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const backendProductIds = response.data.map((product) => product.id);

        const updatedCartItems = cart.filter((item) => backendProductIds.includes(item.id));
        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${item.id}/image`,
                { responseType: "blob" }
              );
              const imageFile = await converUrlToFile(response.data, response.data.imageName);
              setCartImage(imageFile)
              const imageUrl = URL.createObjectURL(response.data);
              return { ...item, imageUrl };
            } catch (error) {
              console.error("Error fetching image:", error);
              return { ...item, imageUrl: "placeholder-image-url" };
            }
          })
        );
        console.log("cart",cart)
        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert("Cannot add more than available stock");
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };
  

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
        const updatedStockQuantity = item.stockQuantity - item.quantity;
  
        const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };
        console.log("updated product data", updatedProductData)
  
        const cartProduct = new FormData();
        cartProduct.append("imageFile", cartImage);
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );
  
        await axios
          .put(`http://localhost:8080/api/product/${item.id}`, cartProduct, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log("Product updated successfully:", (cartProduct));
          })
          .catch((error) => {
            console.error("Error updating product:", error);
          });
      }
      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.log("error during checkout", error);
    }
  };

  return (
    <div style={{ 
      background: '#ffffff', 
      minHeight: '100vh', 
      paddingTop: '100px', 
      paddingBottom: '40px'
    }}>
      {/* Верхний баннер */}
      <div style={{
        background: '#ffffff',
        border: '3px solid #333333',
        margin: '0 20px 40px 20px',
        padding: '40px 30px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontWeight: '800', 
          fontSize: '2.5rem', 
          color: '#333333',
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          🛒 Корзина покупок
        </h1>
        <p style={{
          fontSize: '1.2rem', 
          color: '#666666', 
          lineHeight: '1.6',
          fontWeight: '500',
          margin: 0
        }}>
          {cartItems.length > 0 
            ? `Товаров в корзине: ${cartItems.reduce((sum, item) => sum + item.quantity, 0)}`
            : 'Ваша корзина пуста'
          }
        </p>
      </div>

      {/* Основной контент */}
      <div style={{
        padding: "20px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {cartItems.length === 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: '#666666',
            fontWeight: 500,
            fontSize: '1.4rem',
            padding: '4rem',
            background: '#ffffff',
            border: '2px solid #e0e0e0',
            textAlign: 'center'
          }}>
            <span style={{fontSize: '4rem', marginBottom: '1rem'}}>🛒</span>
            <span>Добавьте футболки для продолжения покупок</span>
          </div>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px"
          }}>
            {/* Товары в корзине */}
            {cartItems.map((item, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={item.id}
                  style={{
                    background: "#ffffff",
                    border: "2px solid #e0e0e0",
                    display: "flex",
                    flexDirection: isEven ? "row" : "row-reverse",
                    minHeight: "200px",
                    transition: "all 0.3s ease",
                    overflow: "hidden"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#333333";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e0e0e0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Блок изображения */}
                  <div style={{
                    flex: "0 0 30%",
                    position: "relative",
                    background: "#f8f9fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px"
                  }}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: "100%",
                        maxWidth: "200px",
                        height: "auto",
                        objectFit: "contain"
                      }}
                    />
                  </div>

                  {/* Блок информации */}
                  <div style={{
                    flex: "1",
                    padding: "30px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    textAlign: isEven ? "left" : "right"
                  }}>
                    <div>
                      <h2 style={{
                        fontSize: "1.8rem",
                        fontWeight: "700",
                        color: "#333333",
                        marginBottom: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        lineHeight: "1.2"
                      }}>
                        {item.name}
                      </h2>
                      
                      <p style={{
                        fontSize: "1.1rem",
                        color: "#666666",
                        marginBottom: "15px",
                        fontStyle: "italic"
                      }}>
                        {item.brand}
                      </p>

                      <div style={{
                        fontSize: "1.8rem",
                        fontWeight: "800",
                        color: "#333333",
                        marginBottom: "20px"
                      }}>
                        {item.price} ₽ за шт.
                      </div>

                      <div style={{
                        fontSize: "1.4rem",
                        fontWeight: "700",
                        color: "#333333",
                        marginBottom: "20px"
                      }}>
                        Итого: {item.price * item.quantity} ₽
                      </div>
                    </div>

                    {/* Кнопки управления */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      justifyContent: isEven ? "flex-start" : "flex-end"
                    }}>
                      {/* Количество */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        background: "#f8f9fa",
                        padding: "10px 20px",
                        border: "2px solid #e0e0e0"
                      }}>
                        <button
                          style={{
                            background: "#ffffff",
                            border: "2px solid #333333",
                            color: "#333333",
                            width: "40px",
                            height: "40px",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                          }}
                          onClick={() => handleDecreaseQuantity(item.id)}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#333333";
                            e.target.style.color = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "#ffffff";
                            e.target.style.color = "#333333";
                          }}
                        >
                          -
                        </button>
                        
                        <span style={{
                          fontSize: "1.3rem",
                          fontWeight: "700",
                          color: "#333333",
                          minWidth: "40px",
                          textAlign: "center"
                        }}>
                          {item.quantity}
                        </span>
                        
                        <button
                          style={{
                            background: "#ffffff",
                            border: "2px solid #333333",
                            color: "#333333",
                            width: "40px",
                            height: "40px",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                          }}
                          onClick={() => handleIncreaseQuantity(item.id)}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#333333";
                            e.target.style.color = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "#ffffff";
                            e.target.style.color = "#333333";
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/* Кнопка удаления */}
                      <button
                        style={{
                          background: "#ffffff",
                          border: "2px solid #dc3545",
                          color: "#dc3545",
                          padding: "10px 20px",
                          fontSize: "1rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          textTransform: "uppercase"
                        }}
                        onClick={() => handleRemoveFromCart(item.id)}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#dc3545";
                          e.target.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "#ffffff";
                          e.target.style.color = "#dc3545";
                        }}
                      >
                        🗑️ Удалить
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Итоговая сумма и оформление заказа */}
            <div style={{
              background: "#f8f9fa",
              border: "3px solid #333333",
              padding: "40px",
              textAlign: "center",
              marginTop: "30px"
            }}>
              <div style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "#333333",
                marginBottom: "30px",
                textTransform: "uppercase"
              }}>
                💰 Итого: {totalPrice} ₽
              </div>
              
              <Button
                style={{
                  background: "#ffffff",
                  border: "3px solid #333333",
                  color: "#333333",
                  padding: "20px 60px",
                  fontSize: "1.4rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  letterSpacing: "1px"
                }}
                onClick={() => setShowModal(true)}
                onMouseEnter={(e) => {
                  e.target.style.background = "#ffffffff";
                  e.target.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#ffffff";
                  e.target.style.color = "#333333";
                }}
              >
                🎉 Оформить заказ
              </Button>
            </div>
          </div>
        )}
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;
