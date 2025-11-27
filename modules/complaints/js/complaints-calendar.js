// Complaints Calendar JavaScript

let calendarData = {
    complaints: [],
    events: [],
    currentView: 'month',
    currentDate: new Date()
};

document.addEventListener('DOMContentLoaded', function() {
    initializeComplaintsCalendar();
});

async function initializeComplaintsCalendar() {
    // Load calendar when tab is shown
    const calendarTab = document.getElementById('calendar-tab');
    if (calendarTab) {
        calendarTab.addEventListener('shown.bs.tab', function() {
            loadComplaintsCalendar();
        });
    }
}

/**
 * Load Complaints Calendar Data
 */
async function loadComplaintsCalendar() {
    try {
        const dataFunctionsToUse = typeof dataFunctions !== 'undefined' 
            ? dataFunctions 
            : (window.dataFunctions || window.parent?.dataFunctions);
        
        if (!dataFunctionsToUse) {
            throw new Error('dataFunctions is not available');
        }
        
        // Load all complaints
        const complaintsResult = await dataFunctionsToUse.getComplaints(null, null, null, null, null);
        let complaints = complaintsResult;
        if (complaintsResult && complaintsResult.data) {
            complaints = complaintsResult.data;
        } else if (complaintsResult && Array.isArray(complaintsResult)) {
            complaints = complaintsResult;
        }
        
        calendarData.complaints = complaints || [];
        
        // Build calendar events from complaints
        buildCalendarEvents();
        
        // Render calendar
        renderCalendar();
        
        // Load deadline trackers
        loadDeadlineTrackers();
        
        // Load scheduled activities
        loadScheduledActivities();
    } catch (error) {
        console.error('Error loading complaints calendar:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load complaints calendar'
        });
    }
}

/**
 * Build Calendar Events from Complaints
 */
function buildCalendarEvents() {
    calendarData.events = [];
    
    calendarData.complaints.forEach(complaint => {
        // 6-week deadline
        if (complaint.resolution_due_date) {
            calendarData.events.push({
                id: `deadline-${complaint.id}`,
                title: `${complaint.complaint_reference_number} - 6-week deadline`,
                date: new Date(complaint.resolution_due_date),
                type: 'deadline',
                color: 'danger',
                complaint: complaint
            });
        }
        
        // Acknowledgement due date
        if (complaint.acknowledgement_due_date) {
            calendarData.events.push({
                id: `ack-${complaint.id}`,
                title: `${complaint.complaint_reference_number} - Acknowledgement due`,
                date: new Date(complaint.acknowledgement_due_date),
                type: 'acknowledgement',
                color: 'warning',
                complaint: complaint
            });
        }
        
        // Complaint received date
        if (complaint.complaint_received_date) {
            calendarData.events.push({
                id: `received-${complaint.id}`,
                title: `${complaint.complaint_reference_number} - Received`,
                date: new Date(complaint.complaint_received_date),
                type: 'received',
                color: 'info',
                complaint: complaint
            });
        }
        
        // Resolution date (if resolved)
        if (complaint.resolution_date && complaint.status === 'resolved') {
            calendarData.events.push({
                id: `resolved-${complaint.id}`,
                title: `${complaint.complaint_reference_number} - Resolved`,
                date: new Date(complaint.resolution_date),
                type: 'resolved',
                color: 'success',
                complaint: complaint
            });
        }
    });
}

/**
 * Render Calendar
 */
function renderCalendar() {
    const container = document.getElementById('complaints-calendar');
    if (!container) return;
    
    const view = calendarData.currentView;
    
    if (view === 'list') {
        renderListView();
    } else if (view === 'month') {
        renderMonthView();
    } else if (view === 'week') {
        renderWeekView();
    } else if (view === 'day') {
        renderDayView();
    }
}

/**
 * Render Month View
 */
