import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    // Убираем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'ФИО обязательно для заполнения';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Номер телефона обязателен';
    } else if (!/^[\+]?[0-9\-\(\)\s]{10,}$/.test(customerInfo.phone)) {
      newErrors.phone = 'Некорректный номер телефона';
    }
    
    if (!customerInfo.address.trim()) {
      newErrors.address = 'Адрес доставки обязателен';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleCheckout(customerInfo);
    }
  };

  const handleCloseModal = () => {
    setCustomerInfo({ fullName: '', phone: '', address: '' });
    setErrors({});
    handleClose();
  };
  return (
    <div className="checkoutPopup">
      <Modal show={show} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton style={{ 
          background: '#ffffff', 
          borderBottom: '2px solid #333333',
          color: '#333333'
        }}>
          <Modal.Title style={{ 
            fontWeight: 700, 
            fontSize: '1.8rem',
            color: '#333333'
          }}>Оформление заказа</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 
          background: '#ffffff', 
          padding: '2rem'
        }}>
          <div className="checkout-items">
            {cartItems.length === 0 ? (
              <div className="text-center" style={{ 
                color: '#333333', 
                fontSize: '1.3rem', 
                margin: '2rem 0',
                background: '#ffffff',
                padding: '2rem',
                border: '2px solid #333333'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Корзина пуста</div>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="checkout-item" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '16px', 
                  background: '#ffffff', 
                  border: '2px solid #333333',
                  padding: '16px 20px',
                  transition: 'all 0.3s ease'
                }}>
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="cart-item-image" 
                    style={{ 
                      width: '90px', 
                      height: '90px', 
                      objectFit: 'cover', 
                      border: '2px solid #333333',
                      marginRight: '20px', 
                      background: '#ffffff'
                    }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: 600, 
                      fontSize: '1.1rem', 
                      marginBottom: '4px',
                      color: '#333333'
                    }}>{item.name}</div>
                    <div style={{ fontSize: '1rem', color: '#333333' }}>Количество: <b>{item.quantity}</b></div>
                    <div style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 700,
                      color: '#333333'
                    }}>Цена: {item.price * item.quantity} ₽</div>
                  </div>
                </div>
              ))
            )}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <div style={{ 
                fontWeight: 800, 
                fontSize: '1.6rem',
                color: '#333333',
                padding: '1rem',
                border: '2px solid #333333',
                margin: '1rem 0',
                background: '#ffffff'
              }}>
                Итого: {totalPrice} ₽
              </div>
            </div>

            {/* Форма с информацией о заказчике */}
            <div style={{ 
              marginTop: '24px', 
              padding: '24px',
              background: '#ffffff',
              border: '2px solid #333333'
            }}>
              <h5 style={{ 
                marginBottom: '20px',
                fontWeight: 700,
                color: '#333333'
              }}>Информация о заказчике</h5>
              
              <div className="mb-3">
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600, 
                  color: '#333333' 
                }}>ФИО *</label>
                <input
                  type="text"
                  name="fullName"
                  value={customerInfo.fullName}
                  onChange={handleInputChange}
                  placeholder="Введите ваше полное имя"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.fullName ? '2px solid #e74c3c' : '2px solid #333333',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    background: '#ffffff'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#333333';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.fullName ? '#e74c3c' : '#333333';
                  }}
                />
                {errors.fullName && (
                  <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '4px', fontWeight: 500 }}>
                    {errors.fullName}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600, 
                  color: '#333333' 
                }}>Номер телефона *</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+7 (900) 123-45-67"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.phone ? '2px solid #e74c3c' : '2px solid #333333',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    background: '#ffffff'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#333333';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.phone ? '#e74c3c' : '#333333';
                  }}
                />
                {errors.phone && (
                  <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '4px', fontWeight: 500 }}>
                    {errors.phone}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600, 
                  color: '#333333' 
                }}>Адрес доставки *</label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  placeholder="Введите полный адрес доставки (город, улица, дом, квартира)"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: errors.address ? '2px solid #e74c3c' : '2px solid #333333',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    background: '#ffffff',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#333333';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.address ? '#e74c3c' : '#333333';
                  }}
                />
                {errors.address && (
                  <div style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '4px', fontWeight: 500 }}>
                    {errors.address}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ 
          background: '#ffffff', 
          borderTop: '2px solid #333333',
          display: 'flex', 
          justifyContent: 'center', 
          gap: '16px',
          padding: '1.5rem 2rem'
        }}>
          <Button 
            variant="secondary" 
            onClick={handleCloseModal} 
            style={{ 
              fontWeight: 600, 
              padding: '12px 24px', 
              fontSize: '1rem',
              background: '#ffffff',
              color: '#333333',
              border: '2px solid #333333',
              transition: 'all 0.3s ease'
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
            Закрыть
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            style={{ 
              fontWeight: 600, 
              padding: '12px 24px', 
              fontSize: '1rem',
              background: '#ffffffff',
              color: '#ffffff',
              border: '2px solid #333333',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#ffffff";
              e.target.style.color = "#333333";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#ffffffff";
              e.target.style.color = "#ffffff";
            }}
            disabled={cartItems.length === 0}
          >
            Подтвердить покупку
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CheckoutPopup;
