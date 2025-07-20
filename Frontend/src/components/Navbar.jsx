import React, { useEffect, useState } from "react";
import Home from "./Home"
import axios from "axios";
import { useLocation } from "react-router-dom";
// import { json } from "react-router-dom";
// import { BiSunFill, BiMoon } from "react-icons/bi";

const Navbar = ({ onSelectCategory, onSearch, userRole }) => {
  // Функция выхода из аккаунта
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  const location = useLocation();
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  // const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults,setShowSearchResults] = useState(false)
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (value) => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true)
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/search?keyword=${value}`
      );
      setSearchResults(response.data);
      setNoResults(response.data.length === 0);
      console.log(response.data);
    } catch (error) {
      console.error("Error searching:", error);
    }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  
  // const handleChange = async (value) => {
  //   setInput(value);
  //   if (value.length >= 1) {
  //     setShowSearchResults(true);
  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top" style={{
        background: '#ffffff',
        border: '2px solid #e0e0e0',
        borderTop: 'none',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        padding: '1rem 0'
      }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="/" style={{
            color: '#333333',
            fontWeight: '800',
            fontSize: '1.5rem',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            🐱 KittyShirts
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Открыть навигацию"
            style={{
              border: '2px solid #333333',
              padding: '8px 12px'
            }}
          >
            <span className="navbar-toggler-icon" style={{ filter: 'invert(0)' }}></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/" style={{
                  color: '#333333',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  padding: '8px 16px',
                  transition: 'all 0.3s ease',
                  background: '#ffffff',
                  border: '2px solid #e0e0e0',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f8f8f8';
                  e.target.style.borderColor = '#333333';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#e0e0e0';
                }}>
                  🏠 Главная
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about" style={{
                  color: '#333333',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  padding: '8px 16px',
                  transition: 'all 0.3s ease',
                  marginLeft: '8px',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f8f8f8';
                  e.target.style.borderColor = '#333333';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'transparent';
                }}>
                  ℹ️ О нас
                </a>
              </li>
              {userRole === "ADMIN" && (
                <li className="nav-item">
                  <a className="nav-link" href="/add_product" style={{
                    color: '#333333',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    padding: '8px 16px',
                    transition: 'all 0.3s ease',
                    marginLeft: '8px',
                    textTransform: 'uppercase'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f8f8f8';
                    e.target.style.borderColor = '#333333';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = 'transparent';
                  }}>
                    ➕ Добавить футболку
                  </a>
                </li>
              )}
              <li className="nav-item"></li>
            </ul>
            <div className="d-flex justify-content-end align-items-center" style={{minWidth: '180px'}}>
              <button className="btn" style={{
                marginLeft: '60px', 
                border: '2px solid #333333',
                background: '#ffffff',
                color: '#333333',
                fontWeight: '600',
                fontSize: '1rem',
                padding: '10px 20px',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase'
              }} 
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.target.style.background = '#333333';
                e.target.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ffffff';
                e.target.style.color = '#333333';
              }}>
                🚪 Выйти
              </button>
            </div>
            <div className="d-flex align-items-center cart">
              <a href="/cart" className="nav-link" style={{
                color: '#333333',
                fontWeight: '600',
                fontSize: '1.1rem',
                padding: '8px 16px',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f8f8f8';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}>
                🛒 Корзина
              </a>
              <div style={{ position: 'relative' }}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="🔍 Поиск футболок..."
                aria-label="Поиск футболок"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  border: '2px solid #e0e0e0',
                  background: '#ffffff',
                  padding: '10px 16px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onFocusCapture={(e) => {
                  e.target.style.border = '2px solid #333333';
                }}
                onBlurCapture={(e) => {
                  e.target.style.border = '2px solid #e0e0e0';
                }}
              />
              {showSearchResults && (
                <ul className="list-group" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  marginTop: '8px',
                  overflow: 'hidden',
                  border: '2px solid #e0e0e0',
                  background: '#ffffff'
                }}>
                  {searchResults.length > 0 ? (  
                      searchResults.map((result) => (
                        <li key={result.id} className="list-group-item" style={{
                          border: 'none',
                          background: 'transparent',
                          padding: '12px 16px',
                          transition: 'all 0.3s ease',
                          borderBottom: '1px solid #e0e0e0'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#f8f8f8';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}>
                          <a href={`/product/${result.id}`} className="search-result-link" style={{
                            textDecoration: 'none',
                            color: '#333333',
                            fontWeight: '500',
                            display: 'block'
                          }}>
                          <span>🐱 {result.name}</span>
                          </a>
                        </li>
                      ))
                  ) : (
                    noResults && (
                      <p className="no-results-message" style={{
                        padding: '16px',
                        margin: 0,
                        color: '#666666',
                        textAlign: 'center',
                        fontStyle: 'italic'
                      }}>
                        � Футболка с таким названием не найдена
                      </p>
                    )
                  )}
                </ul>
              )}
              </div>
              {/* <button
                className="btn btn-outline-success"
                onClick={handleSearch}
              >
                Найти модель
              </button> */}
              {/* </form> */}
              {/* удалён лишний <div /> */}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
