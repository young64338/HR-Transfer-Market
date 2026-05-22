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
        },
        {
            id: "EMP06",
            name: "황한솔",
            role: "인사 기획 및 HR담당자",
            dept: "인사총무팀",
            overall: 88,
            stats: {
                prf: 89,
                cop: 92,
                grw: 83
            },
            matchRating: "8.8",
            highlight: "우수한 소통 및 리더십, HR 평가 기획 우수",
            status: "Normal",
            imgUrl: "https://i.pravatar.cc/150?img=12"
        }
    ];

    // 로그인 유저 전역 세션 상태 관리
    let currentUser = null;

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

    // --- [Phase 7] 자율 태스크 데이터 정의 ---
    let userTasks = [
        {
            id: "task-1",
            name: "A프로젝트 요건 정의서 작성",
            priority: "High",
            estTime: "2시간",
            deadline: "14:00",
            project: "프로젝트 A",
            collaborators: "김영은, 오주영",
            notes: "기획 요구사항 최신화 필요",
            completed: false,
            completedAt: null
        },
        {
            id: "task-2",
            name: "주간 업무 리포트 작성",
            priority: "Med",
            estTime: "1시간",
            deadline: "18:00",
            project: "기타 업무",
            collaborators: "",
            notes: "금주 실적 정리",
            completed: false,
            completedAt: null
        }
    ];

    // --- [Phase 6] 주간 역량 루프 상태 정의 ---
    let loopStates = {
        priority: {
            state: "Pending", // Pending, Awaiting Manager, Synced
            badgeText: "미완료 (Pending)",
            badgeClass: "warning"
        },
        context: {
            state: "In Progress", // In Progress, Delayed, Issue Alert
            badgeText: "진행 중 (In Progress)",
            badgeClass: "info"
        },
        equity: {
            state: "To-do", // To-do, Completed, Equity Alert
            badgeText: "작성 전 (To-do)",
            badgeClass: "warning"
        },
        mirror: {
            state: "Generating", // Generating, Report Ready, Action Required
            badgeText: "자동 생성 대기 (Generating)",
            badgeClass: "info"
        }
    };


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
            
            // 1. 개인 모드 렌더링 (로그인한 사용자의 인재 카드만 노출되도록 동적 매핑)
            if (currentMode === 'personal') {
                // 현재 로그인한 사용자가 존재하면 해당 ID를 사용하고, 없을 경우 기본값으로 'EMP01'을 사용합니다.
                const myId = currentUser ? currentUser.id : 'EMP01';
                if (player.id === myId && personalCardContainer) {
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

    // ==========================================
    // --- [Phase 7] 자율 태스크 관리 기능 엔진 ---
    // ==========================================

    /**
     * 등록된 오늘의 할 일 목록을 화면에 동적으로 렌더링하고,
     * 체크박스 완료 상태 변경 이벤트를 감지 및 바인딩합니다.
     */
    function renderTasks() {
        const taskListContainer = document.getElementById('personal-task-list');
        if (!taskListContainer) return;

        taskListContainer.innerHTML = '';

        if (userTasks.length === 0) {
            // 태스크가 한 개도 없는 경우 빈 화면용 안내 메시지 출력
            taskListContainer.innerHTML = `
                <li class="task-empty" style="color: var(--text-muted); text-align: center; padding: 25px 0; font-style: italic; font-size: 13px;">
                    오늘 등록된 마이크로 태스크가 없습니다. 새로운 할 일을 추가해보세요!
                </li>
            `;
            return;
        }

        userTasks.forEach(task => {
            const isCompleted = task.completed;
            const li = document.createElement('li');
            li.className = `task-item ${isCompleted ? 'complete' : ''}`;
            li.dataset.id = task.id;

            li.innerHTML = `
                <div class="task-checkbox-container">
                    <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked disabled' : ''} data-id="${task.id}">
                </div>
                <div class="task-content">
                    <div class="task-title">${task.name}</div>
                    <div class="task-meta">
                        <span class="priority-tag ${task.priority}">${task.priority}</span>
                        ${task.estTime ? `<span><i class="fa-regular fa-clock"></i> ${task.estTime}</span>` : ''}
                        ${task.deadline ? `<span><i class="fa-regular fa-hourglass-half"></i> 마감 ${task.deadline}</span>` : ''}
                        ${task.project ? `<span><i class="fa-solid fa-folder-open"></i> ${task.project}</span>` : ''}
                        ${task.collaborators ? `<span><i class="fa-solid fa-users"></i> ${task.collaborators}</span>` : ''}
                    </div>
                </div>
            `;

            // 아직 완료되지 않은 일만 체크박스 변경 감지
            if (!isCompleted) {
                const checkbox = li.querySelector('.task-checkbox');
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        toggleTaskCompletion(task.id);
                    }
                });
            }

            taskListContainer.appendChild(li);
        });
    }

    /**
     * 특정 할 일을 완료 상태로 토글하고,
     * 보상 포인트 (+100 pt) 지급 및 능력치(GRW, PRF) 미세 상승 시뮬레이션을 수행합니다.
     * @param {string} taskId - 처리할 태스크의 고유 식별자
     */
    function toggleTaskCompletion(taskId) {
        const task = userTasks.find(t => t.id === taskId);
        if (!task) return;

        task.completed = true;
        task.completedAt = new Date().toISOString();

        // 1. 포인트 보상 지급 (+100 pt) 및 화면 연동
        userPoints += 100;
        updatePointsUI();

        // 2. 능력치 상승 시뮬레이션 (로그인한 사용자 본인 기준)
        // 현재 로그인한 사용자가 존재하면 해당 ID를 사용하고, 없을 경우 기본값으로 'EMP01'을 사용합니다.
        const myId = currentUser ? currentUser.id : 'EMP01';
        const targetPlayer = players.find(p => p.id === myId);
        if (targetPlayer) {
            // 태스크 완수에 따라 PRF(해결력) 및 GRW(성장성) 스탯 1씩 점진적 상승
            targetPlayer.stats.prf = Math.min(99, targetPlayer.stats.prf + 1);
            targetPlayer.stats.grw = Math.min(99, targetPlayer.stats.grw + 1);
            // 종합 능력치(OVR) 재계산 및 카드 리렌더링
            targetPlayer.overall = Math.round((targetPlayer.stats.prf + targetPlayer.stats.cop + targetPlayer.stats.grw) / 3);
            renderCards();
        }

        // 3. 토스트 및 알림 메시지 출력
        showToast(`태스크 완료! +100 pt 획득 및 성과 능력치가 상승했습니다.`);

        // 4. 할 일 목록 리렌더링
        renderTasks();

        // 5. Context Tracker 병목 분석 실시간 업데이트
        if (loopStates.context.state === 'In Progress') {
            // 할 일 완료에 따라 지연 상태가 개선되는 흐름 시뮬레이션
            updateLoopBadges();
        }
    }

    // ==========================================
    // --- [Phase 6] 주간 역량 루프 AI 연동 엔진 ---
    // ==========================================

    /**
     * 주간 역량 루프의 실시간 상태 데이터를 기반으로
     * 개인 대시보드 카드 영역 내의 뱃지 텍스트와 스타일 클래스를 동적으로 업데이트합니다.
     */
    function updateLoopBadges() {
        const loops = ['priority', 'context', 'equity', 'mirror'];
        loops.forEach(loop => {
            const badge = document.getElementById(`status-badge-${loop}`);
            const stateData = loopStates[loop];
            if (badge && stateData) {
                badge.textContent = stateData.badgeText;
                // 기존 뱃지 스타일 클래스 초기화 후 세팅
                badge.className = 'badge';
                if (stateData.badgeClass) {
                    badge.classList.add(stateData.badgeClass);
                }
            }
        });
    }

    /**
     * 각 요일별 루프 카드의 액션 버튼을 클릭했을 때 모달을 띄우고,
     * AI 분석 및 진단 결과 템플릿 화면을 동적으로 출력합니다.
     * @param {string} loopType - 루프의 종류 (priority, context, equity, mirror)
     */
    function openLoopAIModal(loopType) {
        const modal = document.getElementById('loop-ai-modal');
        const modalTitle = document.getElementById('loop-modal-title');
        const modalBody = document.getElementById('loop-modal-body');

        if (!modal || !modalTitle || !modalBody) return;

        // 모달 기본 타이틀 재설정
        let titleIcon = '';
        let titleText = '';

        switch(loopType) {
            case 'priority':
                titleIcon = '<i class="fa-solid fa-bullseye" style="color: var(--primary-neon);"></i>';
                titleText = 'Monday Priority Sync - AI 진단';
                
                // Priority Sync 분석 내용 주입
                modalBody.innerHTML = `
                    <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; border-left: 3px solid var(--primary-neon);">
                        <span style="font-size: 11px; color: var(--text-muted);">전사 KPI 정렬도</span>
                        <div style="font-size: 24px; font-weight: bold; color: var(--primary-neon); margin-top: 5px;">90% (정상 정렬)</div>
                        <p style="font-size: 12px; color: var(--text-muted); margin-top: 8px; line-height: 1.4;">
                            현재 설정된 주간 목표가 AI기획팀 전체 우선순위 목표와 90% 이상 일치하며 핵심 리더로서의 방향성에 완벽히 수렴하고 있습니다.
                        </p>
                    </div>

                    <div style="background: rgba(255, 51, 102, 0.05); padding: 15px; border-radius: 8px; border-left: 3px solid var(--danger);">
                        <div style="font-size: 13px; font-weight: bold; color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> 일정 충돌 및 과부하 위험 조기 감지</div>
                        <p style="font-size: 12px; color: var(--text-main); margin-top: 8px; line-height: 1.4;">
                            이번 주 <strong>'프로젝트 A 핵심 설계'</strong> 마감과 <strong>'금주 운영 마감 업무'</strong> 일정이 겹쳐 있어, 목요일~금요일 사이 개인 리소스 과부하 임계치(120%)를 초과할 위험이 감지되었습니다.
                        </p>
                    </div>

                    <div style="margin-top: 10px;">
                        <h4 style="font-size: 13px; color: var(--gold-main); margin-bottom: 8px;"><i class="fa-solid fa-robot"></i> AI 최적 협업 추천</h4>
                        <p style="font-size: 12px; line-height: 1.5; color: var(--text-muted);">
                            업무 일정의 약 20% 분량을 동료 '오주영' 혹은 실무진 '이정무' 님에게 사전 공유 및 일부 서포트 위임 시, 일정 충돌 리스크를 15% 낮출 수 있습니다.
                        </p>
                    </div>

                    <div style="margin-top: 20px; display: flex; gap: 10px;">
                        <button class="btn-primary" id="btn-sync-action-1" style="flex: 1; justify-content: center; font-size: 12px;">팀장 확인 요청 발송</button>
                        <button class="btn-secondary" id="btn-sync-action-2" style="flex: 1; justify-content: center; font-size: 12px;">동기화(Sync) 완료</button>
                    </div>
                `;

                // 상태 전환 액션 이벤트 바인딩
                document.getElementById('btn-sync-action-1')?.addEventListener('click', () => {
                    loopStates.priority.state = 'Awaiting Manager';
                    loopStates.priority.badgeText = '팀장 확인 대기 (Awaiting Manager)';
                    loopStates.priority.badgeClass = 'info';
                    updateLoopBadges();
                    showToast("팀장님에게 우선순위 확인 요청이 발송되었습니다.");
                    modal.classList.remove('show');
                });
                document.getElementById('btn-sync-action-2')?.addEventListener('click', () => {
                    loopStates.priority.state = 'Synced';
                    loopStates.priority.badgeText = '완료 (Synced)';
                    loopStates.priority.badgeClass = 'safe';
                    updateLoopBadges();
                    showToast("이번 주 우선순위 동기화(Sync)가 완료되었습니다.");
                    modal.classList.remove('show');
                });
                break;

            case 'context':
                titleIcon = '<i class="fa-solid fa-route" style="color: var(--success);"></i>';
                titleText = 'Ongoing Context Tracker - 실시간 추적';

                // 오늘 할 일 데이터 기반 통계 계산
                const totalCount = userTasks.length;
                const completedCount = userTasks.filter(t => t.completed).length;
                const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                // 지연 요인 그래프 값 계산 (완료율이 낮을수록 병목 강도가 세짐)
                const isDelayed = completionRate < 50;
                const skillGapPercent = 40;
                const externalBottleneckPercent = 60;

                modalBody.innerHTML = `
                    <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                            <span>오늘의 마이크로 태스크 이행률</span>
                            <strong style="color: var(--success); font-size: 16px;">${completionRate}% (${completedCount}/${totalCount} 건 완료)</strong>
                        </div>
                        <div class="progress-bar-bg" style="margin-top: 10px; height: 10px;">
                            <div class="progress-bar-fill safe" style="width: ${completionRate}%;"></div>
                        </div>
                    </div>

                    <div style="margin-top: 10px;">
                        <h4 style="font-size: 13px; color: var(--gold-main); margin-bottom: 12px;"><i class="fa-solid fa-chart-pie"></i> 실시간 병목 원인 진단 (AI Bottleneck)</h4>
                        
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div>
                                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                                    <span>역량 격차 (Personal Skill Gap)</span>
                                    <span>${skillGapPercent}%</span>
                                </div>
                                <div class="progress-bar-bg" style="height: 6px;"><div class="progress-bar-fill info" style="width: ${skillGapPercent}%;"></div></div>
                            </div>
                            <div>
                                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                                    <span>외부 병목 (External Bottleneck)</span>
                                    <span>${externalBottleneckPercent}%</span>
                                </div>
                                <div class="progress-bar-bg" style="height: 6px;"><div class="progress-bar-fill warning" style="width: ${externalBottleneckPercent}%;"></div></div>
                            </div>
                        </div>
                        <p style="font-size: 11px; color: var(--text-muted); margin-top: 10px; line-height: 1.4;">
                            * 외부 병목 요인: 협업 대상자(이정무) 피드백 지연 및 인프라 승인 지연으로 인한 대기 시간 점유율이 높습니다.
                        </p>
                    </div>

                    <div style="margin-top: 20px; display: flex; gap: 10px;">
                        <button class="btn-primary" id="btn-context-action-1" style="flex: 1; justify-content: center; font-size: 12px;">지연 병목 이슈 등록 (Alert)</button>
                        <button class="btn-secondary" id="btn-context-action-2" style="flex: 1; justify-content: center; font-size: 12px;">정상 완료 처리</button>
                    </div>
                `;

                document.getElementById('btn-context-action-1')?.addEventListener('click', () => {
                    loopStates.context.state = 'Issue Alert';
                    loopStates.context.badgeText = '이슈 확인 필요 (Issue Alert)';
                    loopStates.context.badgeClass = 'danger';
                    updateLoopBadges();
                    showToast("지연 병목 알림 신호가 팀 보드에 등록되었습니다.");
                    modal.classList.remove('show');
                });
                document.getElementById('btn-context-action-2')?.addEventListener('click', () => {
                    loopStates.context.state = 'In Progress';
                    loopStates.context.badgeText = '진행 중 (In Progress)';
                    loopStates.context.badgeClass = 'info';
                    updateLoopBadges();
                    showToast("업무 상태가 정상 복구되었습니다.");
                    modal.classList.remove('show');
                });
                break;

            case 'equity':
                titleIcon = '<i class="fa-solid fa-scale-balanced" style="color: var(--gold-main);"></i>';
                titleText = 'Friday Equity Pulse - 공정성 펄스';

                // 익명 토글 박스의 실시간 상태 읽기
                const anonToggle = document.getElementById('equity-anon-toggle');
                const isAnonymous = anonToggle ? anonToggle.checked : false;

                modalBody.innerHTML = `
                    <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                            <span>제출 방식 및 대상자</span>
                            <span class="badge ${isAnonymous ? 'warning' : 'safe'}" style="font-weight: bold;">
                                ${isAnonymous ? '🔒 익명 제출 활성화됨' : '👤 기명 제출 (김영은)'}
                            </span>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <label style="font-size: 12px; color: var(--text-muted);">이번 주 업무량 분배의 적절성 (1~100)</label>
                            <input type="number" id="equity-score" min="1" max="100" value="85" style="padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: #fff; font-size: 13px; outline: none;">
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <label style="font-size: 12px; color: var(--text-muted);">공정성/번아웃 관련 한줄 코멘트</label>
                            <textarea id="equity-feedback" rows="3" placeholder="이번 주 업무량이 과도하여 번아웃 우려가 있거나 인정에 있어 피드백이 필요하면 작성하세요." style="padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: #fff; font-size: 13px; outline: none; resize: none;"></textarea>
                        </div>
                    </div>

                    <button class="btn-primary" id="btn-submit-equity" style="margin-top: 15px; width: 100%; justify-content: center; font-weight: bold;">공정성 펄스 제출하기</button>
                `;

                document.getElementById('btn-submit-equity')?.addEventListener('click', () => {
                    const score = document.getElementById('equity-score').value;
                    const feedback = document.getElementById('equity-feedback').value;

                    // 상태 업데이트
                    loopStates.equity.state = 'Completed';
                    loopStates.equity.badgeText = '제출 완료 (Completed)';
                    loopStates.equity.badgeClass = 'safe';
                    updateLoopBadges();

                    // 익명 제출 상태 반영된 메시지 토스트
                    const targetModeDesc = isAnonymous ? '익명' : '기명(김영은)';
                    showToast(`공정성 펄스가 ${targetModeDesc}으로 제출되었습니다. (점수: ${score})`);
                    modal.classList.remove('show');
                });
                break;

            case 'mirror':
                titleIcon = '<i class="fa-solid fa-binoculars" style="color: var(--danger);"></i>';
                titleText = 'Weekend AI Leadership Mirror';

                modalBody.innerHTML = `
                    <div class="db-widget glass-panel" style="border-left: 3px solid var(--gold-main); margin-bottom: 10px;">
                        <h4 style="color: var(--gold-main); font-size: 14px; margin: 0 0 8px 0;"><i class="fa-solid fa-robot"></i> AI 리더십 성과 브리핑</h4>
                        <p style="font-size: 13px; line-height: 1.5; color: var(--text-main); margin: 0;">
                            "이번 주 효율적인 작업 전술 및 자율 업무 수행을 통해 낭비가 예상되었던 시간 중 <strong>총 6시간</strong>을 성공적으로 절감하였습니다."
                        </p>
                    </div>

                    <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px;">
                        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">개인 사기/컨디션 분석 (Morale Trace)</div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <strong style="color: var(--success); font-size: 18px;">양호 (Morale 82%)</strong>
                            <span style="font-size: 12px; color: var(--text-muted);">업무 자율성 만족도 우수</span>
                        </div>
                    </div>

                    <div style="margin-top: 10px;">
                        <h4 style="font-size: 13px; color: var(--primary-neon); margin-bottom: 8px;"><i class="fa-solid fa-lightbulb"></i> 자율성 향상을 위한 액션 아이템</h4>
                        <ul style="font-size: 12px; color: var(--text-muted); padding-left: 15px; margin: 0; line-height: 1.6;">
                            <li>차주 월요일 Priority Sync 시, '업무 로드맵 검증' 세션 단축 건의 가능.</li>
                            <li>오주영 프로와 협업 마이크로 태스크 생성 시 포인트 보너스 +15% 획득 예상.</li>
                        </ul>
                    </div>

                    <div style="margin-top: 20px; display: flex; gap: 10px;">
                        <button class="btn-primary" id="btn-mirror-confirm" style="width: 100%; justify-content: center;">리포트 확인 완료</button>
                    </div>
                `;

                document.getElementById('btn-mirror-confirm')?.addEventListener('click', () => {
                    loopStates.mirror.state = 'Report Ready';
                    loopStates.mirror.badgeText = '리포트 완료 (Report Ready)';
                    loopStates.mirror.badgeClass = 'safe';
                    updateLoopBadges();
                    showToast("AI Leadership Mirror 리포트 분석이 마감되었습니다.");
                    modal.classList.remove('show');
                });
                break;
        }

        modalTitle.innerHTML = `${titleIcon} ${titleText}`;
        modal.classList.add('show');
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
        { id: 'close-training-center', modal: 'training-center-modal' },
        { id: 'close-loop-modal', modal: 'loop-ai-modal' },
        { id: 'close-add-task', modal: 'add-task-modal' }
    ];

    closeButtons.forEach(btn => {
        document.getElementById(btn.id)?.addEventListener('click', () => {
            const modalEl = document.getElementById(btn.modal);
            if(modalEl) modalEl.classList.remove('show');
        });
    });

    // --- Mode Toggle Functionality ---
    const modeBtns = document.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            modeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentMode = e.target.getAttribute('data-mode');

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
                else if (currentMode === 'personal') {
                    targetSection = personalDashboardSection;
                    // 개인 성장 대시보드 진입 시 성과 포인트 수치 최신화
                    updatePointsUI();
                    // 오늘 할 일 목록 및 주간 역량 루프 배지 렌더링 최신화
                    renderTasks();
                    updateLoopBadges();
                }

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

    /**
     * [신규] 트레이닝 모달 데이터를 로그인한 사용자의 정보로 동적 업데이트합니다.
     * 사용자가 초보자이므로 각 로직의 역할에 대해 한글 주석으로 상세 기술합니다.
     */
    function updateTrainingModalData() {
        // 로그인한 사용자가 없으면 기본적으로 'EMP04' 김건우 데이터를 백업용으로 활용합니다.
        const user = currentUser || players.find(p => p.id === 'EMP04');
        const trainingPcName = document.getElementById('training-pc-name');
        const currentGrwText = document.getElementById('current-grw');
        const nextGrwText = document.getElementById('next-grw');

        // 1. 모달 내부 프리뷰 카드의 이름을 '[사원번호] 이름' 형태로 동적 변경합니다.
        if (trainingPcName) {
            trainingPcName.textContent = `[${user.id}] ${user.name}`;
        }
        // 2. 현재 성장(GRW) 스탯을 해당 직원의 실제 수치로 변경합니다.
        if (currentGrwText) {
            currentGrwText.textContent = user.stats.grw;
        }
        // 3. 예상 성장(GRW) 스탯을 실제 성장 스탯 + 3 으로 설정하되, 최대 한계치인 100을 넘지 않도록 제한합니다.
        if (nextGrwText) {
            nextGrwText.textContent = Math.min(user.stats.grw + 3, 100);
            nextGrwText.style.color = "var(--primary-neon)";
            nextGrwText.style.textShadow = "";
        }
    }

    if (btnOpenTrainingUpload && trainingModal) {
        btnOpenTrainingUpload.addEventListener('click', (e) => {
            e.preventDefault();
            // [신규] 로그인한 유저 정보를 기준으로 트레이닝 프리뷰 카드를 실시간 갱신합니다.
            updateTrainingModalData();
            
            if(successMsg) successMsg.style.display = 'none';
            trainingModal.classList.add('show');
        });
    }

    // --- Legacy Training Modal Logic (자격증 제출 폼) ---
    const navTraining = document.getElementById('nav-training');

    if (navTraining && trainingModal) {
        navTraining.addEventListener('click', (e) => {
            e.preventDefault();
            // [신규] 로그인한 유저 정보를 기준으로 트레이닝 프리뷰 카드를 실시간 갱신합니다.
            updateTrainingModalData();
            
            if(successMsg) successMsg.style.display = 'none';
            trainingModal.classList.add('show');
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
            // [신규] 로그인 유저 기준으로 대상 지정 (없을 경우 EMP04 백업 활용)
            const user = currentUser || players.find(p => p.id === 'EMP04');
            const targetPlayer = players.find(p => p.id === user.id);
            
            // 기존 성장(GRW) 스탯을 기준으로 최종 상승치를 계산합니다. (기본 +6 상승하며 최대 100 제한)
            const currentGrw = targetPlayer ? targetPlayer.stats.grw : 92;
            const newGrw = Math.min(currentGrw + 6, 100);

            const btnIcon = btnSubmitTraining.querySelector('i');
            btnIcon.className = 'fa-solid fa-spinner fa-spin';
            btnSubmitTraining.disabled = true;
            btnSubmitTraining.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> AI가 자격증을 검증하고 있습니다...';
            
            setTimeout(() => {
                // 검증 완료 애니메이션
                btnSubmitTraining.innerHTML = '<i class="fa-solid fa-check"></i> 검증 완료';
                btnSubmitTraining.style.background = 'var(--success)';
                btnSubmitTraining.style.color = '#000';
                
                // 스탯 상승 애니메이션 (로그인 유저 기준의 수치로 바인딩)
                nextGrwText.textContent = newGrw;
                nextGrwText.style.color = "var(--gold-main)";
                nextGrwText.style.textShadow = "0 0 15px var(--gold-main)";
                
                // 성공 메시지 출력
                successMsg.style.display = 'block';
                
                // [신규] 로그인 유저의 실제 데이터 연동 및 스탯 계산
                if(targetPlayer) {
                    targetPlayer.stats.grw = newGrw;
                    targetPlayer.overall = Math.round((targetPlayer.stats.prf + targetPlayer.stats.cop + targetPlayer.stats.grw) / 3);
                    renderCards(); // 백그라운드 및 대시보드 카드 실시간 다시 그리기
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
    }    // --- Project Creation & AI Matchmaking Logic (프로젝트 생성 및 AI 매치메이킹) ---
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
    // --- Talent Map Modal Logic (인재 맵 모달 로직) ---
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
    // --- [신규] 개인 성장 대시보드 내 서브 탭 시스템 초기화 함수 ---
    // ==========================================
    function initPersonalTabs() {
        const tabButtons = document.querySelectorAll('.personal-tab-btn');
        const tabViews = document.querySelectorAll('.personal-tab-view');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                // 1. 모든 탭 버튼 활성화 해제 및 현재 클릭한 버튼 활성화
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // 2. 모든 탭 뷰 숨김 처리 후 선택된 탭 뷰만 활성화
                tabViews.forEach(view => {
                    view.classList.remove('active');
                    // CSS transition과 display 충돌을 피하기 위해 display 처리 진행
                    view.style.display = 'none';
                });

                const activeView = document.getElementById(`personal-tab-${targetTab}`);
                if (activeView) {
                    activeView.style.display = 'block';
                    // 리플로우 강제 유도 후 active 클래스를 넣어 페이드인 애니메이션 유도
                    void activeView.offsetWidth;
                    activeView.classList.add('active');
                }
            });
        });
    }

    // ==========================================
    // 사용자의 성과 포인트 전역 상태 변수 (기본값: 1,500 pt)
    // ==========================================
    let userPoints = 1500;

    // GNB 보상 버튼, 모달 창, 모달 닫기 버튼 엘리먼트 가져오기
    const btnReward = document.getElementById('gnb-reward');
    const rewardModal = document.getElementById('reward-modal');
    const closeRewardBtn = document.getElementById('close-reward');

    /**
     * 성과 포인트를 화면 UI에 반영하는 함수입니다.
     * 모달창 내 포인트, 개인 대시보드 메인 위젯 포인트, 그리고 신규 보상 탭의 포인트를 모두 실시간 동기화합니다.
     */
    function updatePointsUI() {
        // 1. 보상 상점 모달창 내 포인트 갱신
        const currentPointsElement = document.getElementById('current-points');
        if (currentPointsElement) {
            currentPointsElement.textContent = userPoints.toLocaleString();
        }
        // 2. 개인 성장 대시보드 위젯 내 포인트 갱신
        const personalPointsElement = document.getElementById('personal-points');
        if (personalPointsElement) {
            personalPointsElement.textContent = userPoints.toLocaleString();
        }
        // 3. ⭐️ [신규] 개인 성장 대시보드 내 보상 탭의 포인트 갱신
        const personalTabPointsElement = document.getElementById('personal-tab-points');
        if (personalTabPointsElement) {
            personalTabPointsElement.textContent = userPoints.toLocaleString();
        }
    }

    /**
     * 보상을 성공적으로 교환했을 때 하단 교환 내역 및 개인 성장 대시보드 내역에 동적으로 기록을 추가하는 함수입니다.
     * @param {string} itemName - 교환한 상품의 명칭
     * @param {number} cost - 차감된 포인트 수치
     */
    function addRewardHistory(itemName, cost) {
        const historyList = document.getElementById('reward-history-list');
        const personalHistoryList = document.getElementById('personal-reward-history-list');
        const personalTabHistoryList = document.getElementById('personal-tab-reward-history-list');
        
        // 현재 시각 가져오기 (시:분:초 형식)
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        // 공통 리스트 아이템 HTML 생성 헬퍼 함수
        function createHistoryLi() {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="history-item-name">${itemName}</span>
                <div>
                    <span class="history-item-cost">-${cost.toLocaleString()} pt</span>
                    <span class="history-item-time" style="margin-left: 10px; color: var(--text-muted);">(${timeString})</span>
                </div>
            `;
            return li;
        }

        // 1. 보상 상점 모달 히스토리 갱신
        if (historyList) {
            const emptyItem = historyList.querySelector('.history-empty');
            if (emptyItem) emptyItem.remove();

            const li = createHistoryLi();
            historyList.insertBefore(li, historyList.firstChild);

            while (historyList.children.length > 5) {
                historyList.removeChild(historyList.lastChild);
            }
        }

        // 2. 개인 대시보드 보상 내역 위젯 갱신
        if (personalHistoryList) {
            const emptyItem = personalHistoryList.querySelector('.history-empty');
            if (emptyItem) emptyItem.remove();

            const li = createHistoryLi();
            personalHistoryList.insertBefore(li, personalHistoryList.firstChild);

            while (personalHistoryList.children.length > 5) {
                personalHistoryList.removeChild(personalHistoryList.lastChild);
            }
        }

        // 3. ⭐️ [신규] 개인 성장 대시보드 내부 보상 탭 전체 히스토리 갱신
        if (personalTabHistoryList) {
            const emptyItem = personalTabHistoryList.querySelector('.history-empty');
            if (emptyItem) emptyItem.remove();

            const li = createHistoryLi();
            personalTabHistoryList.insertBefore(li, personalTabHistoryList.firstChild);

            // 전체 히스토리 탭은 스크롤 가능하므로 이력을 조금 더 많이(예: 15개) 유지하도록 설정합니다.
            while (personalTabHistoryList.children.length > 15) {
                personalTabHistoryList.removeChild(personalTabHistoryList.lastChild);
            }
        }
    }

    /**
     * 사용자가 교환 버튼을 클릭했을 때 실시간 포인트를 검증하고 차감하는 이벤트 리스너를 연동합니다.
     */
    function setupRewardExchangeEvents() {
        const exchangeButtons = document.querySelectorAll('.exchange-btn');
        exchangeButtons.forEach(button => {
            // 중복 리스너 방지를 위해 기존 이벤트 리스너를 클론하여 초기화
            button.replaceWith(button.cloneNode(true));
        });

        // 클론 이후 새로 바인딩 진행
        const freshExchangeButtons = document.querySelectorAll('.exchange-btn');
        freshExchangeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemName = button.getAttribute('data-name');
                const cost = parseInt(button.getAttribute('data-cost'), 10);

                if (isNaN(cost)) return;

                // 포인트 검증: 보유 포인트가 비용보다 많거나 같은지 확인
                if (userPoints >= cost) {
                    // 포인트 차감 및 UI 갱신
                    userPoints -= cost;
                    updatePointsUI();

                    // 교환 완료 내역에 기록 추가
                    addRewardHistory(itemName, cost);

                    // 성공 메시지 안내
                    alert(`🎉 [교환 완료] ${itemName} 교환이 정상적으로 신청되었습니다.\n(차감 포인트: ${cost.toLocaleString()} pt | 남은 포인트: ${userPoints.toLocaleString()} pt)`);
                } else {
                    // 포인트 부족 경고 안내
                    alert(`⚠️ [포인트 부족] 포인트를 더 획득한 후 교환해 주세요.\n(필요 포인트: ${cost.toLocaleString()} pt | 보유 포인트: ${userPoints.toLocaleString()} pt)`);
                }
            });
        });
    }

    // ⭐️ GNB 헤더의 보상 버튼 클릭 시 모달 대신 개인 모드 보상 탭으로 라우팅
    if (btnReward) {
        btnReward.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. 개인 모드로 전환하기 위해 개인 모드 버튼 찾기
            const personalModeBtn = document.querySelector('.mode-btn[data-mode="personal"]');
            if (personalModeBtn) {
                // 개인 모드 탭 버튼 클릭 트리거
                personalModeBtn.click();
            }
            
            // 2. 개인 모드 내부 탭 중 '보상 상점 & 내역' 탭(rewards) 활성화
            setTimeout(() => {
                const rewardTabBtn = document.querySelector('.personal-tab-btn[data-tab="rewards"]');
                if (rewardTabBtn) {
                    rewardTabBtn.click();
                }
                // 포인트 및 UI 실시간 동기화
                updatePointsUI();
            }, 350); // 화면 전환 트랜지션 완료 후 탭 선택
        });
    }

    // 모달 우측 상단 X 닫기 버튼 클릭 시 모달 닫기 이벤트 등록 (혹시 모를 예외 대비 유지)
    if (closeRewardBtn && rewardModal) {
        closeRewardBtn.addEventListener('click', () => {
            rewardModal.classList.remove('show');
        });
    }

    // 문서 로드 시 개인 모드 서브 탭 초기화 및 보상 시스템 이벤트 초기화 실행
    initPersonalTabs();
    setupRewardExchangeEvents();

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
    // --- [Phase 6 & 7] 이벤트 바인딩 등록 ---
    // ==========================================

    // 1. 주간 역량 루프 액션 버튼 클릭 이벤트 바인딩
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-loop-action');
        if (btn) {
            const loopType = btn.getAttribute('data-loop');
            if (loopType) {
                openLoopAIModal(loopType);
            }
        }
    });

    // 2. 오늘 할 일 추가 버튼 클릭 이벤트 바인딩 (모달 열기)
    const btnAddTask = document.getElementById('btn-add-task');
    const addTaskModal = document.getElementById('add-task-modal');
    if (btnAddTask && addTaskModal) {
        btnAddTask.addEventListener('click', () => {
            addTaskModal.classList.add('show');
        });
    }

    // 3. 오늘 할 일 추가 폼 제출(Submit) 이벤트 바인딩
    const addTaskForm = document.getElementById('add-task-form');
    if (addTaskForm && addTaskModal) {
        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('task-name').value;
            const priority = document.getElementById('task-priority').value;
            const estTime = document.getElementById('task-est-time').value;
            const deadline = document.getElementById('task-deadline').value;
            const project = document.getElementById('task-project').value;
            const collaborators = document.getElementById('task-collaborators').value;
            const notes = document.getElementById('task-notes').value;

            // 새 태스크 생성
            const newTask = {
                id: `task-${Date.now()}`,
                name: name,
                priority: priority,
                estTime: estTime || "",
                deadline: deadline || "",
                project: project || "기타 업무",
                collaborators: collaborators || "",
                notes: notes || "",
                completed: false,
                completedAt: null
            };

            // userTasks 배열에 추가
            userTasks.push(newTask);

            // 오늘 할 일 리스트 다시 그리기
            renderTasks();

            // 폼 초기화
            addTaskForm.reset();

            // 모달창 닫기
            addTaskModal.classList.remove('show');

            // 성공 토스트 알림 출력
            showToast(`새로운 할 일 "${name}"이 추가되었습니다.`);

            // Context Tracker 상태 변경 시뮬레이션 (할 일 추가 시 진행 중으로 복구)
            if (loopStates.context.state !== 'In Progress') {
                loopStates.context.state = 'In Progress';
                loopStates.context.badgeText = '진행 중 (In Progress)';
                loopStates.context.badgeClass = 'info';
                updateLoopBadges();
            }
        });
    }

    // Initial render
    renderCards();

    // ============================================
    // === Scouting Board (Squad Builder) Logic ===
    // ============================================

    // 스카우팅 보드 전용 상태
    let squadSlots = [null, null, null, null]; // 4개 슬롯 (null = 비어있음)

    // ── 사이드바 nav 전환 이벤트 (대시보드, 스카우팅 보드 등) ──
    // 모든 섹션을 숨기고 특정 섹션만 보여주는 공통 함수
    function showSection(targetId, activeModeBtn) {
        // [권한 제어] 일반 직원이 임의의 방법으로 스카우팅 보드 섹션 진입을 시도할 경우 원천 차단
        if (targetId === 'scouting-board-section') {
            if (currentUser && currentUser.id !== 'EMP01' && currentUser.id !== 'EMP06') {
                alert("⚠️ 스카우팅 보드 접근 권한이 없습니다. (관리자 및 HR담당자 전용)");
                targetId = 'personal-dashboard-section'; // 개인 성장 대시보드로 강제 전환
                const navDashboard = document.querySelector('.nav-menu .nav-item:first-child');
                if (navDashboard) {
                    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                    navDashboard.classList.add('active');
                }
            }
        }

        // 모든 dashboard-section 숨기기
        document.querySelectorAll('.dashboard-section').forEach(s => {
            s.style.opacity = 0;
            setTimeout(() => { s.style.display = 'none'; }, 200);
        });
        // nav-item 활성화 갱신
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        setTimeout(() => {
            const target = document.getElementById(targetId);
            if (target) {
                target.style.display = 'block';
                void target.offsetWidth;
                target.style.opacity = 1;
                target.style.transition = 'opacity 0.3s ease';
            }
        }, 220);
    }

    // 사이드바 '대시보드' 클릭 → 현재 mode에 해당하는 섹션으로 복귀
    const navDashboard = document.querySelector('.nav-menu .nav-item:first-child');
    if (navDashboard) {
        navDashboard.addEventListener('click', (e) => {
            e.preventDefault();
            // currentMode 기준으로 해당 섹션 표시
            const modeToSection = {
                admin: 'admin-dashboard-section',
                hr: 'hr-dashboard-section',
                team: 'team-dashboard-section',
                personal: 'personal-dashboard-section'
            };
            const targetId = modeToSection[currentMode] || 'team-dashboard-section';
            showSection(targetId);
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            navDashboard.classList.add('active');
            // 카드 재렌더링
            setTimeout(() => renderCards(), 250);
        });
    }

    // 사이드바 '스카우팅 보드' 클릭
    const navScouting = document.getElementById('nav-scouting');
    if (navScouting) {
        navScouting.addEventListener('click', (e) => {
            e.preventDefault();
            // [권한 제어] 일반 직원은 스카우팅 보드 접근 차단
            if (currentUser && currentUser.id !== 'EMP01' && currentUser.id !== 'EMP06') {
                alert("⚠️ 스카우팅 보드 접근 권한이 없습니다. (관리자 및 HR담당자만 접근 가능)");
                return;
            }
            showSection('scouting-board-section');
            navScouting.classList.add('active');
            setTimeout(() => initScoutingBoard(), 250);
        });
    }

    // 대기 명단 렌더링
    function renderApplicantList() {
        const list = document.getElementById('applicant-list');
        if (!list) return;
        list.innerHTML = '';

        players.forEach(player => {
            // 이미 슬롯에 배치됐으면 inSquad 처리
            const inSquad = squadSlots.includes(player.id);
            const li = document.createElement('li');
            li.className = `applicant-item ${inSquad ? 'in-squad' : ''}`;
            li.dataset.id = player.id;
            li.innerHTML = `
                <img class="applicant-avatar" src="${player.imgUrl}" alt="${player.name}">
                <div class="applicant-info">
                    <div class="applicant-name">${player.name}</div>
                    <div class="applicant-role">${player.role} · ${player.dept}</div>
                </div>
                <div class="applicant-ovr">${player.overall}</div>
            `;
            if (!inSquad) {
                li.addEventListener('click', () => addToSquad(player.id));
            }
            list.appendChild(li);
        });
    }

    // 피치 슬롯 렌더링
    function renderPitchSlots() {
        const slots = document.querySelectorAll('.pitch-slot');
        slots.forEach((slotEl, idx) => {
            const playerId = squadSlots[idx];
            const roleName = slotEl.dataset.role;
            const slotInfo = slotEl.querySelector('.slot-player-info');
            const slotRole = slotEl.querySelector('.slot-role');

            if (playerId) {
                // 배치된 선수가 있는 경우
                const p = players.find(x => x.id === playerId);
                slotEl.classList.add('filled');
                slotRole.textContent = roleName;
                slotInfo.innerHTML = `
                    <img class="slot-player-img" src="${p.imgUrl}" alt="${p.name}">
                    <div class="slot-player-name">${p.name}</div>
                    <div class="slot-player-ovr">OVR ${p.overall}</div>
                    <div class="slot-remove-hint">클릭하여 제거</div>
                `;
                // 클릭 시 제거
                slotEl.onclick = () => removeFromSquad(idx);
            } else {
                // 빈 슬롯
                slotEl.classList.remove('filled');
                slotRole.textContent = roleName;
                slotInfo.innerHTML = `<div class="slot-empty-label">+ 배치</div>`;
                slotEl.onclick = null;
            }
        });

        // 배치 인원 수 업데이트
        const filledCount = squadSlots.filter(s => s !== null).length;
        const countEl = document.getElementById('squad-filled-count');
        if (countEl) countEl.textContent = filledCount;
    }

    // 선수를 스쿼드에 추가
    function addToSquad(playerId) {
        // 이미 배치된 경우 방지
        if (squadSlots.includes(playerId)) return;
        // 빈 슬롯 찾기
        const emptyIdx = squadSlots.indexOf(null);
        if (emptyIdx === -1) {
            showScoutToast('스쿼드가 가득 찼습니다! (최대 4명)');
            return;
        }
        squadSlots[emptyIdx] = playerId;
        renderApplicantList();
        renderPitchSlots();
        updateChemistry();
    }

    // 선수를 스쿼드에서 제거
    function removeFromSquad(slotIdx) {
        squadSlots[slotIdx] = null;
        renderApplicantList();
        renderPitchSlots();
        updateChemistry();
    }

    // AI 케미스트리 계산 및 UI 업데이트
    function updateChemistry() {
        const chemResults = document.getElementById('chemistry-results');
        const chemBadge = document.getElementById('chemistry-score-badge');
        if (!chemResults) return;

        const filledIds = squadSlots.filter(s => s !== null);
        if (filledIds.length === 0) {
            chemResults.innerHTML = `<p class="chem-placeholder"><i class="fa-solid fa-arrow-up"></i> 인재를 슬롯에 배치하면 시너지를 분석합니다.</p>`;
            if (chemBadge) { chemBadge.textContent = '케미스트리 대기 중'; chemBadge.style.color = 'var(--text-muted)'; }
            return;
        }

        const filledPlayers = filledIds.map(id => players.find(p => p.id === id));

        // ── 1) Overall 전력 (배치된 인원 OVR 평균) ──
        const avgOvr = Math.round(filledPlayers.reduce((sum, p) => sum + p.overall, 0) / filledPlayers.length);

        // ── 2) 협업 시너지 (COP 스탯 평균, 없으면 stats.cop 사용) ──
        const avgCop = Math.round(filledPlayers.reduce((sum, p) => sum + (p.stats.cop || 80), 0) / filledPlayers.length);

        // ── 3) 다양성 보너스 (부서가 다를수록 +점수) ──
        const depts = new Set(filledPlayers.map(p => p.dept));
        const diversityScore = Math.min(100, 60 + (depts.size - 1) * 15); // 부서 수에 따라 보너스

        // ── 4) 리스크 패널티 (Transfer List 인원이 있으면 감점) ──
        const riskCount = filledPlayers.filter(p => p.status === 'Transfer List').length;
        const riskPenalty = riskCount * 10;

        // ── 5) 최종 케미스트리 점수 ──
        const rawTotal = Math.round((avgOvr * 0.4 + avgCop * 0.3 + diversityScore * 0.3) - riskPenalty);
        const totalScore = Math.max(0, Math.min(100, rawTotal));

        // ── 색상 결정 ──
        const getBarClass = (val) => val >= 75 ? 'high' : val >= 50 ? 'mid' : 'low';
        const getTotalColor = (val) => val >= 75 ? 'var(--success)' : val >= 50 ? '#ffaa00' : 'var(--danger)';

        // ── AI 코멘트 생성 ──
        let aiComment = '';
        if (totalScore >= 85) {
            aiComment = '🔥 <strong>최강 팀 구성!</strong> 역량과 협업력이 탁월합니다. 이 팀이라면 프로젝트 성공률이 매우 높습니다.';
        } else if (totalScore >= 70) {
            aiComment = '✅ <strong>균형 잡힌 팀</strong>입니다. 역량 다양성이 우수하며 안정적인 프로젝트 수행이 가능합니다.';
        } else if (totalScore >= 50) {
            aiComment = '⚠️ <strong>보완이 필요합니다.</strong> 특정 역량이 집중되어 있거나 협업 경험이 부족합니다. 다른 부서 인재를 추가하세요.';
        } else {
            aiComment = '🚨 <strong>팀 구성 위험!</strong> 성과 리스크가 높습니다. 집중 관리 대상 인원을 재검토해 주세요.';
        }

        // ── UI 렌더링 ──
        chemResults.innerHTML = `
            <div class="chem-score-row">
                <span class="chem-label">팀 전력 (OVR)</span>
                <div class="chem-bar-bg"><div class="chem-bar-fill ${getBarClass(avgOvr)}" style="width:${avgOvr}%;"></div></div>
                <span class="chem-value" style="color:${getTotalColor(avgOvr)};">${avgOvr}</span>
            </div>
            <div class="chem-score-row">
                <span class="chem-label">협업 시너지</span>
                <div class="chem-bar-bg"><div class="chem-bar-fill ${getBarClass(avgCop)}" style="width:${avgCop}%;"></div></div>
                <span class="chem-value" style="color:${getTotalColor(avgCop)};">${avgCop}</span>
            </div>
            <div class="chem-score-row">
                <span class="chem-label">역량 다양성</span>
                <div class="chem-bar-bg"><div class="chem-bar-fill ${getBarClass(diversityScore)}" style="width:${diversityScore}%;"></div></div>
                <span class="chem-value" style="color:${getTotalColor(diversityScore)};">${diversityScore}</span>
            </div>
            ${riskPenalty > 0 ? `
            <div class="chem-score-row">
                <span class="chem-label" style="color:var(--danger);">리스크 패널티</span>
                <div class="chem-bar-bg"><div class="chem-bar-fill low" style="width:${riskPenalty * 5}%;"></div></div>
                <span class="chem-value" style="color:var(--danger);">-${riskPenalty}</span>
            </div>` : ''}
            <div class="chem-total-box">
                <span class="chem-total-label">🤖 AI 케미스트리 총점</span>
                <span class="chem-total-score" style="color:${getTotalColor(totalScore)};">${totalScore}<span style="font-size:16px;">/100</span></span>
            </div>
            <div class="chem-ai-comment">${aiComment}</div>
        `;

        // 배지 업데이트
        if (chemBadge) {
            chemBadge.innerHTML = `<i class="fa-solid fa-atom"></i> 케미스트리 ${totalScore}점`;
            chemBadge.style.color = getTotalColor(totalScore);
        }
    }

    // 스카우팅 전용 토스트
    function showScoutToast(msg) {
        const existing = document.querySelector('.scout-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'scout-toast';
        toast.style.cssText = 'position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:var(--danger); color:#fff; padding:12px 24px; border-radius:20px; font-weight:bold; z-index:99999; font-size:13px; box-shadow:0 4px 20px rgba(255,51,102,0.4);';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    // 스카우팅 보드 초기화
    function initScoutingBoard() {
        squadSlots = [null, null, null, null]; // 슬롯 초기화
        renderApplicantList();
        renderPitchSlots();
        updateChemistry();
    }

    // ==========================================
    // --- [신규] 로컬 다중 역할 로그인 & 접근 제어 시스템 ---
    // ==========================================
    const loginOverlay = document.getElementById('login-overlay');
    const loginForm = document.getElementById('login-form');
    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');
    const btnLogout = document.getElementById('btn-logout');

    const sidebarAvatar = document.getElementById('sidebar-user-avatar');
    const sidebarName = document.getElementById('sidebar-user-name');
    const sidebarRole = document.getElementById('sidebar-user-role');

    /**
     * 사용자가 이름과 비밀번호를 올바르게 입력했을 때,
     * 해당 사용자의 정보를 세션에 저장하고 역할에 부합하는 화면으로 안내합니다.
     * @param {Object} user - 로그인에 성공한 사용자 객체
     */
    function loginUser(user) {
        currentUser = user;

        // 1. 좌측 사이드바 유저 프로필 위젯 실시간 동적 매핑
        if (sidebarName) sidebarName.textContent = user.name;
        if (sidebarRole) sidebarRole.textContent = user.role;
        if (sidebarAvatar) {
            // 아바타 원형 위젯에 표시될 이니셜 문자열 바인딩
            sidebarAvatar.textContent = user.name.slice(0, 3);
        }

        // ⭐️ [신규] 일반 직원 스카우팅 보드 메뉴 및 GNB 관련 버튼(프로젝트 생성, 인재맵) 권한 통제
        const navScouting = document.getElementById('nav-scouting');
        const btnCreateProj = document.getElementById('btn-create-project');
        const btnTalentMap = document.getElementById('gnb-talent-map');

        if (user.id === 'EMP01' || user.id === 'EMP06') {
            // 김영은(관리자/팀장) 및 황한솔(HR담당자)은 스카우팅 보드, 프로젝트 생성, 인재맵 접근 허용
            if (navScouting) navScouting.style.display = '';
            if (btnCreateProj) btnCreateProj.style.display = '';
            if (btnTalentMap) btnTalentMap.style.display = '';
        } else {
            // 일반 직원은 스카우팅 권한이 없으므로 사이드바 스카우팅 보드 및 GNB 프로젝트 생성, 인재맵 버튼 완벽 숨김
            if (navScouting) navScouting.style.display = 'none';
            if (btnCreateProj) btnCreateProj.style.display = 'none';
            if (btnTalentMap) btnTalentMap.style.display = 'none';
        }

        // 2. 역할별 접근 허용 모드 리스트 및 최초 디폴트 진입 모드 지정 (RBAC)
        const modeButtons = document.querySelectorAll('.mode-btn');
        let allowedModes = [];
        let defaultMode = 'personal';

        if (user.id === 'EMP01') {
            // [관리자 & 팀장] 김영은: 관리자, 팀장, 개인 모드 모두 허용 (최초 관리자 진입)
            allowedModes = ['admin', 'team', 'personal'];
            defaultMode = 'admin';
        } else if (user.id === 'EMP06') {
            // [HR담당자] 황한솔: HR, 개인 모드 허용 (최초 HR 진입)
            allowedModes = ['hr', 'personal'];
            defaultMode = 'hr';
        } else {
            // [개인 직원] 오주영, 이명철, 김건우, 이정무: 개인 모드만 허용
            allowedModes = ['personal'];
            defaultMode = 'personal';
        }

        // 3. 모드 스위처 버튼 상태 동적 제어
        modeButtons.forEach(btn => {
            const mode = btn.getAttribute('data-mode');
            if (allowedModes.includes(mode)) {
                // 권한이 있는 모드는 노출 및 활성화
                btn.classList.remove('disabled');
                btn.removeAttribute('disabled');
                btn.style.display = 'inline-flex';
            } else {
                // 권한이 없는 모드는 완벽 숨김 및 클릭 방어막 설정
                btn.classList.add('disabled');
                btn.setAttribute('disabled', 'true');
                btn.style.display = 'none';
            }
        });

        // 4. 최초 지정된 디폴트 진입 모드로 자동 스위칭 유도
        const targetBtn = document.querySelector(`.mode-btn[data-mode="${defaultMode}"]`);
        if (targetBtn) {
            targetBtn.click();
        }

        // 5. 로그인 성공 시 오버레이 화면을 서서히 페이드아웃 처리
        if (loginOverlay) {
            loginOverlay.classList.add('fade-out');
            setTimeout(() => {
                loginOverlay.style.display = 'none';
            }, 500);
        }
    }

    /**
     * 현재 로그인 세션을 안전하게 종료하고,
     * 화면 접근 권한을 리셋하여 로그인 오버레이 화면으로 복귀시킵니다.
     */
    function logoutUser() {
        currentUser = null;

        // 1. 로그인 폼 원복 및 입력 데이터 클리어
        if (loginOverlay) {
            loginOverlay.style.display = 'flex';
            void loginOverlay.offsetWidth; // 리플로우 강제 유도
            loginOverlay.classList.remove('fade-out');
        }

        if (loginUsernameInput) loginUsernameInput.value = '';
        if (loginPasswordInput) loginPasswordInput.value = '';

        // 2. 사이드바 프로필 기본 게스트 상태로 리셋
        if (sidebarName) sidebarName.textContent = '로그인 전';
        if (sidebarRole) sidebarRole.textContent = 'Guest';
        if (sidebarAvatar) sidebarAvatar.textContent = 'G';

        // 3. 모든 모드 버튼들의 제한 해제 및 초기화
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.classList.remove('disabled');
            btn.removeAttribute('disabled');
            btn.style.display = 'inline-flex';
        });

        // 4. 스카우팅 보드 메뉴 및 GNB 관련 버튼(프로젝트 생성, 인재맵) 가시성 리셋
        const navScouting = document.getElementById('nav-scouting');
        if (navScouting) navScouting.style.display = '';

        const btnCreateProj = document.getElementById('btn-create-project');
        const btnTalentMap = document.getElementById('gnb-talent-map');
        if (btnCreateProj) btnCreateProj.style.display = '';
        if (btnTalentMap) btnTalentMap.style.display = '';
    }

    // 4. 로그인 및 로그아웃 이벤트 리스너 바인딩
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = loginUsernameInput.value.trim();
            const password = loginPasswordInput.value.trim();

            if (!username) {
                alert("⚠️ 로그인할 사용자의 이름을 입력해 주세요.");
                return;
            }

            // 5명 기존 직원 + 1명 신규 황한솔이 합쳐진 전체 리스트에서 찾기
            const matchedUser = players.find(p => p.name === username);

            if (!matchedUser) {
                alert(`⚠️ [미등록 사용자] '${username}'님은 등록되지 않은 직원입니다.\n(화면 하단의 직원 이름 힌트 배지를 클릭하면 쉽게 입력됩니다!)`);
                return;
            }

            if (password !== '1234') {
                alert("⚠️ [비밀번호 오류] 입력하신 비밀번호가 올바르지 않습니다. (초기 패스워드: 1234)");
                return;
            }

            // 모든 검증 통과 시 로그인 수행
            loginUser(matchedUser);
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("정말로 로그아웃 하시겠습니까?")) {
                logoutUser();
            }
        });
    }

    // 웹페이지 첫 로드 시 기본 로그아웃 상태(로그인 요구 화면)로 시작하도록 설정
    logoutUser();

});
