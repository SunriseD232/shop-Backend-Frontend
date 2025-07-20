import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/register", formData);
      setSuccess("Регистрация прошла успешно! Теперь вы можете войти.");
        setTimeout(() => {
          navigate("/"); // Always redirect to root
        }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при регистрации. Попробуйте другой логин.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      width: "100%",
      background: "#ffffff",
      display: "flex",
      paddingTop: "80px"
    }}>
      {/* Левая панель - форма регистрации */}
      <div style={{
        width: "50%",
        background: "#ffffff",
        border: "2px solid #333333",
        borderRight: "1px solid #333333",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "3rem"
      }}>
        <div style={{ 
          maxWidth: "400px", 
          width: "100%"
        }}>
          <h2 style={{
            fontWeight: 700,
            fontSize: "2.5rem",
            color: "#333333",
            marginBottom: "3rem",
            textAlign: "center"
          }}>РЕГИСТРАЦИЯ</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ 
                display: "block",
                fontWeight: '600', 
                color: '#333333',
                marginBottom: "0.5rem",
                fontSize: "1.1rem"
              }}>ЛОГИН</label>
              <input
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                required
                placeholder="Выберите логин"
                autoFocus
                style={{
                  width: "100%",
                  border: '2px solid #333333',
                  padding: '15px 20px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: "#ffffff"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#333333';
                }}
              />
            </div>
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ 
                display: "block",
                fontWeight: '600', 
                color: '#333333',
                marginBottom: "0.5rem",
                fontSize: "1.1rem"
              }}>ПАРОЛЬ</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Создайте пароль"
                style={{
                  width: "100%",
                  border: '2px solid #333333',
                  padding: '15px 20px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: "#ffffff"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#333333';
                }}
              />
            </div>
            {error && (
              <div style={{
                background: "#ffffff",
                border: "2px solid #e74c3c",
                color: "#e74c3c",
                padding: "1rem",
                marginBottom: "1rem",
                textAlign: "center",
                fontWeight: 600
              }}>{error}</div>
            )}
            {success && (
              <div style={{
                background: "#ffffff",
                border: "2px solid #27ae60",
                color: "#27ae60",
                padding: "1rem",
                marginBottom: "1rem",
                textAlign: "center",
                fontWeight: 600
              }}>{success}</div>
            )}
            <button 
              type="submit" 
              disabled={loading} 
              style={{
                width: "100%",
                fontSize: '1.2rem',
                padding: '18px 0',
                fontWeight: 700,
                background: loading ? '#cccccc' : '#ffffffff',
                border: '2px solid #333333',
                color: loading ? '#666666' : '#ffffff',
                transition: 'all 0.3s ease',
                marginTop: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = "#ffffff";
                  e.target.style.color = "#333333";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = "#ffffffff";
                  e.target.style.color = "#ffffff";
                }
              }}
            >
              {loading ? "РЕГИСТРАЦИЯ..." : "ЗАРЕГИСТРИРОВАТЬСЯ"}
            </button>
          </form>
          <div style={{ 
            marginTop: "2rem", 
            textAlign: "center",
            padding: "1.5rem 0",
            borderTop: "2px solid #333333"
          }}>
            <span style={{ color: '#333333', fontWeight: 500 }}>УЖЕ ЕСТЬ АККАУНТ? </span>
            <a href="/login" style={{
              color: '#333333',
              textDecoration: 'underline',
              fontWeight: '700',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#666666';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#333333';
            }}>
              ВОЙТИ
            </a>
          </div>
        </div>
      </div>

      {/* Правая панель - декоративная */}
      <div style={{
        width: "50%",
        background: "#ffffff",
        border: "2px solid #333333",
        borderLeft: "1px solid #333333",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "3rem"
      }}>
        <div style={{
          textAlign: "center",
          maxWidth: "400px"
        }}>
          <h1 style={{
            fontSize: "3rem",
            fontWeight: 800,
            color: "#333333",
            marginBottom: "2rem",
            letterSpacing: "3px"
          }}>
            ПРИСОЕДИНЯЙТЕСЬ
          </h1>
          <div style={{
            width: "120px",
            height: "120px",
            border: "3px solid #333333",
            margin: "2rem auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              border: "2px solid #333333"
            }}></div>
            <div style={{
              position: "absolute",
              width: "40px",
              height: "40px",
              border: "2px solid #333333",
              top: "10px",
              right: "10px"
            }}></div>
          </div>
          <p style={{
            fontSize: "1.2rem",
            color: "#333333",
            lineHeight: "1.6",
            fontWeight: 500
          }}>
            Создайте аккаунт и получите доступ к персонализированным покупкам и эксклюзивным предложениям
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;