import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

  
const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    // setProduct({...product, image: e.target.files[0]})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Футболка успешно добавлена:", response.data);
        alert("Футболка успешно добавлена!");
        navigate("/products");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.error("Ошибка при добавлении футболки:", error);
        alert("Ошибка при добавлении футболки!");
      });
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100%",
      background: "#ffffff", 
      display: "flex",
      paddingTop: "80px",
      position: "relative"
    }}>
      {/* Левая часть - форма */}
      <div style={{ 
        width: "50%", 
        padding: "40px",
        overflowY: "auto",
        maxHeight: "100vh"
      }}>
        <h2 className="mb-4" style={{ 
          fontWeight: 700, 
          fontSize: "2.2rem",
          color: "#333333",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "30px"
        }}>🐱 Добавить футболку</h2>
        <form onSubmit={submitHandler} autoComplete="off">
          <div className="mb-3">
            <label className="form-label" style={{ 
              fontSize: "1.1rem", 
              fontWeight: "600", 
              color: "#333333",
              textTransform: "uppercase"
            }}>Название футболки</label>
            <input
              type="text"
              className="form-control"
              placeholder="Введите название футболки с котиком"
              onChange={handleInputChange}
              value={product.name}
              name="name"
              required
              minLength={2}
              maxLength={50}
              style={{
                border: "2px solid #e0e0e0",
                padding: "12px 16px",
                fontSize: "1rem",
                transition: "all 0.3s ease"
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ 
              fontSize: "1.1rem", 
              fontWeight: "600", 
              color: "#333333",
              textTransform: "uppercase"
            }}>Производитель</label>
            <input
              type="text"
              name="brand"
              className="form-control"
              placeholder="Введите производителя футболки"
              value={product.brand}
              onChange={handleInputChange}
              id="brand"
              required
              minLength={2}
              maxLength={30}
              style={{
                border: "2px solid #e0e0e0",
                padding: "12px 16px",
                fontSize: "1rem",
                transition: "all 0.3s ease"
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ 
              fontSize: "1.1rem", 
              fontWeight: "600", 
              color: "#333333",
              textTransform: "uppercase"
            }}>Описание</label>
            <textarea
              className="form-control"
              placeholder="Введите описание футболки с котиком"
              value={product.description}
              name="description"
              onChange={handleInputChange}
              id="description"
              rows={4}
              required
              style={{
                border: "2px solid #e0e0e0",
                padding: "12px 16px",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                resize: "vertical"
              }}
              minLength={5}
              maxLength={200}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ 
              fontSize: "1.1rem", 
              fontWeight: "600", 
              color: "#333333",
              textTransform: "uppercase"
            }}>Цена (₽)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Например: 1500"
              onChange={handleInputChange}
              value={product.price}
              name="price"
              id="price"
              required
              min={0}
              style={{
                border: "2px solid #e0e0e0",
                padding: "12px 16px",
                fontSize: "1rem",
                transition: "all 0.3s ease"
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ 
              fontSize: "1.1rem", 
              fontWeight: "600", 
              color: "#333333",
              textTransform: "uppercase"
            }}>Категория</label>
            <select
              className="form-select"
              value={product.category}
              onChange={handleInputChange}
              name="category"
              id="category"
              required
              style={{
                border: "2px solid #e0e0e0",
                padding: "12px 16px",
                fontSize: "1rem",
                transition: "all 0.3s ease"
              }}
            >
              <option value="">Выберите категорию</option>
              <option value="casual">Повседневные</option>
              <option value="funny">Смешные принты</option>
              <option value="civilian">Хлопковые футболки</option>
              <option value="military">Футболки с принтами</option>
              <option value="vintage">Винтажный стиль</option>
              <option value="modern">Современный дизайн</option>
              <option value="cute">Милые котики</option>
              <option value="other">Другие модели</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ 
              fontSize: "1.1rem", 
              fontWeight: "600", 
              color: "#333333",
              textTransform: "uppercase"
            }}>Количество на складе</label>
            <input
              type="number"
              className="form-control"
              placeholder="Остаток на складе"
              onChange={handleInputChange}
              value={product.stockQuantity}
              name="stockQuantity"
              id="stockQuantity"
              required
              min={0}
              style={{
                border: "2px solid #e0e0e0",
                padding: "12px 16px",
                fontSize: "1rem",
                transition: "all 0.3s ease"
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ 
              fontSize: "1.1rem", 
              fontWeight: "600", 
              color: "#333333",
              textTransform: "uppercase"
            }}>Дата выхода</label>
            <input
              type="date"
              className="form-control"
              value={product.releaseDate}
              name="releaseDate"
              onChange={handleInputChange}
              id="releaseDate"
              required
              style={{
                border: "2px solid #e0e0e0",
                padding: "12px 16px",
                fontSize: "1rem",
                transition: "all 0.3s ease"
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ 
              fontSize: "1.1rem", 
              fontWeight: "600", 
              color: "#333333",
              textTransform: "uppercase"
            }}>Изображение футболки</label>
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              required
              style={{
                border: "2px solid #e0e0e0",
                padding: "12px 16px",
                fontSize: "1rem",
                transition: "all 0.3s ease"
              }}
            />
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="productAvailable"
              id="gridCheck"
              checked={product.productAvailable}
              onChange={(e) =>
                setProduct({ ...product, productAvailable: e.target.checked })
              }
              style={{
                width: "20px",
                height: "20px",
                marginTop: "2px"
              }}
            />
            <label className="form-check-label" htmlFor="gridCheck" style={{ 
              fontSize: "1.1rem", 
              fontWeight: "600", 
              color: "#333333",
              textTransform: "uppercase",
              marginLeft: "8px"
            }}>Футболка доступна</label>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              backgroundColor: "#ffffffff",
              border: "2px solid #333333",
              color: "white",
              padding: "15px 30px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(219, 219, 219, 1)";
              e.target.style.borderColor = "#000000";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f3f3f3ff";
              e.target.style.borderColor = "#333333";
            }}
          >
            🐱 Добавить футболку
          </button>
        </form>
      </div>
      
      {/* Правая часть - превью изображения */}
      <div style={{ 
        width: "50%", 
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderLeft: "2px solid #e0e0e0",
        background: "#f8f8f8"
      }}>
        <h3 style={{
          fontSize: "1.8rem",
          fontWeight: "600",
          color: "#333333",
          marginBottom: "30px",
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>
          📷 Превью футболки
        </h3>
        
        {image ? (
          <div style={{
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <img
              src={URL.createObjectURL(image)}
              alt="Превью футболки"
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                border: "3px solid #333333",
                marginBottom: "20px"
              }}
            />
            <p style={{
              fontSize: "1.1rem",
              color: "#666666",
              textAlign: "center",
              fontWeight: "500"
            }}>
              {image.name}
            </p>
          </div>
        ) : (
          <div style={{
            width: "100%",
            maxWidth: "400px",
            height: "400px",
            border: "3px dashed #e0e0e0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#999999"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🖼️</div>
            <p style={{ fontSize: "1.2rem", fontWeight: "600" }}>
              Загрузите изображение футболки
            </p>
            <p style={{ fontSize: "1rem", marginTop: "10px" }}>
              Выберите файл в форме слева
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
