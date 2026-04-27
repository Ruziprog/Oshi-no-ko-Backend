// Типы данных
type TalentType = 'idol' | 'actor';
type Gender = 'F' | 'M';
type Status = 'A' | 'I';

// Интерфейс для таланта
interface Talent {
    id?: number;
    name: string;
    age: number;
    gender: Gender;
    talent_type: TalentType;
    debut_date: string;
    agency: string | null;
    biography: string | null;
    status: Status;
    followers?: number;
    popularity_rank?: number;
    profile_image?: string | null;
}

// Интерфейс для пагинированного ответа
interface PaginatedResponse {
    results: Talent[];
    total_pages: number;
    total_count: number;
    current_page: number;
}

// DOM элементы
const tabButtons = document.querySelectorAll('.tab-btn') as NodeListOf<HTMLElement>;
const contentWrapper = document.getElementById('contentWrapper') as HTMLElement;
const formTitle = document.getElementById('formTitle') as HTMLElement;
const talentsGrid = document.getElementById('talentsGrid') as HTMLElement;
const modal = document.getElementById('modal') as HTMLElement;
const modalBody = document.getElementById('modalBody') as HTMLElement;
const addTalentForm = document.getElementById('addTalentForm') as HTMLFormElement;

// Состояние приложения
let currentType: TalentType = 'idol';
let currentData: Talent[] = [];
let currentPage: number = 1;
let totalPages: number = 1;
const pageSize: number = 12;

// API URL
const API_URL: string = '/api/talents/';

// Переключение вкладок с плавной анимацией
tabButtons.forEach((btn: HTMLElement) => {
    btn.addEventListener('click', async () => {
        const type = btn.dataset.type as TalentType;
        if (type === currentType) return;

        // Обновление активной вкладки
        tabButtons.forEach((b: HTMLElement) => b.classList.remove('active'));
        btn.classList.add('active');

        // Затемнение контента
        contentWrapper.classList.add('fade-out');

        // Обновление заголовка формы
        formTitle.textContent = type === 'idol' ? '✨ Add New Idol ✨' : '🎭 Add New Actor ✨';
        
        // Ожидание анимации
        setTimeout(async () => {
            currentType = type;
            currentPage = 1;
            await loadData();
            contentWrapper.classList.remove('fade-out');
        }, 300);
    });
});

