import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- Home Page ---
const HomePage = () => (
    <div className="home-hero">
        <div className="hero-content">
            <p className="hero-intro">Prazer, eu sou</p>
            <h1 className="hero-title">Valdinei Pereira</h1>
            <p className="hero-subtitle">Escritor, Pastor e Palestrante</p>
            <div className="hero-socials">
                <a href="#" aria-label="Spotify"><i className="fab fa-spotify"></i></a>
                <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
        </div>
    </div>
);


// --- Google Calendar Events Page ---
const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            // A URL agora aponta para nossa função segura na Vercel
            const url = '/api/events'; 

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (!response.ok) {
                    // Se a API retornar um erro (ex: chaves erradas), mostramos a mensagem dela
                    throw new Error(data.error || `Ocorreu um erro ao buscar os eventos.`);
                }
                
                setEvents(data.items || []);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Não foi possível carregar os eventos.';
                setError(errorMessage);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' };
        return new Date(dateString).toLocaleString('pt-BR', options);
    }
    
    const monthName = new Date().toLocaleString('pt-BR', { month: 'long' });

    return (
        <div className="container events-page">
            <div className="page-header">
                <h1>Agenda de Eventos</h1>
                <p>Acompanhe os próximos compromissos e eventos. Sinta-se convidado a participar!</p>
            </div>

            <div className="calendar-embed-container">
                <iframe 
                    src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FSao_Paulo&bgcolor=%231A1A1A&src=NTg1NDQ4ZmQxYWZiYzFhZDRkNWFjNWM3YjE3MzI3M2YwNTcwZGViYTc4YzY5ZjdiZTA1NTZjMDU5NzM3MjgzNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23DDB146" 
                    className="calendar-embed"
                    width="800" 
                    height="600" 
                    frameBorder="0" 
                    scrolling="no"
                    title="Google Calendar">
                </iframe>
            </div>

            <div className="events-list-container">
                <h2>Compromissos para {monthName.charAt(0).toUpperCase() + monthName.slice(1)}</h2>
                {loading && <p>Carregando eventos...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && events.length === 0 && <p>Nenhum evento agendado para este mês.</p>}
                {!loading && !error && events.length > 0 && (
                    <div className="events-list">
                        {events.map((event: any) => (
                            <div key={event.id} className="event-card">
                                <h3>{event.summary}</h3>
                                <p className="event-date">
                                    <i className="fas fa-calendar-alt"></i> 
                                    {formatDate(event.start.dateTime || event.start.date)}
                                </p>
                                {event.location && (
                                    <p className="event-location">
                                        <i className="fas fa-map-marker-alt"></i> {event.location}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Contact Page ---
const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        subject: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, city, subject } = formData;
        const message = `Olá, meu nome é ${name} e sou de ${city}. Gostaria de falar sobre o seguinte assunto: ${subject}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/5519982109638?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="container contact-page">
            <div className="page-header">
                <h1>Contato</h1>
                <p>Será um prazer falar com você!</p>
            </div>
            <div className="contact-content">
                <div className="contact-info">
                     <h2>Tire suas dúvidas</h2>
                     <p>
                         Seja para compartilhar uma palavra, tirar uma dúvida ou até mesmo nos visitar em
                         nossa igreja, sinta-se à vontade para enviar sua mensagem. A vida é feita de encontros,
                         e quem sabe o próximo não será o nosso?
                     </p>
                     <ul className="contact-details">
                        <li><i className="fas fa-map-marker-alt"></i> Rua 13 de Maio, 435<br/>Centro - Nova Odessa/SP</li>
                        <li><i className="fas fa-envelope"></i> pastorvaldinei@gmail.com</li>
                        <li><i className="fas fa-phone"></i> (19) 98210-9638</li>
                     </ul>
                </div>
                <div className="contact-form">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Seu Nome</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">Sua Cidade</label>
                            <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Assunto</label>
                            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required />
                        </div>
                        <button type="submit" className="submit-button">
                            Enviar via WhatsApp
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Placeholder Pages ---
const AboutPage = () => <div className="container"><div className="page-header"><h1>Quem Sou</h1><p>Esta página está em construção.</p></div></div>;
const BooksPage = () => <div className="container"><div className="page-header"><h1>Meus Livros</h1><p>Esta página está em construção.</p></div></div>;


// --- Header Component ---
const Header = ({ activePage, setActivePage }) => (
    <header className="site-header">
        <div className="header-container">
            <div className="site-logo">
                <a href="#home" onClick={() => setActivePage('home')}>VALDINEI PEREIRA</a>
            </div>
            <nav className="main-nav">
                <a href="#home" className={activePage === 'home' ? 'active' : ''} onClick={() => setActivePage('home')}>Home</a>
                <a href="#about" className={activePage === 'about' ? 'active' : ''} onClick={() => setActivePage('about')}>Quem Sou</a>
                <a href="#books" className={activePage === 'books' ? 'active' : ''} onClick={() => setActivePage('books')}>Meus Livros</a>
                <a href="#events" className={activePage === 'events' ? 'active' : ''} onClick={() => setActivePage('events')}>Agenda</a>
                <a href="#contact" className={activePage === 'contact' ? 'active' : ''} onClick={() => setActivePage('contact')}>Contato</a>
            </nav>
            <div className="header-cta">
                <a href="#contact" className="cta-button" onClick={() => setActivePage('contact')}>Vamos Conversar</a>
            </div>
        </div>
    </header>
);

// --- Footer Component ---
const Footer = () => (
    <footer className="app-footer">
        <div className="footer-newsletter">
            <p>Fique a vontade para navegar em meu site, ele foi feito pensando em você</p>
            <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Email address" required />
                <button type="submit">JOIN</button>
            </form>
        </div>
        <div className="footer-content">
            <div className="footer-section">
                <h4>Menu do Site</h4>
                <ul>
                    <li><a href="#home" onClick={() => window.location.hash = 'home'}>Home</a></li>
                    <li><a href="#about" onClick={() => window.location.hash = 'about'}>Quem Sou</a></li>
                    <li><a href="#books" onClick={() => window.location.hash = 'books'}>Meus Livros</a></li>
                    <li><a href="#events" onClick={() => window.location.hash = 'events'}>Agenda</a></li>
                </ul>
            </div>
            <div className="footer-section">
                <h4>Informações</h4>
                <ul>
                    <li><a href="#">Perguntas Frequentes</a></li>
                    <li><a href="#">Política de Privacidade</a></li>
                    <li><a href="#contact" onClick={() => window.location.hash = 'contact'}>Entre em Contato</a></li>
                </ul>
            </div>
            <div className="footer-section">
                <h4>Contato</h4>
                <p>Fone: +55 19 98210-9638</p>
                <p>e-mail: pastorvaldinei@gmail.com</p>
                <div className="social-icons">
                    <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                    <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
                    <a href="#" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>Copyright © 2023 - Criado por Valdinei Pereira</p>
            <p><a href="#">Termos e Condições</a> | <a href="#">Política de Privacidade</a></p>
        </div>
    </footer>
);


// --- Main App Component with Router ---
const App = () => {
    const getInitialPage = () => window.location.hash.substring(1) || 'home';
    const [activePage, setActivePage] = useState(getInitialPage);

    useEffect(() => {
        const handleHashChange = () => {
            setActivePage(getInitialPage());
        };

        window.addEventListener('hashchange', handleHashChange);
        // Set initial page on load
        handleHashChange();

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const renderPage = () => {
        switch (activePage) {
            case 'home':
                return <HomePage />;
            case 'about':
                return <AboutPage />;
            case 'books':
                return <BooksPage />;
            case 'events':
                return <EventsPage />;
            case 'contact':
                return <ContactPage />;
            default:
                return <HomePage />;
        }
    };

    return (
        <>
            <Header activePage={activePage} setActivePage={setActivePage} />
            <main>
                {renderPage()}
            </main>
            <Footer />
        </>
    );
}

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}