function renderMonthView() {
    const container = document.getElementById('complaints-calendar');
    if (!container) return;
    
    const year = calendarData.currentDate.getFullYear();
    const month = calendarData.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Get events for this month
    const monthEvents = calendarData.events.filter(event => {
        const eventDate = event.date;
        return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
    
    let html = `
        <div class="calendar-header mb-3">
            <div class="d-flex justify-content-between align-items-center">
                <h4>${firstDay.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}</h4>
                <div>
                    <button class="btn btn-sm btn-outline-secondary" onclick="previousMonth()">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="todayMonth()">Today</button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="nextMonth()">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="calendar-month">
            <div class="calendar-weekdays">
                <div class="calendar-weekday">Sun</div>
                <div class="calendar-weekday">Mon</div>
                <div class="calendar-weekday">Tue</div>
                <div class="calendar-weekday">Wed</div>
                <div class="calendar-weekday">Thu</div>
                <div class="calendar-weekday">Fri</div>
                <div class="calendar-weekday">Sat</div>
            </div>
            <div class="calendar-days">
    `;
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayEvents = monthEvents.filter(event => {
            return event.date.getDate() === day;
        });
        
        const isToday = date.toDateString() === new Date().toDateString();
        const dayClass = isToday ? 'calendar-day today' : 'calendar-day';
        
        html += `<div class="${dayClass}" onclick="showDayEvents(${year}, ${month}, ${day})">`;
        html += `<div class="calendar-day-number">${day}</div>`;
        html += '<div class="calendar-day-events">';
        
        dayEvents.slice(0, 3).forEach(event => {
            const badgeClass = event.color === 'danger' ? 'bg-danger' : 
                             event.color === 'warning' ? 'bg-warning' : 
                             event.color === 'info' ? 'bg-info' : 'bg-success';
            html += `<span class="badge ${badgeClass} calendar-event-badge" title="${event.title}">${event.complaint.complaint_reference_number}</span>`;
        });
        
        if (dayEvents.length > 3) {
            html += `<span class="badge bg-secondary">+${dayEvents.length - 3}</span>`;
        }
        
        html += '</div></div>';
    }
    
    html += '</div></div>';
    container.innerHTML = html;
}

/**
 * Render Week View
 */
function renderWeekView() {
    const container = document.getElementById('complaints-calendar');
    if (!container) return;
    
    // Get start of week (Sunday)
    const date = new Date(calendarData.currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day;
    const startOfWeek = new Date(date.setDate(diff));
    
    let html = `
        <div class="calendar-header mb-3">
            <div class="d-flex justify-content-between align-items-center">
                <h4>Week of ${startOfWeek.toLocaleDateString('en-ZA', { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
                <div>
                    <button class="btn btn-sm btn-outline-secondary" onclick="previousWeek()">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="todayWeek()">Today</button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="nextWeek()">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="calendar-week">
    `;
    
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        
        const dayEvents = calendarData.events.filter(event => {
            return event.date.toDateString() === currentDay.toDateString();
        });
        
        const isToday = currentDay.toDateString() === new Date().toDateString();
        const dayClass = isToday ? 'calendar-week-day today' : 'calendar-week-day';
        
        html += `<div class="${dayClass}">`;
        html += `<div class="calendar-week-day-header">${currentDay.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric' })}</div>`;
        html += '<div class="calendar-week-day-events">';
        
        dayEvents.forEach(event => {
            const badgeClass = event.color === 'danger' ? 'bg-danger' : 
                             event.color === 'warning' ? 'bg-warning' : 
                             event.color === 'info' ? 'bg-info' : 'bg-success';
            html += `
                <div class="calendar-week-event ${badgeClass} mb-2 p-2 rounded" onclick="viewComplaintFromCalendar('${event.complaint.id}')">
                    <strong>${event.complaint.complaint_reference_number}</strong><br>
                    <small>${event.title}</small>
                </div>
            `;
        });
        
        html += '</div></div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
}

/**
 * Render Day View
 */
function renderDayView() {
    const container = document.getElementById('complaints-calendar');
    if (!container) return;
    
    const date = calendarData.currentDate;
    const dayEvents = calendarData.events.filter(event => {
        return event.date.toDateString() === date.toDateString();
    });
    
    let html = `
        <div class="calendar-header mb-3">
            <div class="d-flex justify-content-between align-items-center">
                <h4>${date.toLocaleDateString('en-ZA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h4>
                <div>
                    <button class="btn btn-sm btn-outline-secondary" onclick="previousDay()">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="todayDay()">Today</button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="nextDay()">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="calendar-day-view">
    `;
    
    if (dayEvents.length === 0) {
        html += '<div class="alert alert-info">No events scheduled for this day.</div>';
    } else {
        dayEvents.forEach(event => {
            const badgeClass = event.color === 'danger' ? 'bg-danger' : 
                             event.color === 'warning' ? 'bg-warning' : 
                             event.color === 'info' ? 'bg-info' : 'bg-success';
            html += `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <span class="badge ${badgeClass} me-2">${event.type}</span>
                                <h6 class="mb-1">${event.title}</h6>
                                <p class="mb-1 text-muted">${event.complaint.complainant_name || 'N/A'}</p>
                                <small class="text-muted">${event.date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</small>
                            </div>
                            <button class="btn btn-sm btn-primary" onclick="viewComplaintFromCalendar('${event.complaint.id}')">View</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    html += '</div>';
    container.innerHTML = html;
}

/**
 * Render List View
 */
function renderListView() {
    const container = document.getElementById('complaints-calendar');
    if (!container) return;
    
    // Sort events by date
    const sortedEvents = [...calendarData.events].sort((a, b) => a.date - b.date);
    
    let html = '<div class="calendar-list-view">';
    
    if (sortedEvents.length === 0) {
        html += '<div class="alert alert-info">No upcoming events.</div>';
    } else {
        // Group by date
        const eventsByDate = {};
        sortedEvents.forEach(event => {
            const dateKey = event.date.toLocaleDateString('en-ZA');
            if (!eventsByDate[dateKey]) {
                eventsByDate[dateKey] = [];
            }
            eventsByDate[dateKey].push(event);
        });
        
        Object.keys(eventsByDate).forEach(dateKey => {
            html += `<div class="calendar-list-date-group mb-4">`;
            html += `<h5>${dateKey}</h5>`;
            
            eventsByDate[dateKey].forEach(event => {
                const badgeClass = event.color === 'danger' ? 'bg-danger' : 
                                 event.color === 'warning' ? 'bg-warning' : 
                                 event.color === 'info' ? 'bg-info' : 'bg-success';
                html += `
                    <div class="card mb-2">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="badge ${badgeClass} me-2">${event.type}</span>
                                    <strong>${event.complaint.complaint_reference_number}</strong> - ${event.title}
                                    <br><small class="text-muted">${event.complaint.complainant_name || 'N/A'}</small>
                                </div>
                                <button class="btn btn-sm btn-primary" onclick="viewComplaintFromCalendar('${event.complaint.id}')">View</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        });
    }
    
    html += '</div>';
    container.innerHTML = html;
}

/**
 * Load Deadline Trackers
 */
function loadDeadlineTrackers() {
    const now = new Date();
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 7);
    
    const thirtyDaysFromNow = new Date(now);
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    const sixMonthsFromNow = new Date(now);
    sixMonthsFromNow.setMonth(now.getMonth() + 6);
    
    // Filter deadlines
    const deadlines7Days = calendarData.complaints
        .filter(c => c.resolution_due_date && 
                new Date(c.resolution_due_date) >= now && 
                new Date(c.resolution_due_date) <= sevenDaysFromNow &&
                !['resolved', 'closed'].includes(c.status?.toLowerCase()))
        .sort((a, b) => new Date(a.resolution_due_date) - new Date(b.resolution_due_date));
    
    const deadlines30Days = calendarData.complaints
        .filter(c => c.resolution_due_date && 
                new Date(c.resolution_due_date) > sevenDaysFromNow && 
                new Date(c.resolution_due_date) <= thirtyDaysFromNow &&
                !['resolved', 'closed'].includes(c.status?.toLowerCase()))
        .sort((a, b) => new Date(a.resolution_due_date) - new Date(b.resolution_due_date));
    
    const deadlines6Months = calendarData.complaints
        .filter(c => c.resolution_due_date && 
                new Date(c.resolution_due_date) > thirtyDaysFromNow && 
                new Date(c.resolution_due_date) <= sixMonthsFromNow &&
                !['resolved', 'closed'].includes(c.status?.toLowerCase()))
        .sort((a, b) => new Date(a.resolution_due_date) - new Date(b.resolution_due_date));
    
    // Render tables
    renderDeadlineTable('deadlines-7days', deadlines7Days);
    renderDeadlineTable('deadlines-30days', deadlines30Days);
    renderDeadlineTable('deadlines-6months', deadlines6Months);
}

/**
 * Render Deadline Table
 */
function renderDeadlineTable(tableId, deadlines) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    
    if (deadlines.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No deadlines in this period</td></tr>';
        return;
    }
    
    tbody.innerHTML = deadlines.map(complaint => {
        const dueDate = new Date(complaint.resolution_due_date);
        const daysUntil = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
        const dateStr = dueDate.toLocaleDateString('en-ZA');
        
        return `
            <tr>
                <td>${complaint.complaint_reference_number || 'N/A'}</td>
                <td>${dateStr}</td>
                <td><span class="badge ${daysUntil <= 3 ? 'bg-danger' : 'bg-warning'}">${daysUntil} days</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewComplaintFromCalendar('${complaint.id}')">View</button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Load Scheduled Activities
 */
function loadScheduledActivities() {
    const now = new Date();
    const thisWeekEnd = new Date(now);
    thisWeekEnd.setDate(now.getDate() + (7 - now.getDay()));
    
    const nextWeekEnd = new Date(thisWeekEnd);
    nextWeekEnd.setDate(thisWeekEnd.getDate() + 7);
    
    const thisWeekEvents = calendarData.events
        .filter(e => e.date >= now && e.date <= thisWeekEnd)
        .sort((a, b) => a.date - b.date);
    
    const nextWeekEvents = calendarData.events
        .filter(e => e.date > thisWeekEnd && e.date <= nextWeekEnd)
        .sort((a, b) => a.date - b.date);
    
    renderActivities('activities-this-week', thisWeekEvents);
    renderActivities('activities-next-week', nextWeekEvents);
}

/**
 * Render Activities
 */
function renderActivities(containerId, events) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '<p class="text-muted">No activities scheduled</p>';
        return;
    }
    
    container.innerHTML = events.map(event => {
        const dateStr = event.date.toLocaleDateString('en-ZA');
        const icon = event.type === 'deadline' ? '🔴' : 
                   event.type === 'acknowledgement' ? '🟠' : 
                   event.type === 'received' ? '🔵' : '🟢';
        
        return `
            <div class="mb-2">
                <strong>${dateStr}:</strong> ${icon} ${event.complaint.complaint_reference_number} - ${event.title}
            </div>
        `;
    }).join('');
}

/**
 * Calendar Navigation Functions
 */
function switchCalendarView(view) {
    calendarData.currentView = view;
    renderCalendar();
}

function previousMonth() {
    calendarData.currentDate.setMonth(calendarData.currentDate.getMonth() - 1);
    buildCalendarEvents();
    renderCalendar();
}

function nextMonth() {
    calendarData.currentDate.setMonth(calendarData.currentDate.getMonth() + 1);
    buildCalendarEvents();
    renderCalendar();
}

function todayMonth() {
    calendarData.currentDate = new Date();
    buildCalendarEvents();
    renderCalendar();
}

function previousWeek() {
    calendarData.currentDate.setDate(calendarData.currentDate.getDate() - 7);
    buildCalendarEvents();
    renderCalendar();
}

function nextWeek() {
    calendarData.currentDate.setDate(calendarData.currentDate.getDate() + 7);
    buildCalendarEvents();
    renderCalendar();
}

function todayWeek() {
    calendarData.currentDate = new Date();
    buildCalendarEvents();
    renderCalendar();
}

function previousDay() {
    calendarData.currentDate.setDate(calendarData.currentDate.getDate() - 1);
    buildCalendarEvents();
    renderCalendar();
}

function nextDay() {
    calendarData.currentDate.setDate(calendarData.currentDate.getDate() + 1);
    buildCalendarEvents();
    renderCalendar();
}

function todayDay() {
    calendarData.currentDate = new Date();
    buildCalendarEvents();
    renderCalendar();
}

function showDayEvents(year, month, day) {
    const date = new Date(year, month, day);
    calendarData.currentDate = date;
    calendarData.currentView = 'day';
    renderCalendar();
}

function viewComplaintFromCalendar(complaintId) {
    // Switch to active complaints tab and show complaint
    if (typeof switchComplaintsTab === 'function') {
        switchComplaintsTab('active-tab');
    }
    // TODO: Open complaint detail modal
    console.log('View complaint:', complaintId);
}

function openAddCalendarEventModal() {
    // TODO: Implement add calendar event modal
    Swal.fire({
        icon: 'info',
        title: 'Add Calendar Event',
        text: 'This feature will allow you to add custom events to the calendar.'
    });
}

// Export for global access
window.switchCalendarView = switchCalendarView;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;
window.todayMonth = todayMonth;
window.previousWeek = previousWeek;
window.nextWeek = nextWeek;
window.todayWeek = todayWeek;
window.previousDay = previousDay;
window.nextDay = nextDay;
window.todayDay = todayDay;
window.showDayEvents = showDayEvents;
window.viewComplaintFromCalendar = viewComplaintFromCalendar;
window.openAddCalendarEventModal = openAddCalendarEventModal;

