import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import UpdateProduct from "./UpdateProduct";
import { jwtDecode } from "jwt-decode";
const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData } = useContext(AppContext);
  // Получаем роль из JWT токена
  let userRole = null;
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      console.log('decoded JWT:', decoded);
      console.log('JWT keys:', Object.keys(decoded));
      for (const key in decoded) {
        console.log(`JWT field [${key}]:`, decoded[key]);
      }
      // Попробуем все варианты
      if (decoded.role) {
        userRole = decoded.role;
      } else if (decoded.authorities) {
        if (Array.isArray(decoded.authorities)) {
          // authorities может быть массивом строк или объектов
          for (const a of decoded.authorities) {
            if (typeof a === 'string' && a.toUpperCase().includes('ADMIN')) {
              userRole = a;
              break;
            }
            if (typeof a === 'object' && a.authority && a.authority.toUpperCase().includes('ADMIN')) {
              userRole = a.authority;
              break;
            }
          }
          // если не нашли ADMIN, берём первый
          if (!userRole) {
            if (typeof decoded.authorities[0] === 'string') userRole = decoded.authorities[0];
            if (typeof decoded.authorities[0] === 'object' && decoded.authorities[0].authority) userRole = decoded.authorities[0].authority;
          }
        } else if (typeof decoded.authorities === 'string') {
          userRole = decoded.authorities;
        }
      } else if (decoded.authority) {
        userRole = decoded.authority;
      } else if (decoded.roles) {
        // иногда роли лежат в roles
        if (Array.isArray(decoded.roles)) {
          userRole = decoded.roles.find(r => r.toUpperCase().includes('ADMIN')) || decoded.roles[0];
        } else if (typeof decoded.roles === 'string') {
          userRole = decoded.roles;
        }
      }
    }
  } catch (e) {
    userRole = null;
  }
  console.log('userRole from JWT:', userRole);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(
        `/product/${id}/image`,
        { responseType: "blob" }
      );
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      removeFromCart(id);
      console.log("Product deleted successfully");
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  // Count quantity in cart (safe for initial render)
  const cartItem = product ? cart.find((item) => item.id === product.id) : null;
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const handleAddToCart = () => {
    if (product) addToCart(product);
  };
  const handleRemoveFromCart = () => {
    if (product) {
      // Always decrement by 1, remove only if quantity becomes 0
      removeFromCart(product.id, 1);
    }
  };
  if (!product) {
    return (
      <div className="text-center" style={{ padding: "8rem" }}>
        Загрузка футболки...
      </div>
    );
  }
  // Категории: value -> description
  const categoryMap = {
    casual: "Повседневные",
    funny: "Смешные принты", 
    civilian: "Хлопковые футболки",
    military: "Футболки с принтами",
    vintage: "Винтажный стиль",
    modern: "Современный дизайн",
    cute: "Милые котики",
    other: "Другие модели"
  };
  const categoryDescription = categoryMap[product.category] || product.category;
  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100%",
      backgroundColor: "#ffffff",
      padding: "40px 20px"
    }}>
      {/* Изображение товара вверху */}
      <div style={{
        width: "100%",
        textAlign: "center",
        marginBottom: "40px",
        paddingTop: "60px"
      }}>
        <img
          src={imageUrl}
          alt={product.imageName}
          style={{ 
            maxWidth: "600px",
            width: "100%",
            height: "auto",
            objectFit: "contain"
          }}
        />
        
        {/* Статус наличия под изображением */}
        <div style={{
          marginTop: "15px",
          display: "inline-block",
          padding: "12px 25px",
          backgroundColor: product.productAvailable ? "#d4edda" : "#f8d7da",
          border: `2px solid ${product.productAvailable ? "#28a745" : "#dc3545"}`,
          color: product.productAvailable ? "#155724" : "#721c24",
          fontSize: "1.1rem",
          fontWeight: "600",
          textTransform: "uppercase"
        }}>
          {product.productAvailable ? "✅ В наличии" : "❌ Нет в наличии"}
        </div>
      </div>

      {/* Информация о товаре */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%"
      }}>
        {/* Категория и дата в одну строку */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          border: "2px solid #e0e0e0"
        }}>
          <div style={{ 
            color: '#666666', 
            fontSize: '1.1rem', 
            textTransform: 'uppercase',
            fontWeight: '600'
          }}>
            Категория: {categoryDescription}
          </div>
          <div style={{ 
            fontSize: '1rem', 
            color: '#999999'
          }}>
            Дата добавления: {new Date(product.releaseDate).toLocaleDateString()}
          </div>
        </div>

        {/* Название и бренд */}
        <div style={{
          textAlign: "center",
          marginBottom: "30px"
        }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            marginBottom: "15px", 
            fontWeight: "800",
            color: "#333333",
            textTransform: "uppercase",
            letterSpacing: "1px",
            lineHeight: "1.2"
          }}>
            {product.name}
          </h1>

          <div style={{ 
            fontStyle: 'italic', 
            color: '#666666', 
            fontSize: '1.3rem',
            fontWeight: '500'
          }}>
            {product.brand}
          </div>
        </div>

        {/* Описание на всю ширину */}
        <div style={{
          marginBottom: "30px"
        }}>
          <div style={{ 
            marginBottom: "15px",
            fontWeight: "600", 
            fontSize: '1.2rem', 
            color: '#333333',
            textTransform: 'uppercase',
            textAlign: "center"
          }}>
            📝 Описание футболки
          </div>
          <div style={{ 
            color: '#555555', 
            fontSize: '1.1rem', 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            lineHeight: '1.6',
            border: '2px solid #e0e0e0',
            textAlign: "center",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            {product.description}
          </div>
        </div>

        {/* Цена и остаток на складе в одну строку */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          border: "2px solid #e0e0e0"
        }}>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: "800",
            color: "#333333"
          }}>
            💰 {product.price} ₽
          </div>

          <div style={{ 
            fontSize: '1.1rem', 
            color: '#333333'
          }}>
            <span style={{ fontWeight: '600', textTransform: 'uppercase' }}>Остаток на складе: </span>
            <span style={{ 
              color: product.stockQuantity > 0 ? '#28a745' : '#dc3545', 
              fontWeight: '700',
              fontSize: '1.2rem'
            }}>
              {product.stockQuantity}
            </span>
          </div>
        </div>

        {/* Кнопки управления по центру */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "30px"
        }}>
          {/* Кнопки добавления в корзину */}
          <div>
            {product.productAvailable ? (
              quantityInCart > 0 ? (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  backgroundColor: "#f8f9fa",
                  padding: "15px 20px",
                  border: "2px solid #e0e0e0"
                }}>
                  <button
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #333333",
                      color: "#333333",
                      width: "50px",
                      height: "50px",
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onClick={handleRemoveFromCart}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#333333";
                      e.target.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#ffffff";
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
                    padding: "0 15px"
                  }}>
                    {quantityInCart}
                  </span>
                  
                  <button
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #333333",
                      color: "#333333",
                      width: "50px",
                      height: "50px",
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onClick={handleAddToCart}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#333333";
                      e.target.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#ffffff";
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
                    color: '#dc3545',
                    fontWeight: '600',
                    fontSize: '1.2rem',
                    padding: '15px 30px',
                    backgroundColor: '#f8d7da',
                    border: '2px solid #dc3545',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                  }}>
                    😿 Футболка закончилась
                  </div>
                ) : (
                  <button
                    style={{
                      backgroundColor: "#ffffff",
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
                    onClick={handleAddToCart}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#333333";
                      e.target.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#ffffff";
                      e.target.style.color = "#333333";
                    }}
                  >
                    🛒 Добавить в корзину
                  </button>
                )
              )
            ) : (
              <button 
                style={{
                  backgroundColor: "#f5f5f5",
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

        {/* Админские кнопки по центру */}
        {(userRole && userRole.toUpperCase() === "ADMIN") && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "30px"
          }}>
            <button
              type="button"
              onClick={handleEditClick}
              style={{ 
                backgroundColor: "#ffffff",
                border: "2px solid #333333",
                color: "#333333",
                padding: "15px 30px",
                fontSize: "1.1rem",
                fontWeight: "600",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#333333";
                e.target.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#ffffff";
                e.target.style.color = "#333333";
              }}
            >
              ✏️ Редактировать
            </button>
            <button
              type="button"
              onClick={deleteProduct}
              style={{ 
                backgroundColor: "#ffffff",
                border: "2px solid #dc3545",
                color: "#dc3545",
                padding: "15px 30px",
                fontSize: "1.1rem",
                fontWeight: "600",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#dc3545";
                e.target.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#ffffff";
                e.target.style.color = "#dc3545";
              }}
            >
              🗑️ Удалить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;