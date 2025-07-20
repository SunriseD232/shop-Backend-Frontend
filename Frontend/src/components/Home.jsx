import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png"

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, removeFromCart, cart } = useContext(AppContext);
  const [productsWithImages, setProductsWithImages] = useState([]);
  const imageCache = React.useRef({});

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        // If cart is empty, clear image cache to force reload after checkout
        if (cart.length === 0) {
          imageCache.current = {};
        }
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            if (imageCache.current[product.id]) {
              return { ...product, imageUrl: imageCache.current[product.id] };
            }
            try {
              const response = await axios.get(
                `/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              imageCache.current[product.id] = imageUrl;
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProductsWithImages(updatedProducts);
      };
      fetchImagesAndUpdateProducts();
    }
  }, [data, cart]);

  // Фильтрация продуктов по категории
  const filteredProducts = selectedCategory
    ? productsWithImages.filter((product) => product.category === selectedCategory)
    : productsWithImages;

  if (isError) {
    return (
      <div className="text-center" style={{ padding: "8rem" }}>
        <img src={unplugged} alt="Ошибка" style={{ width: '100px', height: '100px' }}/>
        <div style={{marginTop: '1rem', fontSize: '1.2rem'}}>Ошибка загрузки моделей</div>
      </div>
    );
  }

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', paddingTop: '20px' }}>
      {/* Верхний баннер */}
      <div style={{
        background: '#ffffff',
        border: '3px solid #333333',
        margin: '100px 20px 40px 20px',
        padding: '50px 30px',
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
          🐱 KittyShirts
        </h1>
        <p style={{
          fontSize: '1.2rem', 
          color: '#666666', 
          lineHeight: '1.6',
          fontWeight: '500',
          margin: 0,
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Уникальные футболки с милыми котиками • Высокое качество • 100% хлопок
        </p>
      </div>

      {/* Основная сетка товаров */}
      <div style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {filteredProducts.length === 0 ? (
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
            <span style={{fontSize: '4rem', marginBottom: '1rem'}}>🐱</span>
            <span>Нет доступных футболок</span>
          </div>
        ) : (
          filteredProducts.map((product, index) => {
            const { id, name, price, productAvailable, imageUrl, description } = product;
            const cartItem = cart.find((item) => item.id === id);
            const quantityInCart = cartItem ? cartItem.quantity : 0;
            
            // Чередуем расположение: четные индексы - изображение слева, нечетные - справа
            const isEven = index % 2 === 0;
            
            return (
              <div
                key={id}
                style={{
                  background: productAvailable ? "#ffffff" : "#f5f5f5",
                  border: "2px solid #e0e0e0",
                  display: "flex",
                  flexDirection: isEven ? "row" : "row-reverse",
                  minHeight: "280px",
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
                  flex: "0 0 40%",
                  position: "relative",
                  background: "#ffffff"
                }}>
                  <Link
                    to={`/product/${id}`}
                    style={{ 
                      textDecoration: "none", 
                      display: "block",
                      width: "100%",
                      height: "100%"
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "all 0.3s ease"
                      }}
                      onError={(e) => {
                        e.target.src = unplugged;
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                      }}
                    />
                  </Link>
                  
                  {/* Статус наличия в углу изображения */}
                  <div style={{
                    position: "absolute",
                    top: "15px",
                    right: isEven ? "15px" : "auto",
                    left: isEven ? "auto" : "15px",
                    background: productAvailable ? "#28a745" : "#dc3545",
                    color: "white",
                    padding: "8px 15px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    textTransform: "uppercase"
                  }}>
                    {productAvailable ? "В наличии" : "Нет в наличии"}
                  </div>
                </div>

                {/* Блок контента */}
                <div style={{
                  flex: "1",
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textAlign: isEven ? "left" : "right"
                }}>
                  <div>
                    <Link
                      to={`/product/${id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <h2 style={{
                        fontSize: "2rem",
                        fontWeight: "700",
                        color: "#333333",
                        marginBottom: "15px",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        lineHeight: "1.2"
                      }}>
                        {name}
                      </h2>
                    </Link>
                    
                    <p style={{
                      fontSize: "1.1rem",
                      color: "#666666",
                      lineHeight: "1.6",
                      marginBottom: "20px",
                      maxWidth: "500px",
                      marginLeft: isEven ? "0" : "auto",
                      marginRight: isEven ? "auto" : "0"
                    }}>
                      {description || "Стильная футболка с оригинальным принтом котика. Идеально подходит для повседневной носки."}
                    </p>

                    <div style={{
                      fontSize: "2.2rem",
                      fontWeight: "800",
                      color: "#333333",
                      marginBottom: "25px"
                    }}>
                      {price} ₽
                    </div>
                  </div>

                  {/* Кнопки управления */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    justifyContent: isEven ? "flex-start" : "flex-end"
                  }}>
                    {productAvailable ? (
                      quantityInCart > 0 ? (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          background: "#f8f8f8",
                          padding: "10px 20px",
                          border: "2px solid #e0e0e0"
                        }}>
                          <button
                            style={{
                              background: "#ffffff",
                              border: "2px solid #333333",
                              color: "#333333",
                              width: "50px",
                              height: "50px",
                              fontSize: "1.5rem",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.3s ease"
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              if (quantityInCart > 1) {
                                removeFromCart(product.id, 1);
                              } else if (quantityInCart === 1) {
                                removeFromCart(product.id);
                              }
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = "#333333";
                              e.target.style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "#ffffff";
                              e.target.style.color = "#333333";
                            }}
                            disabled={quantityInCart === 0}
                          >
                            -
                          </button>
                          
                          <span style={{
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            color: "#333333",
                            minWidth: "50px",
                            textAlign: "center",
                            padding: "0 10px"
                          }}>
                            {quantityInCart}
                          </span>
                          
                          <button
                            style={{
                              background: "#ffffff",
                              border: "2px solid #333333",
                              color: "#333333",
                              width: "50px",
                              height: "50px",
                              fontSize: "1.5rem",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.3s ease"
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(product);
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = "#333333";
                              e.target.style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "#ffffff";
                              e.target.style.color = "#333333";
                            }}
                            disabled={quantityInCart >= product.stockQuantity}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        product.stockQuantity === 0 ? (
                          <div style={{
                            color: '#e74c3c',
                            fontWeight: '600',
                            fontSize: '1.2rem',
                            padding: '15px 30px',
                            background: '#ffffff',
                            border: '2px solid #e74c3c'
                          }}>
                            😿 Футболка закончилась
                          </div>
                        ) : (
                          <button
                            style={{
                              background: "#ffffff",
                              border: "3px solid #333333",
                              color: "#333333",
                              padding: "15px 40px",
                              fontSize: "1.3rem",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              letterSpacing: "1px"
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(product);
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = "#333333";
                              e.target.style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "#ffffff";
                              e.target.style.color = "#333333";
                            }}
                          >
                            🛒 В корзину
                          </button>
                        )
                      )
                    ) : (
                      <button 
                        style={{
                          background: "#f5f5f5",
                          border: "2px solid #cccccc",
                          color: "#999999",
                          padding: "15px 40px",
                          fontSize: "1.3rem",
                          fontWeight: "600",
                          cursor: "not-allowed",
                          textTransform: "uppercase"
                        }} 
                        disabled
                      >
                        ❌ Нет в наличии
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Home;
