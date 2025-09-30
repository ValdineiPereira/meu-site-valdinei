const e = React.createElement;

// --- Google Calendar Events Page ---
const EventsPage = () => {
    const [events, setEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchEvents = async () => {
            const API_KEY = 'AIzaSyAPkMErFnMm21WxL1ULDddYUYvR-eWSJvE';
            const CALENDAR_ID = '585448fd1afbc1ad4d5ac5c7b173273f0570deba78c69f7be0556c0597372834@group.calendar.google.com';

            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            lastDay.setHours(23, 59, 59);

            const timeMin = firstDay.toISOString();
            const timeMax = lastDay.toISOString();

            const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Erro na API do Google: ${response.statusText}`);
                }
                const data = await response.json();
                setEvents(data.items || []);
            } catch (err) {
                setError('Não foi possível carregar os eventos. Verifique se o ID da agenda está correto e se a agenda é pública.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString('pt-BR', options);
    }
    
    const monthName = new Date().toLocaleString('pt-BR', { month: 'long' });

    return e('div', { className: 'container events-page' },
        e('div', { className: 'page-header' },
            e('h1', null, 'Agenda de Eventos'),
            e('p', null, 'Acompanhe os próximos compromissos e eventos. Sinta-se convidado a participar!')
        ),
        e('div', { className: 'calendar-embed-container' },
            e('iframe', { 
                src: "https://calendar.google.com/calendar/embed?src=585448fd1afbc1ad4d5ac5c7b173273f0570deba78c69f7be0556c0597372834%40group.calendar.google.com", 
                className: "calendar-embed",
                width: "800", 
                height: "600", 
                frameBorder: "0", 
                scrolling: "no",
                title: "Google Calendar"
            })
        ),
        e('div', { className: 'events-list-container' },
            e('h2', null, `Compromissos para ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`),
            loading && e('p', null, 'Carregando eventos...'),
            error && e('p', { className: 'error-message' }, error),
            !loading && !error && events.length === 0 && e('p', null, 'Nenhum evento agendado para este mês.'),
            !loading && !error && events.length > 0 && e('div', { className: 'events-list' },
                events.map(event => e('div', { key: event.id, className: 'event-card' },
                    e('h3', null, event.summary),
                    e('p', { className: 'event-date' }, 
                        e('i', { className: 'fas fa-calendar-alt' }), 
                        ` ${formatDate(event.start.dateTime || event.start.date)}`
                    ),
                    event.location && e('p', { className: 'event-location' }, 
                        e('i', { className: 'fas fa-map-marker-alt' }), 
                        ` ${event.location}`
                    )
                ))
            )
        )
    );
};

// --- Contact Page ---
const ContactPage = () => {
    const [formData, setFormData] = React.useState({ name: '', city: '', subject: '' });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const { name, city, subject } = formData;
        const message = `Olá, meu nome é ${name} e sou de ${city}. Gostaria de falar sobre o seguinte assunto: ${subject}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/5519982109638?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return e('div', { className: 'container contact-page' },
        e('div', { className: 'contact-content' },
            e('div', { className: 'contact-info' },
                e('h2', null, 'Será um prazer falar com você!'),
                e('p', null, 'Seja para compartilhar uma palavra, tirar uma dúvida ou até mesmo nos visitar em nossa igreja, sinta-se à vontade para enviar sua mensagem. A vida é feita de encontros, e quem sabe o próximo não será o nosso?'),
                e('ul', { className: 'contact-details' },
                    e('li', null, e('i', { className: 'fas fa-map-marker-alt' }), ' Rua 13 de Maio, 435', e('br'), 'Centro - Nova Odessa/SP'),
                    e('li', null, e('i', { className: 'fas fa-envelope' }), ' pastorvaldinei@gmail.com'),
                    e('li', null, e('i', { className: 'fas fa-phone' }), ' (19) 98210-9638')
                )
            ),
            e('div', { className: 'contact-form' },
                e('form', { onSubmit: handleSubmit },
                    e('div', { className: 'form-group' },
                        e('label', { htmlFor: 'name' }, 'Seu Nome'),
                        e('input', { type: 'text', id: 'name', name: 'name', value: formData.name, onChange: handleInputChange, required: true })
                    ),
                    e('div', { className: 'form-group' },
                        e('label', { htmlFor: 'city' }, 'Sua Cidade'),
                        e('input', { type: 'text', id: 'city', name: 'city', value: formData.city, onChange: handleInputChange, required: true })
                    ),
                    e('div', { className: 'form-group' },
                        e('label', { htmlFor: 'subject' }, 'Assunto'),
                        e('input', { type: 'text', id: 'subject', name: 'subject', value: formData.subject, onChange: handleInputChange, required: true })
                    ),
                    e('button', { type: 'submit', className: 'submit-button' }, 'Enviar via WhatsApp')
                )
            )
        )
    );
};

// --- Main App Component with Navigation ---
const App = () => {
    const [activePage, setActivePage] = React.useState('events');

    return e(React.Fragment, null,
        e('header', { className: 'app-header' },
            e('nav', { className: 'tabs' },
                e('button', { 
                    className: `tab ${activePage === 'events' ? 'active' : ''}`, 
                    onClick: () => setActivePage('events'),
                    'aria-pressed': activePage === 'events'
                }, 'Eventos'),
                e('button', { 
                    className: `tab ${activePage === 'contact' ? 'active' : ''}`, 
                    onClick: () => setActivePage('contact'),
                    'aria-pressed': activePage === 'contact'
                }, 'Contato')
            )
        ),
        e('main', null,
            activePage === 'events' && e(EventsPage),
            activePage === 'contact' && e(ContactPage)
        )
    );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(e(App));
