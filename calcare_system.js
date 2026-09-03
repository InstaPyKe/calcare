// Calcare Master Platform Runtime & System Enforcement
(function() {
    const isMaintenance = localStorage.getItem('calcare_maintenance_mode') === 'true';
    const loansEnabled = localStorage.getItem('calcare_loans_enabled') !== 'false';
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 1. Maintenance Mode Enforcement (except on admin.html)
    if (isMaintenance && currentPage !== 'admin.html') {
        const msg = localStorage.getItem('calcare_maintenance_msg') || 'We are currently upgrading Calcare financial infrastructure to serve you better.';
        const eta = localStorage.getItem('calcare_maintenance_eta') || '15 - 30 minutes';

        const overlay = document.createElement('div');
        overlay.id = 'calcareGlobalMaintenanceOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #0a0614;
            color: #ffffff;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 24px;
            text-align: center;
            font-family: 'Outfit', sans-serif;
            box-sizing: border-box;
        `;

        overlay.innerHTML = `
            <div style="width: 76px; height: 76px; border-radius: 50%; background: rgba(255, 184, 0, 0.12); border: 2px solid #ffb800; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 0 25px rgba(255, 184, 0, 0.25);">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#ffb800" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
            </div>
            <h2 style="font-size: 26px; font-weight: 900; margin-bottom: 12px; color: #ffffff; letter-spacing: -0.5px;">Under Scheduled Maintenance</h2>
            <p style="font-size: 14.5px; color: #94a3b8; max-width: 480px; line-height: 1.6; margin-bottom: 20px;">
                ${msg}
            </p>
            <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 184, 0, 0.3); padding: 10px 22px; border-radius: 30px; font-size: 13px; color: #ffb800; font-weight: 800; margin-bottom: 28px; display: inline-flex; align-items: center; gap: 8px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #ffb800; display: inline-block;"></span>
                Estimated Time: ${eta}
            </div>
            <a href="https://wa.me/447455909204" target="_blank" style="background: linear-gradient(135deg, #ffb800, #ff9800); color: #000000; padding: 14px 28px; border-radius: 30px; font-weight: 800; text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 6px 20px rgba(255, 184, 0, 0.35);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                Contact Support on WhatsApp
            </a>
        `;

        document.addEventListener('DOMContentLoaded', () => {
            document.body.appendChild(overlay);
        });
        if (document.body) {
            document.body.appendChild(overlay);
        }
    }

    // 2. Loan Applications Paused Notice on Application Entry Points
    const loanEntryPages = ['index.html', 'phone.html', 'loan_calculater.html', 'loan_details.html'];
    if (!loansEnabled && loanEntryPages.includes(currentPage)) {
        document.addEventListener('DOMContentLoaded', () => {
            const banner = document.createElement('div');
            banner.id = 'calcareLoansPausedBanner';
            banner.style.cssText = `
                background: linear-gradient(90deg, #b91c1c, #991b1b);
                color: #ffffff;
                padding: 10px 16px;
                font-size: 12.5px;
                font-weight: 700;
                text-align: center;
                position: sticky;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 99990;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            `;
            banner.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>Notice: New loan applications are temporarily paused for routine balance reconciliations.</span>
            `;
            document.body.insertBefore(banner, document.body.firstChild);

            // If on phone.html or loan_details.html, disable next button
            const nextBtn = document.getElementById('nextBtn') || document.getElementById('btnGetLoan');
            if (nextBtn) {
                nextBtn.setAttribute('disabled', 'true');
                nextBtn.style.opacity = '0.5';
                nextBtn.style.cursor = 'not-allowed';
            }
        });
    }

    // 3. Secret Admin Access Dot in Sidebar Footer
    function wireSidebarAdminDot() {
        const footers = document.querySelectorAll('.sidebar-footer');
        footers.forEach(footer => {
            if (!footer.querySelector('.admin-secret-dot')) {
                const copyrightDiv = footer.querySelector('div:last-child');
                if (copyrightDiv) {
                    const dot = document.createElement('a');
                    dot.href = 'admin_login.html';
                    dot.className = 'admin-secret-dot';
                    dot.textContent = '.';
                    dot.title = 'Admin Gateway';
                    dot.style.cssText = `
                        color: inherit;
                        text-decoration: none;
                        cursor: pointer;
                        font-weight: 900;
                        font-size: 14px;
                        line-height: 1;
                        padding: 0 4px;
                        display: inline-block;
                        opacity: 0.5;
                        transition: opacity 0.2s, transform 0.2s;
                    `;
                    dot.addEventListener('mouseenter', () => { dot.style.opacity = '1'; dot.style.transform = 'scale(1.3)'; });
                    dot.addEventListener('mouseleave', () => { dot.style.opacity = '0.5'; dot.style.transform = 'scale(1)'; });
                    copyrightDiv.appendChild(dot);
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', wireSidebarAdminDot);
    setTimeout(wireSidebarAdminDot, 400);
    setTimeout(wireSidebarAdminDot, 1200);
})();
