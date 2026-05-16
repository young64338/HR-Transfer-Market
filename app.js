document.addEventListener('DOMContentLoaded', () => {
    
    // --- DB: Employee Roster (Sample 5) ---
    const players = [
        {
            id: "EMP01",
            name: "김영은",
            role: "데이터 분석가",
            dept: "AI 융합기획팀",
            overall: 92, // (92+88+95)/3 대체값
            stats: {
                prf: 92, // Performance
                cop: 88, // Cooperation
                grw: 95  // Growth
            },
            matchRating: "9.2",
            highlight: "AI 융합 응용력 우수, 트렌드 리더",
            status: "TOTW",
            imgUrl: "https://i.pravatar.cc/150?img=47"
        },
        {
            id: "EMP02",
            name: "오주영",
            role: "정산 및 회계",
            dept: "재무결제팀",
            overall: 86,
            stats: {
                prf: 85,
                cop: 90,
                grw: 82
            },
            matchRating: "8.5",
            highlight: "유연한 업무 대처, 결제 프로세스 우수",
            status: "Normal",
            imgUrl: "https://i.pravatar.cc/150?img=11"
        },
        {
            id: "EMP03",
            name: "이명철",
            role: "브랜드 마케터",
            dept: "리테일 마케팅팀",
            overall: 84,
            stats: {
                prf: 88,
                cop: 85,
                grw: 80
            },
            matchRating: "8.1",
            highlight: "창의적 기획, 커뮤니케이션 우수",
            status: "Normal",
            imgUrl: "https://i.pravatar.cc/150?img=5"
        },
        {
            id: "EMP04",
            name: "김건우",
            role: "해외 영업",
            dept: "글로벌사업지원팀",
            overall: 82,
            stats: {
                prf: 75,
                cop: 80,
                grw: 92
            },
            matchRating: "7.8",
            highlight: "어학 스탯 우수 (OPIc, TOEIC, G-TELP)",
            status: "Normal",
            imgUrl: "https://i.pravatar.cc/150?img=60"
        },
        {
            id: "EMP05",
            name: "이정무",
            role: "실무 지원",
            dept: "영업관리팀",
            overall: 53,
            stats: {
                prf: 55,
                cop: 60,
                grw: 45
            },
            matchRating: "5.2",
            highlight: "잦은 마감 지연, 소통 오류 (집중 관리 필요)",
            status: "Transfer List",
            imgUrl: "https://i.pravatar.cc/150?img=33"
        }
    ];

    const cardsContainer = document.getElementById('player-cards-container');
    const pipCardsContainer = document.getElementById('pip-cards-container');
    const transferListSection = document.getElementById('transfer-list-section');
    const personalCardContainer = document.getElementById('personal-card-container'); // 개인 모드 카드

    // 4대 핵심 모드 섹션
    const adminDashboardSection = document.getElementById('admin-dashboard-section');
    const hrDashboardSection = document.getElementById('hr-dashboard-section');
    const teamDashboardSection = document.getElementById('team-dashboard-section');
    const personalDashboardSection = document.getElementById('personal-dashboard-section');
    
    let currentMode = 'team'; // default
    let compareList = []; // 인재 비교 리스트 (최대 4명)

    // --- Card Render Function ---
    function renderCards() {
        if(cardsContainer) cardsContainer.innerHTML = ''; 
        if(pipCardsContainer) pipCardsContainer.innerHTML = '';
        if(personalCardContainer) personalCardContainer.innerHTML = '';
        
        players.forEach(player => {
            const isPip = player.status === "Transfer List";
            
            // 카드의 배경이나 이펙트 적용
            let cardExtraStyle = "";
            let goldHighlight = "";
            
            if(player.status === "TOTW") {
                goldHighlight = "color: var(--gold-light); text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);";
            } else if (isPip) {
                cardExtraStyle = "border-image: linear-gradient(135deg, #ff3366, #990000) 1;";
                goldHighlight = "color: var(--danger);";
            }

            const cardHTML = `
                <div class="player-card ${player.status === 'TOTW' ? 'totw' : ''} ${isPip ? 'pip' : ''} ${compareList.includes(player.id) ? 'compare-selected' : ''}" data-id="${player.id}" style="padding-bottom: 70px;">
                    <!-- 인재 비교 버튼 (저울) - 좌측 상단 -->
                    <div class="card-compare-btn ${compareList.includes(player.id) ? 'active' : ''}" title="비교 목록에 추가" data-id="${player.id}" style="position:absolute; top:15px; left:15px; background:rgba(0,0,0,0.5); border-radius:50%; width:32px; height:32px; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:10; transition:all 0.3s; color:rgba(255,255,255,0.8); border:1px solid rgba(255,255,255,0.2);">
                        <i class="fa-solid fa-scales-balanced"></i>
                    </div>

                    <!-- 관심 인재 등록 버튼 (하트) - 우측 상단 -->
                    <div class="card-watchlist-btn" title="관심 인재 등록">
                        <i class="fa-solid fa-heart"></i>
                    </div>

                    <!-- 종합 점수 및 직무 영역 삭제됨 (요청 사항) -->
                    
                    <div class="card-image" style="margin-top: 40px;">
                        <img src="${player.imgUrl}" alt="${player.name}" style="${isPip ? 'border-color: var(--danger); filter: grayscale(50%);' : ''}; width: 110px; height: 110px; object-fit: cover;">
                        <div class="player-name" style="font-size: 20px; margin-top: 10px;">${player.name}</div>
                        <div style="font-size: 12px; color: var(--gold-main); margin-top: 4px; font-weight: bold;">${player.dept}</div>
                    </div>

                    <!-- 스탯 영역 삭제됨 (요청 사항) -->
                    
                    <div class="stat-highlight" style="${isPip ? 'color: #ffcccc; background: rgba(255,51,102,0.2);' : ''}; position:relative; margin-top: 15px; padding: 10px; font-size: 12px; text-align: center; border-radius: 4px;">
                        <i class="fa-solid fa-bolt"></i> ${player.highlight}
                        <div style="margin-top: 8px; display:flex; justify-content:center; gap:12px;">
                            <i class="fa-solid fa-book mini-action-icon book" title="교육 추천" data-id="${player.id}"></i>
                            <i class="fa-solid fa-battery-half mini-action-icon battery" title="업무 부담 확인" data-id="${player.id}"></i>
                            <span class="card-detail-link" data-id="${player.id}" style="font-size: 11px; cursor: pointer; text-decoration: underline;">[상세 정보]</span>
                        </div>
                    </div>

                    <!-- 프로젝트 배치 버튼 - 시인성 강화 (초록색 버튼 강조) -->
                    <button class="btn-transfer" data-id="${player.id}" style="position: absolute; bottom: 12px; left: 12px; right: 12px; width: calc(100% - 24px); background: linear-gradient(135deg, #00ff99, #00cc7a); color: #000; font-weight: 800; border: none; padding: 10px; border-radius: 6px; box-shadow: 0 4px 15px rgba(0, 255, 153, 0.3); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <i class="fa-solid fa-arrows-turn-to-dots"></i> 프로젝트 배치 제안
                    </button>
                </div>
            `;
            
            // 1. 개인 모드 렌더링 (나 자신 EMP01로 가정)
            if (currentMode === 'personal') {
                if (player.id === 'EMP01' && personalCardContainer) {
                    personalCardContainer.insertAdjacentHTML('beforeend', cardHTML);
                }
            } 
            // 2. 팀장 모드 렌더링
            else if (currentMode === 'team') {
                if (isPip) {
                    if(pipCardsContainer) pipCardsContainer.insertAdjacentHTML('beforeend', cardHTML);
                } else {
                    if(cardsContainer) cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
                }
            }
            // 3. HR / Admin 모드는 카드를 별도로 그리지 않거나 필요 시 재활용 가능
        });

        // 팀장 모드일 때 Transfer List 섹션 표시 여부 제어
        if (currentMode === 'team' && transferListSection && pipCardsContainer) {
            if (pipCardsContainer.innerHTML !== '') {
                transferListSection.style.display = 'block';
            } else {
                transferListSection.style.display = 'none';
            }
        }

        // --- 인재 카드 버튼 이벤트 바인딩 ---
        attachCardEvents();
    }

    // --- Toast Notification Helper ---
    function showToast(message) {
        const toastContainer = document.getElementById('toast-container');
        if(!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--success);"></i> ${message}`;
        
        toastContainer.appendChild(toast);
        
        // 3초 후 제거
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // --- 카드 개별 이벤트 바인딩 함수 ---
    function attachCardEvents() {
        // 1. 관심 인재 등록 (하트)
        document.querySelectorAll('.card-watchlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                btn.classList.toggle('active');
                if(btn.classList.contains('active')) {
                    showToast("관심 인재로 등록되었습니다. (Added to Watchlist)");
                }
            });
        });

        // 2. 상세 정보 모달 오픈
        document.querySelectorAll('.card-detail-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                const pid = link.getAttribute('data-id');
                const player = players.find(p => p.id === pid);
                if(player) openPlayerDetail(player);
            });
        });

        // 3. 프로젝트 배치 제안 모달 오픈
        document.querySelectorAll('.btn-transfer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const pid = btn.getAttribute('data-id');
                const player = players.find(p => p.id === pid);
                if(player) openTransferProposal(player);
            });
        });

        // 4. 교육 추천 (책 아이콘)
        document.querySelectorAll('.mini-action-icon.book').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const pid = btn.getAttribute('data-id');
                const player = players.find(p => p.id === pid);
                if(player) openTrainingSuggestion(player);
            });
        });

        // 5. 업무 부담 확인 (배터리 아이콘)
        document.querySelectorAll('.mini-action-icon.battery').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const pid = btn.getAttribute('data-id');
                const player = players.find(p => p.id === pid);
                if(player) openWorkloadCheck(player);
            });
        });

        // 6. 인재 비교 버튼 (저울 아이콘)
        document.querySelectorAll('.card-compare-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const pid = btn.getAttribute('data-id');
                toggleCompare(pid, btn);
            });
        });
    }

    // --- 인재 비교 토글 로직 ---
    function toggleCompare(pid, btnElement) {
        const index = compareList.indexOf(pid);
        const card = btnElement.closest('.player-card');

        if (index > -1) {
            // 이미 있으면 제거
            compareList.splice(index, 1);
            btnElement.style.color = "rgba(255,255,255,0.6)";
            btnElement.style.background = "rgba(0,0,0,0.3)";
            if(card) card.classList.remove('compare-selected');
        } else {
            // 없으면 추가 (최대 4명)
            if (compareList.length >= 4) {
                alert("비교 인원은 최대 4명까지 선택 가능합니다.");
                return;
            }
            compareList.push(pid);
            btnElement.style.color = "var(--gold-main)";
            btnElement.style.background = "rgba(212, 175, 55, 0.2)";
            if(card) card.classList.add('compare-selected');
        }

        updateCompareBar();
    }

    // --- 하단 비교 플로팅 바 업데이트 ---
    function updateCompareBar() {
        const bar = document.getElementById('compare-floating-bar');
        const countSpan = document.getElementById('compare-count');
        
        if(!bar || !countSpan) return;

        countSpan.textContent = compareList.length;

        if (compareList.length > 0) {
            bar.classList.add('show');
        } else {
            bar.classList.remove('show');
        }
    }

    // --- 비교 모달 오픈 및 테이블 렌더링 ---
    function openCompareModal() {
        const modal = document.getElementById('compare-modal');
        const content = document.getElementById('compare-content');
        if(!modal || !content) return;

        if(compareList.length < 1) return;

        const selectedPlayers = compareList.map(pid => players.find(p => p.id === pid));

        let tableHTML = `
            <table class="compare-table">
                <thead>
                    <tr>
                        <th>항목 (Criteria)</th>
                        ${selectedPlayers.map(p => `
                            <td>
                                <div class="compare-player-header">
                                    <img src="${p.imgUrl}">
                                    <h3 style="color:var(--gold-main);">${p.name}</h3>
                                    <p style="font-size:12px; color:var(--text-muted);">${p.dept}</p>
                                </div>
                            </td>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>종합 능력치 (OVR)</th>
                        ${selectedPlayers.map(p => `<td class="compare-highlight" style="font-size:24px; text-align:center;">${p.overall}</td>`).join('')}
                    </tr>
                    <tr>
                        <th>해결력 (PRF)</th>
                        ${selectedPlayers.map(p => `
                            <td>
                                <div class="compare-stat-row"><span>${p.stats.prf}</span></div>
                                <div class="compare-stat-bar-box"><div class="compare-stat-bar-fill" style="width:${p.stats.prf}%"></div></div>
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <th>협업력 (COP)</th>
                        ${selectedPlayers.map(p => `
                            <td>
                                <div class="compare-stat-row"><span>${p.stats.cop}</span></div>
                                <div class="compare-stat-bar-box"><div class="compare-stat-bar-fill" style="width:${p.stats.cop}%"></div></div>
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <th>성장성 (GRW)</th>
                        ${selectedPlayers.map(p => `
                            <td>
                                <div class="compare-stat-row"><span>${p.stats.grw}</span></div>
                                <div class="compare-stat-bar-box"><div class="compare-stat-bar-fill" style="width:${p.stats.grw}%"></div></div>
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <th>업무 부담도</th>
                        ${selectedPlayers.map(p => `
                            <td style="text-align:center; color:${p.overall > 90 ? 'var(--danger)' : 'var(--success)'}; font-weight:bold;">
                                ${p.overall > 90 ? '⚠️ High (과부하)' : '✅ Normal (안정)'}
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <th>AI 팀 시너지 분석</th>
                        ${selectedPlayers.map(p => `
                            <td style="font-size:12px; line-height:1.5; color:var(--text-main);">
                                ${p.overall > 90 ? '핵심 리더로서 프로젝트의 기술적 완성도를 책임질 수 있는 자원입니다.' : '뛰어난 서포트 능력으로 팀원 간의 소통을 원활하게 할 촉매제 역할을 수행합니다.'}
                            </td>
                        `).join('')}
                    </tr>
                </tbody>
            </table>
            
            <div class="glass-panel" style="margin-top:25px; padding:20px; border-left:4px solid var(--gold-main);">
                <h4 style="color:var(--gold-main); margin-bottom:10px;"><i class="fa-solid fa-robot"></i> AI 종합 코멘트 (Team Synergy Analysis)</h4>
                <p style="font-size:13px;">선택된 ${selectedPlayers.length}명의 인재 조합은 <strong>균형 잡힌 역량 분포</strong>를 보이고 있습니다. ${selectedPlayers.some(p => p.overall > 90) ? '기술 리더가 포함되어 있어 난이도 높은 과업 수행에 적합합니다.' : '전반적으로 협업 능력이 우수하여 안정적인 운영 위주의 프로젝트에 최적화되어 있습니다.'}</p>
            </div>
        `;

        content.innerHTML = tableHTML;
        modal.classList.add('show');
    }

    // 비교 모달 닫기 및 버튼 이벤트
    document.getElementById('close-compare-modal')?.addEventListener('click', () => {
        document.getElementById('compare-modal').classList.remove('show');
    });
    document.getElementById('btn-execute-compare')?.addEventListener('click', openCompareModal);

    // --- 교육 추천 모달 렌더링 ---
    function openTrainingSuggestion(player) {
        const modal = document.getElementById('training-suggestion-modal');
        const content = document.getElementById('training-suggestion-content');
        if(!modal || !content) return;

        // 부족 역량 추출 (70 미만)
        const weakStats = [];
        if(player.stats.prf < 70) weakStats.push("문제해결력(PRF)");
        if(player.stats.cop < 70) weakStats.push("협업능력(COP)");
        if(player.stats.grw < 70) weakStats.push("자기계발(GRW)");

        if(weakStats.length === 0) weakStats.push("없음 (우수한 역량 보유)");

        content.innerHTML = `
            <div style="padding: 10px;">
                <div style="margin-bottom: 20px;">
                    <div style="font-size:12px; color:var(--text-muted);">부족 역량 진단</div>
                    <div style="font-size:18px; color:var(--danger); font-weight:bold;">${weakStats.join(", ")}</div>
                </div>

                <div class="db-widget glass-panel" style="margin-bottom: 20px;">
                    <h4 style="color:var(--primary-neon); margin-bottom:10px;">Top 2 AI 추천 교육</h4>
                    <div style="font-size:13px;">
                        <div style="padding:10px; border-bottom:1px solid rgba(255,255,255,0.05);">
                            <strong>1. 실무 보고서 작성 및 논리적 사고</strong>
                            <p style="color:var(--text-muted); font-size:11px; margin-top:5px;">예상 효과: PRF +4 상승</p>
                        </div>
                        <div style="padding:10px;">
                            <strong>2. 비즈니스 커뮤니케이션 스킬업</strong>
                            <p style="color:var(--text-muted); font-size:11px; margin-top:5px;">예상 효과: COP +3 상승</p>
                        </div>
                    </div>
                </div>

                <button class="btn-primary" style="width:100%;" onclick="alert('교육 제안이 발송되었습니다.'); document.getElementById('training-suggestion-modal').classList.remove('show');">교육 신청/제안 발송</button>
            </div>
        `;
        modal.classList.add('show');
    }

    // --- 업무 부담 확인 모달 렌더링 ---
    function openWorkloadCheck(player) {
        const modal = document.getElementById('workload-check-modal');
        const content = document.getElementById('workload-check-content');
        if(!modal || !content) return;

        const isOverloaded = player.overall > 90;
        const riskLevel = isOverloaded ? "High" : "Low";
        const riskColor = isOverloaded ? "var(--danger)" : "var(--success)";
        const loadPercent = isOverloaded ? 135 : 75;

        content.innerHTML = `
            <div style="padding: 10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <div>
                        <div style="font-size:12px; color:var(--text-muted);">번아웃 위험도</div>
                        <div style="font-size:24px; font-weight:bold; color:${riskColor};">${riskLevel}</div>
                    </div>
                    <i class="fa-solid fa-battery-three-quarters" style="font-size:40px; color:${riskColor};"></i>
                </div>
                <div class="workload-gauge">
                    <div class="workload-fill" style="width:${loadPercent}%; background:${riskColor};"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:11px; margin-top:5px; color:var(--text-muted);">
                    <span>팀 평균 업무량 대비</span>
                    <span style="color:${riskColor}; font-weight:bold;">${loadPercent}%</span>
                </div>
                <div style="margin-top:25px; font-size:13px; line-height:1.6;">
                    <p>• 진행 중인 프로젝트: <strong>${isOverloaded ? '4건' : '2건'}</strong></p>
                    <p>• 마감 임박 업무: <strong>${isOverloaded ? '3건' : '0건'}</strong></p>
                    <p style="margin-top:10px; color:${riskColor};">${isOverloaded ? '⚠️ 추가 업무 배정 시 과부하로 인한 성과 하락이 우려됩니다.' : '✅ 추가 업무 수행이 가능한 여유가 있습니다.'}</p>
                </div>
            </div>
        `;
        modal.classList.add('show');
    }

    // --- 상세 프로필 모달 렌더링 (탭 시스템 도입) ---
    function openPlayerDetail(player) {
        const modal = document.getElementById('player-detail-modal');
        const content = document.getElementById('player-detail-content');
        if(!modal || !content) return;

        content.innerHTML = `
            <div class="detail-tabs">
                <button class="tab-btn active" data-tab="basic"><i class="fa-solid fa-id-card"></i> 기본 정보</button>
                <button class="tab-btn" data-tab="history"><i class="fa-solid fa-history"></i> 프로젝트 이력</button>
                <button class="tab-btn" data-tab="training"><i class="fa-solid fa-graduation-cap"></i> 교육훈련</button>
                <button class="tab-btn" data-tab="condition"><i class="fa-solid fa-battery-half"></i> 업무·컨디션</button>
                <button class="tab-btn" data-tab="evaluation"><i class="fa-solid fa-scale-balanced"></i> 평가·피드백</button>
            </div>
            <div id="tab-container" style="min-height: 450px;"></div>
        `;

        renderTabContent('basic', player);

        content.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                content.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderTabContent(btn.getAttribute('data-tab'), player);
            });
        });

        modal.classList.add('show');
    }

    // --- 탭 콘텐츠 분기 렌더링 ---
    function renderTabContent(tabName, player) {
        const container = document.getElementById('tab-container');
        if(!container) return;

        switch(tabName) {
            case 'basic': container.innerHTML = renderBasicTab(player); break;
            case 'history': container.innerHTML = renderHistoryTab(player); break;
            case 'training': container.innerHTML = renderTrainingTab(player); break;
            case 'condition': container.innerHTML = renderConditionTab(player); break;
            case 'evaluation': container.innerHTML = renderEvaluationTab(player); break;
        }

        attachTabEvents(player);
    }

    // 1. 기본 정보 탭 렌더링
    function renderBasicTab(player) {
        return `
            <div class="detail-grid">
                <div style="text-align: center; border-right: 1px solid rgba(255,255,255,0.1); padding-right: 20px;">
                    <img src="${player.imgUrl}" style="width:120px; height:120px; object-fit:cover; border-radius:10px; border:2px solid var(--gold-main); margin-bottom:15px;">
                    <h3>${player.name}</h3>
                    <p style="color:var(--gold-main); font-size:14px; margin-bottom:20px;">${player.dept} / ${player.role}</p>
                    <div class="radar-chart-mock">
                        <div class="radar-web"></div>
                        <div class="radar-poly"></div>
                    </div>
                    <div style="margin-top:20px;">
                        <div style="font-size:12px; color:var(--text-muted);">누적 성과 포인트</div>
                        <div style="font-size:24px; font-weight:bold; color:var(--gold-main);">12,500 GP</div>
                    </div>
                    <div style="margin-top:25px; display:flex; flex-direction:column; gap:8px;">
                        <button class="btn-secondary" style="width:100%; font-size:12px;" id="btn-view-growth" data-id="${player.id}"><i class="fa-solid fa-chart-line"></i> 성장 이력 보기</button>
                        <button class="btn-secondary" style="width:100%; font-size:12px;" id="btn-request-meeting" data-id="${player.id}"><i class="fa-solid fa-comments"></i> 1:1 면담 요청</button>
                    </div>
                </div>
                <div>
                    <div class="db-widget glass-panel" style="margin-bottom:15px;">
                        <h4><i class="fa-solid fa-star" style="color:var(--gold-main);"></i> 최근 성과 요약</h4>
                        <p style="font-size:13px; line-height:1.6;">${player.name}님은 기술 리더로서 뛰어난 역량을 보여주고 있습니다.</p>
                    </div>
                    <div class="db-widget glass-panel" style="border-left: 3px solid var(--primary-neon);">
                        <h4><i class="fa-solid fa-robot"></i> AI 커리어 성장 제안</h4>
                        <p style="font-size:13px; line-height:1.5;">"차기 글로벌 확장 프로젝트의 핵심 멤버로 추천합니다."</p>
                    </div>
                </div>
            </div>
        `;
    }

    // 2. 프로젝트 이력 탭 렌더링
    function renderHistoryTab(player) {
        return `
            <div style="padding: 10px;">
                <div class="detail-history-item">
                    <span style="font-size:11px; color:var(--text-muted);">2026.01 - 2026.04 (진행중)</span>
                    <h3>글로벌 시장 런칭 TF</h3>
                    <p style="font-size:13px; color:var(--gold-main);">역할: 데이터 아키텍처 설계</p>
                </div>
            </div>
        `;
    }

    // 3. 교육훈련 탭 렌더링
    function renderTrainingTab(player) {
        return `<div style="padding: 10px;"><h4 style="color:var(--gold-main);">수료 완료 및 진행 중인 교육</h4></div>`;
    }

    // 4. 업무·컨디션 탭 렌더링
    function renderConditionTab(player) {
        return `<div style="padding: 10px;"><h4 style="color:var(--danger);">실시간 업무 부하량</h4></div>`;
    }

    // 5. 평가·피드백 탭 렌더링
    function renderEvaluationTab(player) {
        const fairnessScore = 85; // 가상 데이터
        return `
            <div class="evaluation-dashboard">
                <div class="eval-summary-grid">
                    <div class="feedback-bubble">
                        <h5><i class="fa-solid fa-user-tie"></i> 팀장 평가</h5>
                        <p>리딩 능력 우수. 데이터 세밀 검토 요망.</p>
                    </div>
                    <div class="feedback-bubble">
                        <h5><i class="fa-solid fa-user-check"></i> 자기 평가</h5>
                        <p>기술 해결 만족. 소통 주기 단축 노력 중.</p>
                    </div>
                </div>

                <div class="fairness-pulse-container">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h4 style="color:var(--primary-neon); margin:0;"><i class="fa-solid fa-wave-square"></i> 공정성 체감도 (Fairness Pulse)</h4>
                        <span style="color:var(--primary-neon); font-weight:bold;">${fairnessScore}%</span>
                    </div>
                    <div class="fairness-pulse-bar">
                        <div class="fairness-pulse-fill" style="width:${fairnessScore}%;"></div>
                    </div>
                    <p style="font-size:11px; color:var(--text-muted); margin:0;">* 보상과 인정이 본인의 기여도에 부합한다고 느끼는 정도입니다.</p>
                </div>

                <div class="eval-explanation-box">
                    <h4 style="margin-bottom:6px; color:var(--gold-main); font-size:12px;"><i class="fa-solid fa-robot"></i> AI 평가 근거 요약</h4>
                    <p style="margin:0;">
                        성과 지표(PRF) 15% 상승 및 동료 피드백 우수. 협업 지연 로그 2회로 협업력(COP) 소폭 반영됨.
                    </p>
                </div>

                <div class="eval-action-group">
                    <button class="btn-secondary" id="btn-request-explanation" title="평가 설명 요청"><i class="fa-solid fa-circle-question"></i> 설명요청</button>
                    <button class="btn-secondary" id="btn-file-appeal" title="이의 제기"><i class="fa-solid fa-scale-unbalanced"></i> 이의제기</button>
                    <button class="btn-primary" id="btn-write-feedback" title="피드백 작성"><i class="fa-solid fa-pen-to-square"></i> 피드백</button>
                    <button class="btn-primary" id="btn-eval-meeting" title="면담 요청" style="background:var(--gold-main); color:#000;"><i class="fa-solid fa-comments"></i> 면담요청</button>
                </div>
            </div>
        `;
    }

    // 탭 내 버튼 이벤트 바인딩
    function attachTabEvents(player) {
        document.getElementById('btn-view-growth')?.addEventListener('click', () => openGrowthHistory(player));
        document.getElementById('btn-request-meeting')?.addEventListener('click', () => {
            document.getElementById('meeting-request-modal').classList.add('show');
        });
        
        // 평가 탭 이벤트
        document.getElementById('btn-request-explanation')?.addEventListener('click', () => {
            showToast("평가 설명 요청이 팀장에게 전달되었습니다.");
        });
        document.getElementById('btn-file-appeal')?.addEventListener('click', () => {
            alert("이의 제기 폼을 불러옵니다. (사유 및 증빙 자료 입력)");
        });
        document.getElementById('btn-write-feedback')?.addEventListener('click', () => {
            showToast("피드백 작성 모달을 활성화합니다.");
        });
        document.getElementById('btn-eval-meeting')?.addEventListener('click', () => {
            document.getElementById('meeting-request-modal').classList.add('show');
        });
    }

    // --- 프로젝트 배치 제안 모달 렌더링 ---
    function openTransferProposal(player) {
        const modal = document.getElementById('transfer-proposal-modal');
        const content = document.getElementById('transfer-proposal-content');
        if(!modal || !content) return;

        content.innerHTML = `
            <div style="padding: 20px;">
                <div style="margin-bottom: 25px;">
                    <span style="font-size: 14px; color: var(--text-muted);">대상 인재:</span>
                    <h2 style="color: var(--gold-main);">${player.name} (${player.role})</h2>
                </div>
                <div class="glass-panel" style="padding: 20px; border: 1px solid var(--success); background: rgba(0,255,153,0.05); margin-bottom: 20px;">
                    <div style="font-size: 14px; margin-bottom: 10px;">🎯 [배치 제안 프로젝트]</div>
                    <h3 style="margin-bottom: 15px;">AI 융합 신제품 기획 프로젝트</h3>
                    <div style="display:flex; justify-content: space-around; align-items:center;">
                        <div>
                            <div style="font-size: 11px; color: var(--text-muted);">AI Fit Score</div>
                            <div style="font-size: 28px; font-weight: bold; color: var(--success);">95%</div>
                        </div>
                        <div style="width: 1px; height: 40px; background: rgba(255,255,255,0.1);"></div>
                        <div>
                            <div style="font-size: 11px; color: var(--text-muted);">현재 업무 부담</div>
                            <div style="font-size: 14px; font-weight: bold;">Normal (안정적)</div>
                        </div>
                    </div>
                </div>
                <button class="btn-primary" style="width: 100%; padding: 15px;" onclick="alert('배치 제안이 HR팀으로 발송되었습니다.'); document.getElementById('transfer-proposal-modal').classList.remove('show');">
                    최종 배치 신청 (Submit Transfer Offer)
                </button>
            </div>
        `;
        modal.classList.add('show');
    }

    // --- 성장 이력 모달 렌더링 ---
    function openGrowthHistory(player) {
        const modal = document.getElementById('growth-history-modal');
        const content = document.getElementById('growth-history-content');
        if(!modal || !content) return;

        content.innerHTML = `
            <div style="padding: 10px;">
                <h3 style="color:var(--gold-main); margin-bottom:20px;">${player.name}님의 성장 트렌드</h3>
                <div style="margin-top:25px; padding:20px; text-align:center;">
                    <div style="font-size:30px; color:var(--success);">Overall: ${player.overall}</div>
                </div>
            </div>
        `;
        modal.classList.add('show');
    }

    // 모달 닫기 버튼들 통합 이벤트 바인딩
    const closeButtons = [
        { id: 'close-player-detail', modal: 'player-detail-modal' },
        { id: 'close-transfer-proposal', modal: 'transfer-proposal-modal' },
        { id: 'close-training-suggestion', modal: 'training-suggestion-modal' },
        { id: 'close-growth-history', modal: 'growth-history-modal' },
        { id: 'close-workload-check', modal: 'workload-check-modal' },
        { id: 'close-meeting-request', modal: 'meeting-request-modal' },
        { id: 'close-compare-modal', modal: 'compare-modal' },
        { id: 'close-training', modal: 'training-modal' },
        { id: 'close-project', modal: 'project-modal' },
        { id: 'close-match-result', modal: 'match-result-modal' },
        { id: 'close-training-center', modal: 'training-center-modal' }
    ];

    closeButtons.forEach(btn => {
        document.getElementById(btn.id)?.addEventListener('click', () => {
            const modalEl = document.getElementById(btn.modal);
            if(modalEl) modalEl.classList.remove('show');
        });
    });

    // --- Mode Toggle Functionality ---
    const modeBtns = document.querySelectorAll('.mode-btn');
    const privacyStatusBadge = document.getElementById('gnb-privacy-toggle');

    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            modeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentMode = e.target.getAttribute('data-mode');
            
            if (privacyStatusBadge) {
                if (currentMode === 'personal') {
                    privacyStatusBadge.querySelector('span').textContent = '정보 보호: ON (개인모드)';
                    privacyStatusBadge.style.color = "var(--primary-neon)";
                } else if (currentMode === 'admin') {
                    privacyStatusBadge.querySelector('span').textContent = 'C-Level 권한: 활성';
                    privacyStatusBadge.style.color = "var(--danger)";
                } else if (currentMode === 'hr') {
                    privacyStatusBadge.querySelector('span').textContent = 'HR 권한: 활성';
                    privacyStatusBadge.style.color = "var(--gold-main)";
                } else {
                    privacyStatusBadge.querySelector('span').textContent = '팀장 권한: 활성';
                    privacyStatusBadge.style.color = "var(--success)";
                }
            }

            // 모든 뷰 숨김 및 투명도 0
            const sections = [adminDashboardSection, hrDashboardSection, teamDashboardSection, personalDashboardSection];
            sections.forEach(sec => {
                if(sec) {
                    sec.style.opacity = 0;
                    setTimeout(() => { sec.style.display = 'none'; }, 300); // 0.3초 애니메이션 후 숨김
                }
            });
            
            setTimeout(() => {
                // 선택된 모드에 따라 뷰 표시 (Routing)
                let targetSection = null;
                if (currentMode === 'admin') targetSection = adminDashboardSection;
                else if (currentMode === 'hr') targetSection = hrDashboardSection;
                else if (currentMode === 'team') targetSection = teamDashboardSection;
                else if (currentMode === 'personal') targetSection = personalDashboardSection;

                if (targetSection) {
                    targetSection.style.display = 'block';
                    // 강제 리플로우
                    void targetSection.offsetWidth;
                    targetSection.style.opacity = 1;
                    targetSection.style.transition = 'opacity 0.4s ease';
                }

                // 필요 시 하위 컴포넌트 렌더링 호출
                renderCards();
                
            }, 300);
        });
    });

    // --- Training Center (Dashboard) Modal Logic ---
    const gnbTraining = document.getElementById('gnb-training');
    const trainingCenterModal = document.getElementById('training-center-modal');
    const closeTrainingCenterBtn = document.getElementById('close-training-center');
    const btnOpenTrainingUpload = document.getElementById('btn-open-training-upload');

    // 1. GNB 훈련 버튼 클릭 시 -> 대형 대시보드 모달 오픈
    if (gnbTraining && trainingCenterModal) {
        gnbTraining.addEventListener('click', (e) => {
            e.preventDefault();
            trainingCenterModal.classList.add('show');
        });
    }
    if (closeTrainingCenterBtn && trainingCenterModal) {
        closeTrainingCenterBtn.addEventListener('click', () => {
            trainingCenterModal.classList.remove('show');
        });
    }

    // 2. 대시보드 내부 '인증하기' 버튼 클릭 시 -> 기존 자격증 제출 모달(Nested) 오픈
    const trainingModal = document.getElementById('training-modal');
    const closeTrainingBtn = document.getElementById('close-training');
    const btnSubmitTraining = document.getElementById('btn-submit-training');
    const nextGrwText = document.getElementById('next-grw');
    const successMsg = document.getElementById('training-success-msg');

    if (btnOpenTrainingUpload && trainingModal) {
        btnOpenTrainingUpload.addEventListener('click', (e) => {
            e.preventDefault();
            // Nested Modal로 띄움 (기존 로직 초기화)
            if(nextGrwText) {
                nextGrwText.textContent = "95";
                nextGrwText.style.color = "var(--primary-neon)";
            }
            if(successMsg) successMsg.style.display = 'none';
            
            trainingModal.classList.add('show');
        });
    }

    // --- Legacy Training Modal Logic (자격증 제출 폼) ---
    const navTraining = document.getElementById('nav-training');

    if (navTraining && trainingModal) {
        navTraining.addEventListener('click', (e) => {
            e.preventDefault();
            trainingModal.classList.add('show');
            // 초기화
            nextGrwText.textContent = "95";
            nextGrwText.style.color = "var(--primary-neon)";
            successMsg.style.display = 'none';
        });

        closeTrainingBtn.addEventListener('click', () => {
            trainingModal.classList.remove('show');
        });

        // 모달 배경 클릭 시 닫기
        trainingModal.addEventListener('click', (e) => {
            if (e.target === trainingModal) {
                trainingModal.classList.remove('show');
            }
        });

        // 훈련 제출 및 스탯 상승 시뮬레이션
        btnSubmitTraining.addEventListener('click', () => {
            const btnIcon = btnSubmitTraining.querySelector('i');
            btnIcon.className = 'fa-solid fa-spinner fa-spin';
            btnSubmitTraining.disabled = true;
            btnSubmitTraining.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> AI가 자격증을 검증하고 있습니다...';
            
            setTimeout(() => {
                // 검증 완료 애니메이션
                btnSubmitTraining.innerHTML = '<i class="fa-solid fa-check"></i> 검증 완료';
                btnSubmitTraining.style.background = 'var(--success)';
                btnSubmitTraining.style.color = '#000';
                
                // 스탯 상승 애니메이션
                nextGrwText.textContent = "98";
                nextGrwText.style.color = "var(--gold-main)";
                nextGrwText.style.textShadow = "0 0 15px var(--gold-main)";
                
                // 성공 메시지 출력
                successMsg.style.display = 'block';
                
                // 메인 카드 데이터 연동 (시뮬레이션: EMP04 김건우의 GRW를 98로 변경 후 리렌더링)
                const targetPlayer = players.find(p => p.id === 'EMP04');
                if(targetPlayer) {
                    targetPlayer.stats.grw = 98;
                    targetPlayer.overall = Math.round((targetPlayer.stats.prf + targetPlayer.stats.cop + targetPlayer.stats.grw) / 3);
                    renderCards(); // 백그라운드에서 카드 다시 그리기
                }

                // 버튼 원상복구 로직 (3초 후 닫을 수 있도록 안내)
                setTimeout(() => {
                    btnSubmitTraining.innerHTML = '<i class="fa-solid fa-upload"></i> 추가 제출하기';
                    btnSubmitTraining.style.background = '';
                    btnSubmitTraining.style.color = '';
                    btnSubmitTraining.disabled = false;
                }, 3000);

            }, 1500);
        });
    }

    // --- Project Creation & AI Matchmaking Logic ---
    const btnCreateProject = document.getElementById('btn-create-project');
    const projectModal = document.getElementById('project-modal');
    const closeProjectBtn = document.getElementById('close-project');
    const tagBtns = document.querySelectorAll('.tag-btn');
    const btnSubmitProject = document.getElementById('btn-submit-project');
    
    const matchResultModal = document.getElementById('match-result-modal');
    const closeMatchResultBtn = document.getElementById('close-match-result');
    const aiLoadingState = document.getElementById('ai-loading-state');
    const aiResultState = document.getElementById('ai-result-state');
    const aiMatchCardsContainer = document.getElementById('ai-match-cards');

    // 모달 열기/닫기
    if (btnCreateProject && projectModal) {
        btnCreateProject.addEventListener('click', () => {
            projectModal.classList.add('show');
        });
        closeProjectBtn.addEventListener('click', () => {
            projectModal.classList.remove('show');
        });
    }

    // 태그 다중 선택 기능
    if (tagBtns) {
        tagBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('selected');
            });
        });
    }

    // 프로젝트 등록 및 매치메이킹 트리거
    if (btnSubmitProject && matchResultModal) {
        btnSubmitProject.addEventListener('click', () => {
            // 프로젝트 폼 닫기
            projectModal.classList.remove('show');
            
            // 매칭 모달 띄우고 로딩 상태 초기화
            matchResultModal.classList.add('show');
            aiLoadingState.style.display = 'block';
            aiResultState.style.display = 'none';

            // 2초 후 매칭 결과 렌더링 시뮬레이션
            setTimeout(() => {
                aiLoadingState.style.display = 'none';
                aiResultState.style.display = 'block';
                renderMatchCards();
            }, 2000);
        });
    }

    // 매칭 결과창 닫기
    if (closeMatchResultBtn) {
        closeMatchResultBtn.addEventListener('click', () => {
            matchResultModal.classList.remove('show');
        });
    }
    
    const btnFinishScout = document.getElementById('btn-finish-scout');
    if(btnFinishScout) {
        btnFinishScout.addEventListener('click', () => {
            alert("선택된 인재들에게 스카우팅 제안 알림이 전송되었습니다!");
            matchResultModal.classList.remove('show');
        });
    }

    // AI 매치 카드 렌더링 함수 (OVR 상위 3명 추출 Mock)
    function renderMatchCards() {
        if (!aiMatchCardsContainer) return;
        aiMatchCardsContainer.innerHTML = '';
        
        // Mock 로직: 점수 내림차순 정렬 후 상위 3명 가져오기
        const sortedPlayers = [...players].sort((a, b) => b.overall - a.overall).slice(0, 3);

        sortedPlayers.forEach(player => {
            let goldHighlight = player.status === "TOTW" ? "color: var(--gold-light); text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);" : "";
            
            const cardHTML = `
                <div class="player-card">
                    <div class="card-header">
                        <div class="rating">
                            <span class="rating-score" style="${goldHighlight}">${player.overall}</span>
                            <span class="rating-pos">${player.role.substring(0,4)}</span>
                        </div>
                        <div class="card-badge">
                            <i class="fa-solid fa-building club-logo"></i>
                            <span style="font-size: 10px; font-weight: bold;">${player.dept}</span>
                        </div>
                    </div>
                    
                    <div class="card-image">
                        <img src="${player.imgUrl}" alt="${player.name}">
                        <div class="player-name">${player.name}</div>
                    </div>

                    <div class="card-stats" style="grid-template-columns: 1fr 1fr 1fr;">
                        <div class="stat-item" style="flex-direction: column; align-items: center;">
                            <span class="stat-val">${player.stats.prf}</span>
                            <span class="stat-lbl">PRF</span>
                        </div>
                        <div class="stat-item" style="flex-direction: column; align-items: center;">
                            <span class="stat-val">${player.stats.cop}</span>
                            <span class="stat-lbl">COP</span>
                        </div>
                        <div class="stat-item" style="flex-direction: column; align-items: center;">
                            <span class="stat-val">${player.stats.grw}</span>
                            <span class="stat-lbl">GRW</span>
                        </div>
                    </div>
                    <div class="stat-highlight" style="color:var(--success); background:rgba(0,255,153,0.1); border-top:1px solid var(--success);">
                        <i class="fa-solid fa-check"></i> 매칭 적합도 98%
                    </div>
                </div>
            `;
            aiMatchCardsContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // ==========================================
    // --- Talent Map Modal Logic ---
    // ==========================================
    const btnTalentMap = document.getElementById('gnb-talent-map');
    const talentMapModal = document.getElementById('talent-map-modal');
    const closeTalentMapBtn = document.getElementById('close-talent-map');

    if (btnTalentMap && talentMapModal) {
        btnTalentMap.addEventListener('click', (e) => {
            e.preventDefault();
            talentMapModal.classList.add('show');
        });
    }

    if (closeTalentMapBtn && talentMapModal) {
        closeTalentMapBtn.addEventListener('click', () => {
            talentMapModal.classList.remove('show');
        });
    }

    // ==========================================
    // --- Reward Modal Logic ---
    // ==========================================
    const btnReward = document.getElementById('gnb-reward');
    const rewardModal = document.getElementById('reward-modal');
    const closeRewardBtn = document.getElementById('close-reward');

    if (btnReward && rewardModal) {
        btnReward.addEventListener('click', (e) => {
            e.preventDefault();
            rewardModal.classList.add('show');
        });
    }

    if (closeRewardBtn && rewardModal) {
        closeRewardBtn.addEventListener('click', () => {
            rewardModal.classList.remove('show');
        });
    }

    // ==========================================
    // --- Notification Modal Logic ---
    // ==========================================
    const btnNotify = document.getElementById('gnb-notify');
    const notifyModal = document.getElementById('notification-modal');
    const closeNotifyBtn = document.getElementById('close-notification');
    const notifyBadge = document.getElementById('notify-badge');

    if (btnNotify && notifyModal) {
        btnNotify.addEventListener('click', (e) => {
            e.preventDefault();
            notifyModal.classList.add('show');
            // 알림 확인 시 배지 숨김
            if (notifyBadge) notifyBadge.style.display = 'none';
        });
    }

    if (closeNotifyBtn && notifyModal) {
        closeNotifyBtn.addEventListener('click', () => {
            notifyModal.classList.remove('show');
        });
    }

    // ==========================================
    // --- Privacy Mode Toggle Logic ---
    // ==========================================
    const gnbPrivacyToggleBtn = document.getElementById('gnb-privacy-toggle');
    const privacyStatusTextLabel = document.getElementById('privacy-status-text');

    if (gnbPrivacyToggleBtn) {
        gnbPrivacyToggleBtn.addEventListener('click', () => {
            const isPrivacyActive = document.body.classList.toggle('privacy-active');
            
            if (isPrivacyActive) {
                gnbPrivacyToggleBtn.classList.remove('off');
                if(privacyStatusTextLabel) privacyStatusTextLabel.textContent = "보호 ON";
                gnbPrivacyToggleBtn.querySelector('i').className = "fa-solid fa-shield-halved";
            } else {
                gnbPrivacyToggleBtn.classList.add('off');
                if(privacyStatusTextLabel) privacyStatusTextLabel.textContent = "보호 OFF";
                gnbPrivacyToggleBtn.querySelector('i').className = "fa-solid fa-shield";
                alert("🔓 개인정보 보호 모드가 해제되었습니다. 모든 민감 데이터가 노출됩니다.");
            }
        });
    }

    // Initial render
    renderCards();
});