// Загрузка данных с API
async function loadData(): Promise<void> {
    talentsGrid.innerHTML = '<div class="loader">Loading...</div>';
    
    try {
        const response = await fetch(`${API_URL}?type=${currentType}&page=${currentPage}&page_size=${pageSize}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: PaginatedResponse | Talent[] = await response.json();
        
        // Проверка на пагинированный ответ
        if (isPaginatedResponse(data)) {
            currentData = data.results;
            totalPages = data.total_pages;
        } else {
            currentData = data;
            totalPages = 1;
        }
        
        displayData(currentData);
        displayPagination();
    } catch (error) {
        console.error('Error loading data:', error);
        talentsGrid.innerHTML = '<div class="loader">Error loading data</div>';
    }
}

// Type guard для проверки пагинированного ответа
function isPaginatedResponse(data: PaginatedResponse | Talent[]): data is PaginatedResponse {
    return (data as PaginatedResponse).results !== undefined;
}

// Отображение пагинации
function displayPagination(): void {
    const oldPagination = document.querySelector('.pagination');
    if (oldPagination) oldPagination.remove();
    
    if (totalPages <= 1) return;
    
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    paginationDiv.innerHTML = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">← Previous</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next →</button>
    `;
    talentsGrid.after(paginationDiv);
}

// Смена страницы (глобальная функция для onclick)
(window as any).changePage = function(page: number): void {
    currentPage = page;
    loadData();
};

// Отображение карточек с данными
function displayData(items: Talent[]): void {
    talentsGrid.innerHTML = '';

    if (items.length === 0) {
        talentsGrid.innerHTML = '<div class="loader">No talents found. Add your first!</div>';
        return;
    }

    items.forEach((item: Talent) => {
        const card = document.createElement('div');
        card.className = 'talent-card';
        card.onclick = () => showDetails(item);
        
        const typeBadge = item.talent_type === 'idol' ? 'badge-idol' : 'badge-actor';
        const typeLabel = item.talent_type === 'idol' ? 'Idol' : 'Actor';
        
        card.innerHTML = `
            <div class="talent-image">
                ${item.profile_image ? 
                    `<img src="${item.profile_image}" alt="${escapeHtml(item.name)}">` : 
                    (item.gender === 'F' ? '👩‍🎤' : '👨‍🎤')
                }
            </div>
            <div class="talent-info">
                <div class="talent-name">${escapeHtml(item.name)}</div>
                <div class="talent-details">
                    <p>Age: ${item.age} | Debut: ${item.debut_date}</p>
                    <p>Agency: ${escapeHtml(item.agency) || 'Independent'}</p>
                </div>
                <div>
                    <span class="badge ${typeBadge}">${typeLabel}</span>
                    <span class="badge ${item.status === 'A' ? 'badge-active' : 'badge-inactive'}">
                        ${item.status === 'A' ? 'Active' : 'Inactive'}
                    </span>
                    <span class="badge ${item.gender === 'F' ? 'badge-female' : 'badge-male'}">
                        ${item.gender === 'F' ? 'Female' : 'Male'}
                    </span>
                </div>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-value">${item.followers || 0}</div>
                        <div class="stat-label">Followers</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${item.popularity_rank || 0}</div>
                        <div class="stat-label">Popularity Rank</div>
                    </div>
                </div>
            </div>
        `;
        talentsGrid.appendChild(card);
    });
}

// HTML экранирование
function escapeHtml(str: string | null | undefined): string {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Показ деталей в модальном окне
function showDetails(item: Talent): void {
    const typeLabel = item.talent_type === 'idol' ? 'Idol' : 'Actor';
    
    modalBody.innerHTML = `
        <h2>${escapeHtml(item.name)}</h2>
        <hr>
        <p><strong>Type:</strong> ${typeLabel}</p>
        <p><strong>Age:</strong> ${item.age}</p>
        <p><strong>Gender:</strong> ${item.gender === 'F' ? 'Female' : 'Male'}</p>
        <p><strong>Debut Date:</strong> ${item.debut_date}</p>
        <p><strong>Agency:</strong> ${escapeHtml(item.agency) || 'Independent'}</p>
        <p><strong>Status:</strong> ${item.status === 'A' ? 'Active' : 'Inactive'}</p>
        <p><strong>Followers:</strong> ${item.followers || 0}</p>
        <p><strong>Popularity Rank:</strong> ${item.popularity_rank || 0}</p>
        <p><strong>Biography:</strong> ${escapeHtml(item.biography) || 'No biography available'}</p>
    `;
    
    modal.style.display = 'flex';
    
    const closeBtn = document.querySelector('.close') as HTMLElement;
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }
    
    window.onclick = (event: MouseEvent) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Обработка отправки формы
addTalentForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const ageInput = document.getElementById('age') as HTMLInputElement;
    const genderSelect = document.getElementById('gender') as HTMLSelectElement;
    const debutDateInput = document.getElementById('debutDate') as HTMLInputElement;
    const agencyInput = document.getElementById('agency') as HTMLInputElement;
    const biographyTextarea = document.getElementById('biography') as HTMLTextAreaElement;
    
    const newItem: Omit<Talent, 'id' | 'followers' | 'popularity_rank' | 'profile_image'> = {
        name: nameInput.value,
        age: parseInt(ageInput.value),
        gender: genderSelect.value as Gender,
        talent_type: currentType,
        debut_date: debutDateInput.value,
        agency: agencyInput.value || null,
        biography: biographyTextarea.value || null,
        status: 'A'
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem)
        });

        if (response.ok) {
            alert(`✨ ${currentType === 'idol' ? 'Idol' : 'Actor'} added successfully! ✨`);
            addTalentForm.reset();
            currentPage = 1;
            await loadData();
        } else {
            const errorData = await response.json();
            console.error('Error details:', errorData);
            alert('Error adding: ' + JSON.stringify(errorData));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding');
    }
});

// Инициализация
loadData();