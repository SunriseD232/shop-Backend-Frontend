import React from "react";

const About = () => {
  return (
    <div style={{
      marginTop: '120px',
      padding: '40px 20px',
      background: '#ffffff',
      minHeight: '80vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        padding: '40px',
        border: '2px solid #e0e0e0'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#333333',
          textAlign: 'center',
          marginBottom: '40px',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          🐱 О нас
        </h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: '#ffffff',
            padding: '30px',
            border: '2px solid #e0e0e0'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#333333',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>
              😸 Наша история
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#666666',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              Мы начали свой путь в 2020 году с простой идеи - создавать качественные футболки с милыми котиками. 
              Наша команда состоит из настоящих любителей кошек, которые знают, что делает дизайн по-настоящему особенным.
            </p>
          </div>

          <div style={{
            background: '#ffffff',
            padding: '30px',
            border: '2px solid #e0e0e0'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#333333',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>
              🎯 Наша миссия
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#666666',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              Мы стремимся принести радость и позитив в повседневную жизнь людей через наши уникальные дизайны футболок. 
              Каждый принт создается с любовью и вниманием к деталям.
            </p>
          </div>

          <div style={{
            background: '#ffffff',
            padding: '30px',
            border: '2px solid #e0e0e0'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#333333',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>
              🏆 Качество
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#666666',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              Мы используем только высококачественные материалы и современные технологии печати. 
              Все наши футболки проходят строгий контроль качества перед отправкой.
            </p>
          </div>

          <div style={{
            background: '#ffffff',
            padding: '30px',
            border: '2px solid #e0e0e0'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#333333',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>
              🌍 Экология
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#666666',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              Мы заботимся об окружающей среде и используем экологически чистые краски и материалы. 
              Наша упаковка также полностью перерабатываемая.
            </p>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          background: '#ffffff',
          padding: '40px',
          border: '2px solid #e0e0e0',
          marginTop: '40px'
        }}>
          <h3 style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            color: '#333333',
            marginBottom: '20px',
            textTransform: 'uppercase'
          }}>
            📞 Свяжитесь с нами
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap'
          }}>
            <div>
              <p style={{
                fontSize: '1.1rem',
                color: '#333333',
                fontWeight: '600',
                margin: '10px 0'
              }}>
                📧 Email: info@kittyshirts.ru
              </p>
            </div>
            <div>
              <p style={{
                fontSize: '1.1rem',
                color: '#333333',
                fontWeight: '600',
                margin: '10px 0'
              }}>
                📱 Телефон: +7 (999) 123-45-67
              </p>
            </div>
            <div>
              <p style={{
                fontSize: '1.1rem',
                color: '#333333',
                fontWeight: '600',
                margin: '10px 0'
              }}>
                🕒 Время работы: Пн-Пт 9:00-18:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
