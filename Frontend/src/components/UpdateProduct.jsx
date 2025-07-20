import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );

        setProduct(response.data);
      
        const responseImage = await axios.get(
          `http://localhost:8080/api/product/${id}/image`,
          { responseType: "blob" }
        );
       const imageFile = await converUrlToFile(responseImage.data,response.data.imageName)
        setImage(imageFile);     
        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    console.log("image Updated", image);
  }, [image]);



  const converUrlToFile = async(blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }
 
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("images", image)
    console.log("productsdfsfsf", updateProduct)
    const updatedProduct = new FormData();
    updatedProduct.append("imageFile", image);
    updatedProduct.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );
  

  console.log("formData : ", updatedProduct)
    axios
      .put(`http://localhost:8080/api/product/${id}`, updatedProduct, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Product updated successfully:", updatedProduct);
        alert("Product updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        console.log("product unsuccessfull update",updateProduct)
        alert("Failed to update product. Please try again.");
      });
  };
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };
  
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100%",
      backgroundColor: "#ffffff",
      display: "flex",
      paddingTop: "80px"
    }}>
      {/* Левая панель - Форма */}
      <div style={{
        width: "50%",
        padding: "40px",
        borderRight: "2px solid #e0e0e0",
        overflowY: "auto"
      }}>
        <div style={{
          maxWidth: "500px",
          margin: "0 auto"
        }}>
          <h2 style={{ 
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#333333",
            textAlign: "center",
            marginBottom: "30px",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>✏️ Редактировать футболку</h2>
          
          <form onSubmit={handleSubmit} autoComplete="off">
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
                placeholder={product.name}
                value={updateProduct.name}
                onChange={handleChange}
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
              }}>Бренд</label>
              <input
                type="text"
                name="brand"
                className="form-control"
                placeholder={product.brand}
                value={updateProduct.brand}
                onChange={handleChange}
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
                placeholder={product.description}
                name="description"
                onChange={handleChange}
                value={updateProduct.description}
                id="description"
                rows={4}
                required
                minLength={5}
                maxLength={200}
                style={{
                  border: "2px solid #e0e0e0",
                  padding: "12px 16px",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  resize: "vertical"
                }}
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
                onChange={handleChange}
                value={updateProduct.price}
                placeholder={product.price}
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
                value={updateProduct.category}
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder={product.stockQuantity}
                value={updateProduct.stockQuantity}
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
              }}>Изображение футболки</label>
              <input
                className="form-control"
                type="file"
                onChange={handleImageChange}
                placeholder="Загрузить изображение футболки"
                name="imageUrl"
                id="imageUrl"
                accept="image/*"
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
                checked={updateProduct.productAvailable}
                onChange={(e) =>
                  setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })
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
            <button type="submit" className="btn btn-primary w-100" style={{
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
              e.target.style.backgroundColor = "#ffffffff";
              e.target.style.borderColor = "#000000";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#ffffffff";
              e.target.style.borderColor = "#333333";
            }}>
              💾 Сохранить изменения
            </button>
          </form>
        </div>
      </div>

      {/* Правая панель - Превью изображения */}
      <div style={{
        width: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        padding: "40px"
      }}>
        <div style={{
          textAlign: "center",
          maxWidth: "400px"
        }}>
          {image ? (
            <div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#333333",
                marginBottom: "20px",
                textTransform: "uppercase"
              }}>Превью футболки</h3>
              <div style={{
                border: "2px solid #e0e0e0",
                backgroundColor: "white",
                padding: "20px",
                display: "inline-block"
              }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={product.imageName || "Превью футболки"}
                  style={{ 
                    width: "100%", 
                    maxWidth: "300px",
                    height: "auto",
                    display: "block"
                  }}
                />
              </div>
              <p style={{
                marginTop: "15px",
                color: "#666666",
                fontSize: "1rem"
              }}>
                {updateProduct.name || product.name || "Название футболки"}
              </p>
            </div>
          ) : (
            <div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#999999",
                marginBottom: "20px",
                textTransform: "uppercase"
              }}>Изображение не загружено</h3>
              <div style={{
                border: "2px dashed #cccccc",
                padding: "60px 40px",
                color: "#999999",
                fontSize: "1.1rem"
              }}>
                �️ Выберите файл изображения<br />
                для предварительного просмотра
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;