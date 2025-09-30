import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- Google Calendar Events Page ---
const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            // A chamada para a API agora é feita para um endpoint seguro no backend
            // que protege a chave de API. Este endpoint é responsável por
            // buscar os eventos do mês atual no Google Calendar.
            const url = '/api/events'; 

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Ocorreu um erro ao buscar os eventos. Por favor, tente novamente mais tarde.`);
                }
                const data = await response.json();
                setEvents(data.items || []);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Não foi possível carregar os eventos. Verifique a conexão ou tente novamente.';
                setError(errorMessage);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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
                 {/* O iframe continua usando o ID público da agenda, o que é seguro. */}
                <iframe 
                    src="https://calendar.google.com/calendar/embed?src=585448fd1afbc1ad4d5ac5c7b173273f0570deba78c69f7be0556c0597372834%40group.calendar.google.com" 
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
            <div className="contact-content">
                <div className="contact-info">
                     <h2>Será um prazer falar com você!</h2>
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
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Quem Sou</a></li>
                    <li><a href="#">Meus Livros</a></li>
                    <li><a href="#">Categorias</a></li>
                </ul>
            </div>
            <div className="footer-section">
                <h4>Informações</h4>
                <ul>
                    <li><a href="#">Perguntas Frequentes</a></li>
                    <li><a href="#">Política de Privacidade</a></li>
                    <li><a href="#">Entre em Contato</a></li>
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


// --- Main App Component with Navigation ---
const App = () => {
    const [activePage, setActivePage] = useState('events');

    return (
        <>
            <header className="app-header">
                <nav className="tabs">
                    <button 
                        className={`tab ${activePage === 'events' ? 'active' : ''}`} 
                        onClick={() => setActivePage('events')}
                        aria-pressed={activePage === 'events'}
                    >
                        Eventos
                    </button>
                    <button 
                        className={`tab ${activePage === 'contact' ? 'active' : ''}`} 
                        onClick={() => setActivePage('contact')}
                        aria-pressed={activePage === 'contact'}
                    >
                        Contato
                    </button>
                </nav>
            </header>
            <main>
                {activePage === 'events' && <EventsPage />}
                {activePage === 'contact' && <ContactPage />}
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