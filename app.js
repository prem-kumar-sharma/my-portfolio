/* ═══════════════════════════════════════════════
   SPLASH SCREEN — Terminal boot sequence
   ═══════════════════════════════════════════════ */
window.addEventListener('load', function () {
    var pct = 0;
    var pctEl = document.getElementById('loading-percentage');
    var fill  = document.getElementById('progress-fill');

    function tick() {
        if (pctEl) pctEl.textContent = pct + '%';
        if (fill)  fill.style.width  = pct + '%';
        pct++;
        if (pct <= 100) {
            setTimeout(tick, 12);
        } else {
            if (fill) fill.style.width = '100%';
            var splash = document.getElementById('splash-screen');
            var app    = document.getElementById('app');
            setTimeout(function () {
                if (splash) {
                    splash.style.opacity = '0';
                    splash.style.transition = 'opacity 0.5s ease';
                    setTimeout(function () {
                        splash.style.display = 'none';
                        if (app) app.style.display = 'block';
                        initTypewriter();
                        initScrollReveal();
                        initCounters();
                    }, 500);
                }
            }, 200);
        }
    }
    tick();
});

/* ═══════════════════════════════════════════════
   CANVAS PARTICLE BACKGROUND
   ═══════════════════════════════════════════════ */
(function initDots() {
    var canvas = document.getElementById('dots-bg');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var DPR = window.devicePixelRatio || 1;
    var width, height;

    function resize() {
        width  = window.innerWidth;
        height = window.innerHeight;
        canvas.width  = width  * DPR;
        canvas.height = height * DPR;
        canvas.style.width  = width  + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var COUNT = Math.max(25, Math.floor((width * height) / 100000));
    var COLORS = ['rgba(0,245,212,0.8)', 'rgba(0,245,212,0.5)', 'rgba(0,180,216,0.4)'];
    var particles = [];

    function rand(a, b) { return Math.random() * (b - a) + a; }

    for (var i = 0; i < COUNT; i++) {
        particles.push({
            x: rand(0, width), y: rand(0, height),
            vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25),
            r: rand(1.2, 2.8),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            life: rand(60, 300)
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;
            p.life--;
            if (p.life <= 0) {
                p.r = rand(1.2, 2.8);
                p.vx = rand(-0.25, 0.25);
                p.vy = rand(-0.25, 0.25);
                p.life = rand(60, 300);
            }
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }
        // Faint connection lines
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var d  = Math.sqrt(dx * dx + dy * dy);
                if (d < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(0,245,212,' + (0.006 * (100 - d)).toFixed(3) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
})();

/* ═══════════════════════════════════════════════
   TYPEWRITER EFFECT
   ═══════════════════════════════════════════════ */
function initTypewriter() {
    var el = document.getElementById('typewriter-el');
    if (!el) return;
    var roles = [
        'Research Associate @ IIT Bombay',
        'Generative AI Engineer',
        'AI Product Consultant',
        'Content Creator',
        'IIT Madras BS \'25'
    ];
    var roleIdx = 0, charIdx = 0, deleting = false;

    function type() {
        var current = roles[roleIdx];
        if (!deleting) {
            el.textContent = current.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(type, 1800);
                return;
            }
            setTimeout(type, 60);
        } else {
            el.textContent = current.slice(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                setTimeout(type, 400);
                return;
            }
            setTimeout(type, 35);
        }
    }
    setTimeout(type, 300);
}

/* ═══════════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
   ═══════════════════════════════════════════════ */
function initScrollReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    // Stagger children within same parent
    var groups = {};
    els.forEach(function (el) {
        var key = el.parentElement ? el.parentElement.dataset.revealGroup || 'default' : 'default';
        if (!groups[key]) groups[key] = [];
        groups[key].push(el);
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el, i) {
        // Slight stagger for sibling elements
        var siblings = el.parentElement ? el.parentElement.querySelectorAll('.reveal') : [];
        var sibIdx = Array.from(siblings).indexOf(el);
        el.style.transitionDelay = (sibIdx * 80) + 'ms';
        observer.observe(el);
    });
}

/* ═══════════════════════════════════════════════
   ANIMATED COUNTERS
   ═══════════════════════════════════════════════ */
function initCounters() {
    var els = document.querySelectorAll('.stat-val[data-count]');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el     = entry.target;
            var target = parseInt(el.getAttribute('data-count'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            var start  = 0;
            var dur    = 1600;
            var step   = 16;
            var increment = target / (dur / step);

            var timer = setInterval(function () {
                start += increment;
                if (start >= target) {
                    el.textContent = target.toLocaleString() + suffix;
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(start).toLocaleString() + suffix;
                }
            }, step);

            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    els.forEach(function (el) { observer.observe(el); });
}

/* ═══════════════════════════════════════════════
   TERMINAL EASTER EGG
   ═══════════════════════════════════════════════ */
(function initTerminal() {
    var btn   = document.getElementById('term-btn');
    var panel = document.getElementById('term-panel');
    var out   = document.getElementById('term-out');
    var inp   = document.getElementById('term-in');
    var close = document.getElementById('term-close');
    if (!btn || !panel) return;

    btn.addEventListener('click', function () {
        panel.classList.toggle('open');
        if (panel.classList.contains('open') && inp) inp.focus();
    });
    if (close) close.addEventListener('click', function () { panel.classList.remove('open'); });

    var commands = {
        help: function () {
            return [
                '  <span class="tline-acc">Available commands:</span>',
                '  whoami           : who is prem?',
                '  skills           : view tech stack',
                '  experience       : recent roles',
                '  contact          : get in touch',
                '  research         : current research',
                '  clear            : clear terminal'
            ];
        },
        whoami: function () {
            return [
                '  <span class="tline-acc">Prem Kumar Sharma</span>',
                '  Research Associate @ IIT Bombay',
                '  IIT Madras BS \'25 · Minor: Economics & Finance',
                '  Generative AI Engineer · AI Product Consultant',
                '  Content Creator @ YouTube (@insightbyprem)',
                '  Based in Mumbai, India'
            ];
        },
        skills: function () {
            return [
                '  <span class="tline-acc">Top skills:</span>',
                '  Languages   →  Python, SQL, JavaScript, Java',
                '  GenAI       →  GPT-4/5, LLaMA, BERT, RAG, Fine-Tuning',
                '  Agentic AI  →  CrewAI, LangChain, MCP, Claude Code',
                '  ML/Research →  Scikit-learn, XGBoost, Wavelets, CV, NLP',
                '  Infra       →  Docker, PostgreSQL, Redis, AWS, GCP'
            ];
        },
        experience: function () {
            return [
                '  <span class="tline-acc">Recent experience:</span>',
                '  2025–Now    Research Associate @ IIT Bombay (ANRF-PAIR)',
                '  2025–Now    AI Strategy Consultant @ Thundergits',
                '  2024–2025   Generative AI Engineer @ LOQO AI',
                '  2024–2025   Educator at Programming Classes',
                '  2024        Software Developer Intern @ 7 Miles/sec'
            ];
        },
        contact: function () {
            return [
                '  <span class="tline-acc">Get in touch:</span>',
                '  Email    →  premksharma@alumni.iitm.ac.in',
                '  Phone    →  +91 7488680644',
                '  LinkedIn →  linkedin.com/in/prem-kumar-sharma-a499b1201',
                '  GitHub   →  github.com/prem-kumar-sharma',
                '  YouTube  →  @insightbyprem'
            ];
        },
        research: function () {
            return [
                '  <span class="tline-acc">Current research @ IIT Bombay:</span>',
                '  · Deepfake detection in biometric fingerprints',
                '  · Wavelet transforms & time-frequency analysis',
                '  · AI explainability & post-hoc interpretability',
                '  · ANRF-PAIR Program (INR 105 Cr) national initiative',
                '  · 7 partner institutes · 100+ researchers · 13 projects'
            ];
        },
        clear: function () { return null; }
    };

    function addLine(html, cls) {
        var div = document.createElement('div');
        div.className = 'tline ' + (cls || '');
        div.innerHTML = html;
        out.appendChild(div);
        out.scrollTop = out.scrollHeight;
    }

    if (inp) {
        inp.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter') return;
            var cmd = inp.value.trim().toLowerCase();
            inp.value = '';
            if (!cmd) return;

            addLine('~ $ ' + cmd, 'tline-acc');

            if (cmd === 'clear') {
                out.innerHTML = '';
                return;
            }

            var fn = commands[cmd];
            if (fn) {
                var lines = fn();
                if (lines) lines.forEach(function (l) { addLine(l); });
            } else {
                addLine('  Command not found: ' + cmd + '. Type <span class="tcmd">help</span> for commands.', 'tline-err');
            }
        });
    }
})();

/* ═══════════════════════════════════════════════
   VUE INSTANCE
   ═══════════════════════════════════════════════ */
new Vue({
    el: '#app',
    data: {
        experiences: [
            {
                company: 'Indian Institute of Technology, Bombay',
                role: 'Research Associate',
                type: 'Full-time',
                date: 'Jul 2025 – Present',
                location: 'Mumbai, India · On-site',
                current: true,
                skills: ['Signal Processing', 'Wavelet Transforms', 'Deep Learning', 'NLP', 'LLMs', 'Generative AI', 'Computer Vision', 'AI Explainability'],
                bullets: [
                    'Researching deepfake detection and minutiae matching in biometric fingerprints using wavelet transforms and time-frequency methods under Prof. Vikram M. Gadre (ANRF-PAIR Program).',
                    'Built post-hoc interpretability and evaluation pipelines for AI/ML models, identifying failure modes across 3+ active research projects.',
                    'Spearheading the ANRF-PAIR Hub & Spokes national program (INR 105 Cr), coordinating 7 partner institutes, 100+ researchers, and 13 concurrent projects.'
                ]
            },
            {
                company: 'Thundergits',
                role: 'AI & Automation Product Strategy Consultant Lead',
                type: 'Consulting',
                date: 'Aug 2025 – Present',
                location: 'Remote',
                current: true,
                skills: ['AI Strategy', 'Product Management', 'PRD Writing', 'Client Acquisition', 'Solution Architecture'],
                bullets: [
                    'Leading client acquisition, strategy calls, and deal negotiations for AI & automation-driven solutions.',
                    'Translating business problems into AI-enabled product requirements (PRDs) and clear solution scopes.',
                    'Defining product architecture including features, automation workflows, tech stack, delivery roadmap, and team structure.'
                ]
            },
            {
                company: 'LOQO AI',
                role: 'Generative AI Engineer',
                type: 'Full-time · Remote',
                date: 'Jul 2024 – Jun 2025',
                location: 'New Delhi, India · Remote',
                current: false,
                skills: ['GPT-4/5', 'LLaMA', 'Stable Diffusion', 'RAG', 'CrewAI', 'LangChain', 'Python', 'Docker', 'Flask'],
                bullets: [
                    'Architected multi-agent GenAI pipelines (GPT-4/5, Gemini, CrewAI), reducing average production cycle time by ~60%.',
                    'Built text-to-video pipelines integrating LLaMA, Stable Diffusion, Flux, and ElevenLabs, processing 200+ content pieces/month with less than 2% production error rate.',
                    'Designed modular RAG and prompt engineering frameworks with fine-tuning support, improving output quality by ~35% across 5+ client verticals.'
                ]
            },
            {
                company: 'Programming Classes',
                role: 'Educator',
                type: 'Part-time',
                date: 'Nov 2024 – Jun 2025',
                location: 'Patna',
                current: false,
                skills: ['Python', 'SQL', 'Power BI', 'Tableau', 'Excel', 'Figma', 'Statistics'],
                description: 'Taught Python, data analysis, SQL, Power BI, Tableau, Advanced Excel, statistics, and UI/UX design. Provided career guidance and mentored students on real-world projects.'
            },
            {
                company: '7 Miles Per Second',
                role: 'Software Developer Intern',
                type: 'Internship',
                date: 'Aug 2024 – Nov 2024',
                location: 'Chennai · Remote',
                current: false,
                skills: ['App Development', 'Team Collaboration', 'Leadership'],
                description: 'Led app development projects from design to deployment, collaborating across teams to deliver high-quality applications focused on user experience.'
            },
            {
                company: 'Medical Network Pvt. Ltd.',
                role: 'WebOps Intern',
                type: 'Internship',
                date: 'Jan 2024 – Jun 2024',
                location: 'Patna · On-site',
                current: false,
                skills: ['Website Maintenance', 'Data Analysis', 'Digital Infrastructure'],
                description: 'Maintained website functionality and optimized digital infrastructure. Provided insights from leads, marketing, and inventory data.'
            },
            {
                company: 'TechoTians',
                role: 'Web Developer Intern',
                type: 'Internship',
                date: 'Aug 2023 – Dec 2023',
                location: 'Patna · On-site',
                current: false,
                skills: ['HTML/CSS', 'JavaScript', 'UI/UX', 'Performance Optimization'],
                description: 'Developed and maintained websites and landing pages for optimal performance and user experience.'
            },
            {
                company: 'Learn Everything AI',
                role: 'WordPress Developer & Graphics Designer',
                type: 'Part-time',
                date: 'Jan 2023 – Aug 2023',
                current: false,
                skills: ['WordPress', 'Graphic Design', 'Branding'],
                description: 'Developed WordPress sites and designed posters/carousels for brand visibility and engagement.'
            }
        ],

        projects: [
            {
                title: 'EduBridge: User-Centric LMS Platform',
                link: 'https://github.com/prem-kumar-sharma/Edubridge',
                description: 'Led end-to-end product design of an educational LMS, translating stakeholder pain-points into scalable prototypes with interactive dashboards and automated admin workflows.',
                image: 'https://topsoftwarecompanies.co/front_assets/img/blog/IN_DEsignthinking_Design-Thinking-2.png',
                tags: ['Figma', 'KDT-EAST', 'Jira', 'Product Design']
            },
            {
                title: 'Food Rating Prediction: ML Pipeline',
                link: 'https://github.com/prem-kumar-sharma/Machine-Learning-Project-Predicting-Food-Ratings',
                description: 'Built end-to-end ML pipelines across 5 models on 50K+ samples; achieved top-10% accuracy through rigorous error analysis on real-world food review data.',
                image: 'https://proveg.org/wp-content/uploads/2022/12/AdobeStock_493066768-scaled-1.jpeg',
                tags: ['Python', 'Scikit-learn', 'XGBoost', 'Pandas']
            },
            {
                title: 'IITM Resume Analyzer',
                link: 'https://github.com/prem-kumar-sharma/IITM-Resume-Feedbacks',
                description: 'Developed a resume analyzer tool generating actionable feedback based on IITM BS Resume Guidelines, powered by OpenAI GPT.',
                image: 'https://squeezegrowth.com/wp-content/uploads/2022/01/Best-Resume-Scanning-Software-scaled.webp',
                tags: ['OpenAI API', 'Python', 'NLP', 'GenAI']
            },
            {
                title: 'Library Management System',
                link: 'https://github.com/prem-kumar-sharma/Library-Management-System',
                description: 'Full-stack library management system with Redis caching, Flask backend, and PostgreSQL for efficient high-volume operations.',
                image: 'https://www.vervelogic.com/blog/wp-content/uploads/2019/08/LMS-01.png',
                tags: ['Flask', 'PostgreSQL', 'Redis', 'Docker']
            },
            {
                title: 'Diabeteasy: ML Health Tool',
                link: 'https://github.com/prem-kumar-sharma/ML-Health-Project/tree/main/Diabeteasy',
                description: 'ML-based diabetes management tool with Google Maps integration for nearby doctor discovery and health tracking.',
                image: 'https://sa1s3optim.patientpop.com/assets/images/provider/photos/2421932.jpg',
                tags: ['Python', 'Machine Learning', 'Google Maps API']
            },
            {
                title: 'Food Log App',
                link: 'https://github.com/prem-kumar-sharma/food-log-app',
                description: 'Responsive meal tracking app using the Edamam API for real-time nutritional data, built with Vue.js.',
                image: 'https://superiorfs.com.au/Documents/banner-blog-superior-current_trends-1-@2x.jpg',
                tags: ['Vue.js', 'Edamam API', 'JavaScript']
            }
        ],

        skillCategories: [
            {
                name: 'Languages',
                skills: ['Python', 'SQL', 'JavaScript', 'Java']
            },
            {
                name: 'GenAI & LLMs',
                skills: ['Fine-Tuning (LoRA, QLoRA)', 'RAG', 'LLM Evaluation', 'GPT-4/5', 'Gemini', 'LLaMA', 'BERT', 'T5', 'Stable Diffusion', 'Flux', 'ElevenLabs']
            },
            {
                name: 'Agentic AI',
                skills: ['Multi-Agent Orchestration', 'Tool-Using LLMs', 'MCP', 'Claude Code', 'CrewAI', 'LangChain', 'Autonomous Pipelines']
            },
            {
                name: 'ML & Research',
                skills: ['Scikit-learn', 'XGBoost', 'Post-hoc Explainability', 'Wavelet Transforms', 'Signal/Image Processing', 'Deep Learning', 'Computer Vision', 'NLP']
            },
            {
                name: 'Frameworks & Libraries',
                skills: ['Flask', 'SQLAlchemy', 'ReactJS', 'VueJS', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Streamlit']
            },
            {
                name: 'Infrastructure & Tools',
                skills: ['Docker', 'Git', 'AWS', 'GCP', 'PostgreSQL', 'Redis', 'Celery', 'Figma', 'Jira']
            }
        ],

        videos: [
            {
                title: 'Complete Flask CRUD Application Tutorial',
                link: 'https://www.youtube.com/watch?v=Jnf2X6t3xbo&t=1216s'
            },
            {
                title: 'IIT Madras EXPERT Shares Top Fresher Resume Tips',
                link: 'https://youtu.be/dOtwWAx_BEc?si=QdgIwJXkv4DhgywP'
            },
            {
                title: 'STOP Making These Common Mistakes At Hackathons',
                link: 'https://youtu.be/BuwF8LAdZcg?si=RzChhymiidBY7iox'
            },
            {
                title: '3 Degrees in 5 Years & Ph.D Without GATE/NET',
                link: 'https://youtu.be/uZBHNj66500?si=jlVUJ99PfkKz75E_'
            },
            {
                title: 'Journalism Showdown: Data vs Traditional Reporting in Cricket',
                link: 'https://youtu.be/1l3CMBacafA?si=8izzC7AGRDUJRA79'
            },
            {
                title: 'I Mastered GitHub and Created My FIRST Project Like a PRO!',
                link: 'https://youtu.be/WhviDVE1Qkk?si=K38EiFb6UBSlpEoh'
            }
        ],

        certifications: [
            {
                title: 'SQL (Advanced) & SQL (Intermediate)',
                issuer: 'HackerRank',
                date: 'Jan 2025',
                image: 'sql.webp'
            },
            {
                title: 'NPTEL Believer',
                issuer: 'IIT Madras',
                date: 'Dec 2024',
                image: 'nptel_beliver.webp'
            },
            {
                title: 'Cloud Computing',
                issuer: 'IIT Kharagpur',
                date: 'Nov 2024',
                image: 'cloud_computing.webp'
            },
            {
                title: 'Software Conceptual Design',
                issuer: 'IIT Bombay',
                date: 'Nov 2024',
                image: 'scd.webp'
            },
            {
                title: 'Machine Learning using NumPy',
                issuer: 'IIT Madras',
                date: 'Oct 2024',
                image: 'oppe_ml.webp'
            },
            {
                title: 'Soft Skill Development',
                issuer: 'NPTEL (IIT Kharagpur)',
                date: 'Oct 2024',
                image: 'ssd.webp'
            },
            {
                title: 'AI/ML for Geodata Analysis',
                issuer: 'ISRO',
                date: 'Sep 2024',
                image: 'aiml.webp'
            },
            {
                title: 'BATM using Python',
                issuer: 'NPTEL (IIT Roorkee)',
                date: 'Sep 2024',
                image: 'batm.webp'
            }
        ]
    },

    methods: {
        getEmbedUrl: function (url) {
            var m = url.match(/(?:v=|\.be\/)([^&?]+)/);
            return m ? 'https://www.youtube.com/embed/' + m[1] : url;
        }
    }
});
