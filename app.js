/* ═══════════════════════════════════════════════════════════
   Prem Kumar Sharma — Portfolio
   Motion: GSAP + ScrollTrigger + Lenis. Everything degrades to a
   static, fully readable page without them (or with reduced motion).
   ═══════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    var root = document.documentElement;
    var $ = function (s, c) { return (c || document).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var hasGsap = !!(window.gsap && window.ScrollTrigger);
    var motion = hasGsap && !reduced;
    var lenis = null;

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (!location.hash) window.scrollTo(0, 0);

    /* ─── Always-on UI ─────────────────────────────────── */
    wrapRolls();
    initClock();
    initMenu();
    initNavState();
    initActiveNav();
    initAnchors();
    initAccordion();
    initCopyEmail();
    initVideos();
    initVideoTabs();
    initFloatCta();
    initLightbox();
    initRailDrag();
    initTerminal();
    initFooterMark();
    initField();

    if (!motion) {
        root.classList.remove('js');
        var loader = $('#loader');
        if (loader) loader.remove();
        if (!reduced) startRoleRotator();
        window.__booted = true;
        return;
    }

    /* ─── Motion ───────────────────────────────────────── */
    gsap.registerPlugin(ScrollTrigger);
    initLenis();

    // Pinned sections first so triggers below them are measured after pin spacing.
    initWork();
    var heroChars = prepareHero();
    initSplitHeadings();
    initFill();
    initReveals();
    initPortrait();
    initCounters();
    initFeatureMock();
    initScrambleLabels();
    initHeroScroll();
    initMarquee();
    initCursor();
    initMagnetic();

    window.__booted = true;

    runLoader(function () {
        introHero(heroChars);
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });

    /* ═══════════════════════════════════════════════════
       Helpers
       ═══════════════════════════════════════════════════ */

    function wrapRolls() {
        $$('.roll').forEach(function (el) {
            var span = document.createElement('span');
            span.className = 'roll__in';
            span.textContent = el.textContent;
            el.textContent = '';
            el.appendChild(span);
        });
    }

    // Wrap every word in a masked span, preserving inline elements like <em>.
    function splitWords(el) {
        var words = [];
        (function walk(node) {
            Array.prototype.slice.call(node.childNodes).forEach(function (child) {
                if (child.nodeType === 3) {
                    var frag = document.createDocumentFragment();
                    child.textContent.split(/(\s+)/).forEach(function (part) {
                        if (!part) return;
                        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
                        var outer = document.createElement('span');
                        var inner = document.createElement('span');
                        outer.className = 'w';
                        inner.className = 'w__in';
                        inner.textContent = part;
                        outer.appendChild(inner);
                        frag.appendChild(outer);
                        words.push(inner);
                    });
                    node.replaceChild(frag, child);
                } else if (child.nodeType === 1 && child.tagName !== 'BR') {
                    walk(child);
                }
            });
        })(el);
        el.classList.add('is-split');
        return words;
    }

    function splitChars(el) {
        var chars = [];
        var text = el.textContent.trim();
        el.textContent = '';
        text.split(' ').forEach(function (word, i, all) {
            var w = document.createElement('span');
            w.className = 'cw';
            Array.from(word).forEach(function (ch) {
                var c = document.createElement('span');
                c.className = 'ch';
                c.textContent = ch;
                w.appendChild(c);
                chars.push(c);
            });
            el.appendChild(w);
            if (i < all.length - 1) el.appendChild(document.createTextNode(' '));
        });
        el.classList.add('is-split');
        return chars;
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // Decode-style text scramble.
    var GLYPHS = '!/\\_-=+*^?#[]{}ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    function scramble(el, to) {
        var from = el.textContent;
        var len = Math.max(from.length, to.length);
        var queue = [];
        for (var i = 0; i < len; i++) {
            var start = Math.floor(Math.random() * 18);
            queue.push({ from: from[i] || '', to: to[i] || '', start: start, end: start + 8 + Math.floor(Math.random() * 18), ch: '' });
        }
        var frame = 0;
        cancelAnimationFrame(el._scr);
        (function update() {
            var out = '';
            var done = 0;
            for (var j = 0; j < queue.length; j++) {
                var q = queue[j];
                if (frame >= q.end) {
                    done++;
                    out += escapeHtml(q.to);
                } else if (frame >= q.start) {
                    if (!q.ch || Math.random() < 0.28) q.ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                    out += '<span class="scr">' + escapeHtml(q.ch) + '</span>';
                } else {
                    out += escapeHtml(q.from);
                }
            }
            el.innerHTML = out;
            if (done < queue.length) {
                frame++;
                el._scr = requestAnimationFrame(update);
            }
        })();
    }

    function refreshTriggers() {
        if (window.ScrollTrigger) ScrollTrigger.refresh();
    }

    /* ═══════════════════════════════════════════════════
       Always-on features
       ═══════════════════════════════════════════════════ */

    function initClock() {
        var a = $('#clock');
        var b = $('#clock-footer');
        var year = $('#year');
        if (year) year.textContent = new Date().getFullYear();
        var fmt;
        try {
            fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
        } catch (e) { return; }
        function tick() {
            var t = fmt.format(new Date());
            if (a) a.textContent = t;
            if (b) b.textContent = t + ' IST';
        }
        tick();
        setInterval(tick, 15000);
    }

    var menuOpen = false;
    function setMenu(open) {
        var btn = $('#menu-btn');
        var menu = $('#menu');
        if (!btn || !menu || open === menuOpen) return;
        menuOpen = open;
        menu.classList.toggle('is-open', open);
        menu.setAttribute('aria-hidden', String(!open));
        btn.setAttribute('aria-expanded', String(open));
        root.classList.toggle('menu-open', open);
        $('.nav__menu-label', btn).textContent = open ? 'Close' : 'Menu';
        if (lenis) open ? lenis.stop() : lenis.start();
    }

    function initMenu() {
        var btn = $('#menu-btn');
        if (!btn) return;
        btn.addEventListener('click', function () { setMenu(!menuOpen); });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setMenu(false);
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth > 900) setMenu(false);
        });
    }

    function initNavState() {
        var nav = $('#nav');
        if (!nav) return;
        var lastY = window.scrollY;
        window.addEventListener('scroll', function () {
            var y = window.scrollY;
            nav.classList.toggle('is-scrolled', y > 40);
            if (!menuOpen) nav.classList.toggle('is-hidden', y > lastY && y > 400);
            lastY = y;
        }, { passive: true });
    }

    function initActiveNav() {
        var links = $$('.nav__links a[data-nav]');
        if (!links.length || !('IntersectionObserver' in window)) return;
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (l) {
                    l.classList.toggle('is-active', l.getAttribute('data-nav') === entry.target.id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        ['top', 'about', 'experience', 'work', 'skills', 'content', 'mentor', 'contact'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) io.observe(el);
        });
    }

    function initAnchors() {
        document.addEventListener('click', function (e) {
            var a = e.target.closest('a[href^="#"]');
            if (!a) return;
            var id = a.getAttribute('href');
            var target = id === '#top' || id === '#' ? 0 : document.querySelector(id);
            if (target === null) return;
            e.preventDefault();
            setMenu(false);
            if (lenis) {
                lenis.scrollTo(target, { duration: 1.5, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
            } else if (target === 0) {
                window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
            } else {
                target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
            }
            if (id === '#main' && target.focus) {
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    }

    function initAccordion() {
        $$('.exp__row').forEach(function (row) {
            row.addEventListener('click', function () {
                var item = row.parentElement;
                var open = !item.classList.contains('is-open');
                item.classList.toggle('is-open', open);
                row.setAttribute('aria-expanded', String(open));
                // Content below (incl. the pinned gallery) moved; re-measure once the panel settles.
                clearTimeout(initAccordion._t);
                initAccordion._t = setTimeout(refreshTriggers, 750);
            });
        });
    }

    function initCopyEmail() {
        var btn = $('#copy-email');
        if (!btn) return;
        var state = $('.email__state', btn);
        var email = btn.getAttribute('data-email');
        btn.addEventListener('click', function () {
            if (!navigator.clipboard) { location.href = 'mailto:' + email; return; }
            navigator.clipboard.writeText(email).then(function () {
                state.textContent = 'Copied ✓';
                clearTimeout(btn._t);
                btn._t = setTimeout(function () { state.textContent = 'Copy'; }, 2200);
            }, function () {
                location.href = 'mailto:' + email;
            });
        });
    }

    // Lightweight YouTube: thumbnails until clicked, then swap in the player.
    function initVideos() {
        $$('.video[data-yt]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.getAttribute('data-yt');
                var title = $('.video__title', btn).textContent;
                var wrap = document.createElement('div');
                wrap.className = 'video is-playing';
                var thumb = document.createElement('div');
                thumb.className = 'video__thumb';
                var frame = document.createElement('iframe');
                frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
                frame.title = title;
                frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                frame.allowFullscreen = true;
                thumb.appendChild(frame);
                var t = document.createElement('span');
                t.className = 'video__title';
                t.textContent = title;
                wrap.appendChild(thumb);
                wrap.appendChild(t);
                btn.parentNode.replaceChild(wrap, btn);
                if (window.__cursorReset) window.__cursorReset();
            });
        });
    }

    function initVideoTabs() {
        var tabs = $$('.tabs__btn');
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                tabs.forEach(function (t) {
                    var on = t === tab;
                    t.classList.toggle('is-active', on);
                    t.setAttribute('aria-selected', String(on));
                    var panel = document.getElementById(t.getAttribute('aria-controls'));
                    if (panel) panel.hidden = !on;
                });
                var shown = document.getElementById(tab.getAttribute('aria-controls'));
                if (shown && window.gsap && !reduced) {
                    gsap.fromTo($$('.video', shown), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06, clearProps: 'transform' });
                }
                refreshTriggers();
            });
        });
    }

    // Floating "Book a call" pill: shows after the hero, hides while the mentorship / contact / footer areas are on screen.
    function initFloatCta() {
        var pill = $('#float-cta');
        if (!pill || !('IntersectionObserver' in window)) return;
        var blockers = ['#top', '#mentor', '#contact', '.footer'].map(function (sel) { return $(sel); }).filter(Boolean);
        var visible = new Set();
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
            });
            pill.classList.toggle('is-visible', visible.size === 0);
        }, { threshold: 0.05 });
        blockers.forEach(function (el) { io.observe(el); });
    }

    function initLightbox() {
        var dlg = $('#lightbox');
        var img = $('#lightbox-img');
        if (!dlg || !img || typeof dlg.showModal !== 'function') return;
        $$('.cert').forEach(function (c) {
            c.addEventListener('click', function () {
                if (c.getAttribute('data-dragged') === '1') return;
                img.src = c.getAttribute('data-full');
                img.alt = $('.cert__title', c).textContent + ' certificate';
                dlg.showModal();
                if (lenis) lenis.stop();
            });
        });
        $('#lightbox-close').addEventListener('click', function () { dlg.close(); });
        dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
        dlg.addEventListener('close', function () { if (lenis) lenis.start(); });
    }

    // Click-and-drag horizontal scrolling for the certificate rail (mouse only; touch scrolls natively).
    function initRailDrag() {
        var rail = $('#certs-rail');
        if (!rail) return;
        var down = false, startX = 0, startScroll = 0, moved = 0;
        rail.addEventListener('pointerdown', function (e) {
            if (e.pointerType !== 'mouse' || e.button !== 0) return;
            down = true;
            moved = 0;
            startX = e.clientX;
            startScroll = rail.scrollLeft;
        });
        window.addEventListener('pointermove', function (e) {
            if (!down) return;
            var dx = e.clientX - startX;
            moved = Math.max(moved, Math.abs(dx));
            if (moved > 6) rail.classList.add('is-dragging');
            rail.scrollLeft = startScroll - dx;
        });
        window.addEventListener('pointerup', function () {
            if (!down) return;
            down = false;
            rail.classList.remove('is-dragging');
            var dragged = moved > 6 ? '1' : '0';
            $$('.cert', rail).forEach(function (c) { c.setAttribute('data-dragged', dragged); });
            setTimeout(function () {
                $$('.cert', rail).forEach(function (c) { c.setAttribute('data-dragged', '0'); });
            }, 0);
        });
    }

    function initTerminal() {
        var term = $('#term');
        var out = $('#term-out');
        var inp = $('#term-in');
        if (!term || !out || !inp) return;
        var hist = [];
        var hIdx = 0;

        function open() {
            root.classList.add('term-open');
            term.classList.add('is-open');
            term.setAttribute('aria-hidden', 'false');
            setTimeout(function () { inp.focus(); }, 60);
        }
        function close() {
            root.classList.remove('term-open');
            term.classList.remove('is-open');
            term.setAttribute('aria-hidden', 'true');
            inp.blur();
        }
        function toggle() { term.classList.contains('is-open') ? close() : open(); }

        $('#term-open').addEventListener('click', toggle);
        $('#term-close').addEventListener('click', close);
        out.setAttribute('data-lenis-prevent', '');

        document.addEventListener('keydown', function (e) {
            var el = document.activeElement;
            var typingElsewhere = el && el !== inp && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
            if (e.key === '`' && !typingElsewhere) {
                e.preventDefault();
                toggle();
            } else if (e.key === 'Escape' && term.classList.contains('is-open')) {
                close();
            }
        });

        var commands = {
            help: function () {
                return [
                    ['Available commands:', 'acc'],
                    '  whoami       who is prem?',
                    '  mentor       book a 1:1 call',
                    '  experience   recent roles',
                    '  research     what I work on now',
                    '  skills       tech stack',
                    '  contact      get in touch',
                    '  socials      where to find me',
                    '  clear        clear the screen',
                    '  exit         close the terminal'
                ];
            },
            whoami: function () {
                return [
                    ['Prem Kumar Sharma', 'acc'],
                    '  Research Associate (AI Engineer) @ Precog, IIIT Hyderabad',
                    '  Ex-research @ IIT Bombay · Ex-GenAI Engineer @ LOQO AI',
                    "  IIT Madras BS '25 · Minor: Economics & Finance",
                    '  Mentor · Creator @insightbyprem (6.9K+ subs, 1.4M+ views)',
                    '  Based in Patna, Bihar, India'
                ];
            },
            experience: function () {
                return [
                    ['Recent experience:', 'acc'],
                    '  2026–now    Research Associate @ Precog, IIIT Hyderabad',
                    '  2026–now    Mentor @ Geekashram',
                    '  2025–now    AI Strategy Consultant @ Thundergits',
                    '  2025–2026   Project Associate @ IIT Bombay (ANRF-PAIR)',
                    '  2025–2026   Digital Content Creator @ YouTube',
                    '  2024–2025   Generative AI Engineer @ LOQO AI'
                ];
            },
            research: function () {
                return [
                    ['Now @ Precog, IIIT Hyderabad:', 'acc'],
                    '  · Advisor: Prof. Ponnurangam Kumaraguru (PK)',
                    '  · Grounded, production-ready AI systems',
                    '  · National-scale AI initiatives',
                    ['Previously @ IIT Bombay:', 'acc'],
                    '  · Deepfake detection in biometric fingerprints',
                    '  · Wavelet transforms & time-frequency analysis',
                    '  · Post-hoc explainability & evaluation pipelines',
                    '  · ANRF-PAIR program: 7 institutes, 100+ researchers, 13 projects'
                ];
            },
            skills: function () {
                return [
                    ['Top skills:', 'acc'],
                    '  Languages    Python, SQL, JavaScript, Java',
                    '  GenAI        GPT-4/5, LLaMA, BERT, RAG, Fine-tuning',
                    '  Agentic AI   CrewAI, LangChain, MCP, Claude Code',
                    '  ML/Research  Scikit-learn, XGBoost, Wavelets, CV, NLP',
                    '  Infra        Docker, PostgreSQL, Redis, AWS, GCP'
                ];
            },
            contact: function () {
                return [
                    ['Get in touch:', 'acc'],
                    '  Email     insightbyprem.business@gmail.com',
                    '  Topmate   topmate.io/prem_kumar_sharma'
                ];
            },
            socials: function () {
                return [
                    ['Find me online:', 'acc'],
                    '  LinkedIn   linkedin.com/in/prem-kumar-sharma-a499b1201',
                    '  GitHub     github.com/prem-kumar-sharma',
                    '  YouTube    youtube.com/@insightbyprem',
                    '  Instagram  instagram.com/prem.kr_sharma'
                ];
            },
            mentor: function () {
                setTimeout(function () { window.open('https://topmate.io/prem_kumar_sharma', '_blank', 'noopener'); }, 600);
                return [['Opening Topmate to book a 1:1 call…', 'acc']];
            },
            'sudo hire prem': function () {
                setTimeout(function () { window.open('https://topmate.io/prem_kumar_sharma', '_blank', 'noopener'); }, 600);
                return [['Permission granted. Opening Topmate…', 'acc']];
            }
        };

        function line(text, cls) {
            var div = document.createElement('div');
            div.className = 'term__line' + (cls ? ' term__' + cls : '');
            div.textContent = text;
            out.appendChild(div);
        }

        inp.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowUp' && hist.length) {
                e.preventDefault();
                hIdx = Math.max(0, hIdx - 1);
                inp.value = hist[hIdx];
                return;
            }
            if (e.key === 'ArrowDown' && hist.length) {
                e.preventDefault();
                hIdx = Math.min(hist.length, hIdx + 1);
                inp.value = hist[hIdx] || '';
                return;
            }
            if (e.key !== 'Enter') return;
            var raw = inp.value.trim();
            var cmd = raw.toLowerCase().replace(/\s+/g, ' ');
            inp.value = '';
            if (!cmd) return;
            hist.push(raw);
            hIdx = hist.length;

            line('~ $ ' + raw, 'cmd');
            if (cmd === 'clear') { out.textContent = ''; return; }
            if (cmd === 'exit') { close(); return; }
            var fn = commands[cmd];
            if (fn) {
                fn().forEach(function (l) {
                    if (Array.isArray(l)) line('  ' + l[0], l[1]);
                    else line(l);
                });
            } else {
                line('  command not found: ' + raw + ' — try "help"', 'err');
            }
            out.scrollTop = out.scrollHeight;
        });
    }

    // Scale the footer wordmark so it spans the full width exactly.
    function initFooterMark() {
        var mark = $('.footer__mark');
        var span = mark && $('span', mark);
        if (!span) return;
        function fit() {
            var cs = getComputedStyle(mark);
            var avail = mark.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
            span.style.fontSize = '100px';
            var w = span.getBoundingClientRect().width;
            if (w) span.style.fontSize = (99 * avail / w) + 'px';
        }
        fit();
        window.addEventListener('resize', fit);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    }

    /* ─── Hero field: a dot matrix with a wavelet packet travelling through it ─── */
    function initField() {
        var canvas = $('#field');
        if (!canvas || !canvas.getContext) return;
        var ctx = canvas.getContext('2d');
        var w = 0, h = 0, gap = 24, cols = 0, rows = 0, ox = 0, oy = 0;
        var mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999 };
        var running = false, inView = true, raf = 0;
        var INK = '#ecebe6', ACC = '#ff5b25';

        function resize() {
            var r = canvas.getBoundingClientRect();
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = r.width; h = r.height;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            gap = w < 700 ? 20 : 24;
            cols = Math.ceil(w / gap) + 1;
            rows = Math.ceil(h / gap) + 1;
            ox = (w - (cols - 1) * gap) / 2;
            oy = (h - (rows - 1) * gap) / 2;
        }

        function draw(t) {
            ctx.clearRect(0, 0, w, h);
            mouse.sx += (mouse.x - mouse.sx) * 0.12;
            mouse.sy += (mouse.y - mouse.sy) * 0.12;

            var period = 15000;
            var p = (t % period) / period;
            var cx = -0.3 * w + p * 1.6 * w;               // packet centre sweeps left → right
            var mid = h * 0.56;
            var amp = Math.min(h * 0.2, 170);
            var sigma = Math.max(w * 0.11, 90);
            var k = (Math.PI * 2) / Math.max(w * 0.06, 55);
            var band = gap * 0.8;
            var R = 170;

            for (var i = 0; i < cols; i++) {
                var x = ox + i * gap;
                var dx = x - cx;
                var env = Math.exp(-(dx * dx) / (2 * sigma * sigma));          // Gaussian envelope
                var y0 = mid + amp * env * Math.cos(k * dx) + Math.sin(x * 0.006 + t * 0.0005) * 10; // Morlet-ish
                for (var j = 0; j < rows; j++) {
                    var y = oy + j * gap;
                    var d = y - y0;
                    var lit = Math.exp(-(d * d) / (2 * band * band));
                    var mx = x - mouse.sx, my = y - mouse.sy;
                    var md = Math.sqrt(mx * mx + my * my);
                    var m = md < R ? 1 - md / R : 0;
                    var px = x, py = y;
                    if (m > 0) {
                        px += (mx / (md || 1)) * m * 12;
                        py += (my / (md || 1)) * m * 12;
                    }
                    var strong = lit * (0.2 + 0.8 * env);
                    var a = 0.07 + strong * 0.8 + m * 0.35;
                    var s = 1.2 + strong * 1.8 + m * 1.4;
                    ctx.globalAlpha = a > 1 ? 1 : a;
                    ctx.fillStyle = env * lit > 0.22 ? ACC : INK;
                    ctx.fillRect(px - s / 2, py - s / 2, s, s);
                }
            }
            ctx.globalAlpha = 1;
        }

        function loop(t) {
            draw(t);
            raf = requestAnimationFrame(loop);
        }
        function start() {
            if (running || reduced) return;
            running = true;
            raf = requestAnimationFrame(loop);
        }
        function stop() {
            running = false;
            cancelAnimationFrame(raf);
        }

        resize();
        if (reduced) draw(15000 * 0.45);
        else start();

        window.addEventListener('resize', function () {
            resize();
            if (reduced) draw(15000 * 0.45);
        });
        window.addEventListener('pointermove', function (e) {
            var r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        }, { passive: true });
        document.addEventListener('mouseleave', function () { mouse.x = mouse.y = -9999; });

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                inView = entries[0].isIntersecting;
                inView && !document.hidden ? start() : stop();
            }).observe(canvas);
        }
        document.addEventListener('visibilitychange', function () {
            document.hidden || !inView ? stop() : start();
        });
    }

    var ROLES = [
        'Research Associate @ IIIT Hyderabad',
        'AI Engineer @ Precog',
        'Ex-Research @ IIT Bombay',
        'Ex-GenAI Engineer @ LOQO AI',
        'Mentor · 2,000+ students',
        'Creator @insightbyprem',
        "IIT Madras BS '25"
    ];
    function startRoleRotator() {
        var el = $('#role');
        if (!el) return;
        var i = 0;
        setInterval(function () {
            i = (i + 1) % ROLES.length;
            scramble(el, ROLES[i]);
        }, 3400);
    }

    /* ═══════════════════════════════════════════════════
       Motion features (GSAP)
       ═══════════════════════════════════════════════════ */

    function initLenis() {
        if (!window.Lenis) return;
        lenis = new Lenis({ lerp: 0.095, wheelMultiplier: 1 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
        $('#menu').setAttribute('data-lenis-prevent', '');
    }

    function runLoader(done) {
        var loader = $('#loader');
        var seen = false;
        try {
            seen = sessionStorage.getItem('pks-intro') === '1';
            sessionStorage.setItem('pks-intro', '1');
        } catch (e) { /* storage unavailable: always play */ }

        if (!loader || seen) {
            if (loader) loader.remove();
            done();
            return;
        }

        if (lenis) lenis.stop();
        var num = $('#loader-num');
        var bar = $('#loader-bar');
        var word = $('#loader-word');
        var words = ['Research', 'Engineering', 'Teaching', 'Building'];
        var o = { v: 0 };

        gsap.timeline()
            .to(o, {
                v: 100,
                duration: 2.1,
                ease: 'power3.inOut',
                onUpdate: function () {
                    num.textContent = Math.round(o.v);
                    bar.style.transform = 'scaleX(' + (o.v / 100) + ')';
                    var wi = Math.min(words.length - 1, Math.floor((o.v / 100) * words.length));
                    if (word.textContent !== words[wi]) word.textContent = words[wi];
                }
            })
            .to('.loader__row', { opacity: 0, y: -24, duration: 0.5, ease: 'power2.in', stagger: 0.05 }, '+=0.1')
            .to(loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '-=0.15')
            .add(function () {
                if (lenis) lenis.start();
                done();
            }, '-=0.6')
            .add(function () { loader.remove(); });
    }

    function prepareHero() {
        var chars = [];
        $$('.hero [data-chars]').forEach(function (el) { chars = chars.concat(splitChars(el)); });
        gsap.set(chars, { yPercent: 115, rotate: 7, transformOrigin: '0% 100%' });
        gsap.set('[data-hero]', { y: 24 });
        return chars;
    }

    function introHero(chars) {
        gsap.timeline({ defaults: { ease: 'expo.out' } })
            .to(chars, { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.032 }, 0)
            .to('[data-hero]', { opacity: 1, y: 0, duration: 1.2, stagger: 0.07 }, 0.35)
            .fromTo('#field', { opacity: 0 }, { opacity: 1, duration: 2.2, ease: 'power2.out' }, 0.2)
            .add(startRoleRotator, 1.6);
    }

    function initHeroScroll() {
        var st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('.hero__title', { yPercent: -18, ease: 'none', scrollTrigger: st });
        gsap.to('.hero__foot', { yPercent: -40, opacity: 0, ease: 'none', scrollTrigger: st });
        gsap.to('.hero__field', { yPercent: 20, ease: 'none', scrollTrigger: st });
    }

    function initSplitHeadings() {
        $$('[data-split]').forEach(function (el) {
            var words = splitWords(el);
            gsap.set(words, { yPercent: 110 });
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: function () {
                    gsap.to(words, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.06 });
                }
            });
        });
    }

    // Statement paragraph fills in word by word as it scrolls through the viewport.
    function initFill() {
        $$('[data-fill]').forEach(function (el) {
            el.classList.add('is-fill');
            var words = splitWords(el);
            gsap.fromTo(words, { opacity: 0.13 }, {
                opacity: 1,
                ease: 'none',
                stagger: 0.5,
                scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 42%', scrub: 0.6 }
            });
        });
    }

    function initReveals() {
        ScrollTrigger.batch('[data-reveal]', {
            start: 'top 90%',
            once: true,
            onEnter: function (batch) {
                gsap.to(batch, { opacity: 1, y: 0, duration: 1.15, ease: 'expo.out', stagger: 0.08, overwrite: true, clearProps: 'transform' });
            },
            onLeave: function (batch) {
                gsap.set(batch, { opacity: 1, y: 0, clearProps: 'transform' });
            }
        });
    }

    function initPortrait() {
        var inner = $('.about__portrait-inner');
        if (!inner) return;
        var img = $('img', inner);
        gsap.fromTo(inner, { clipPath: 'inset(100% 0% 0% 0%)' }, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.6,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: inner, start: 'top 82%', once: true }
        });
        gsap.fromTo(img, { scale: 1.5 }, { scale: 1.2, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: inner, start: 'top 82%', once: true } });
        gsap.fromTo(img, { yPercent: -7 }, {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: { trigger: inner, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    }

    function initCounters() {
        $$('[data-count]').forEach(function (el) {
            var target = parseFloat(el.getAttribute('data-count'));
            var suffix = el.getAttribute('data-suffix') || '';
            var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
            var fmt = function (v) {
                return v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
            };
            var o = { v: 0 };
            el.textContent = fmt(0);
            ScrollTrigger.create({
                trigger: el,
                start: 'top 92%',
                once: true,
                onEnter: function () {
                    gsap.to(o, {
                        v: target,
                        duration: 2.2,
                        ease: 'power3.out',
                        onUpdate: function () { el.textContent = fmt(decimals ? o.v : Math.round(o.v)); }
                    });
                }
            });
        });
    }

    function initWork() {
        var pin = $('#work-pin');
        var track = $('#work-track');
        var bar = $('#work-progress');
        if (!pin || !track) return;
        var mm = gsap.matchMedia();
        mm.add('(min-width: 901px)', function () {
            pin.classList.add('is-horizontal');
            var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
            var tween = gsap.to(track, {
                x: function () { return -dist(); },
                ease: 'none',
                scrollTrigger: {
                    trigger: pin,
                    start: 'top top',
                    end: function () { return '+=' + dist(); },
                    pin: true,
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    onUpdate: function (self) { if (bar) bar.style.transform = 'scaleX(' + self.progress + ')'; }
                }
            });
            // Line art drifts inside each cover as cards travel past.
            $$('.card__art', track).forEach(function (art) {
                gsap.fromTo(art, { xPercent: -14 }, {
                    xPercent: 14,
                    ease: 'none',
                    scrollTrigger: { trigger: art.closest('.card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true }
                });
            });
            return function () {
                pin.classList.remove('is-horizontal');
                gsap.set(track, { clearProps: 'x' });
            };
        });
    }

    function initFeatureMock() {
        var mock = $('.mock');
        if (!mock) return;
        gsap.timeline({ scrollTrigger: { trigger: mock, start: 'top 78%', once: true } })
            .fromTo('.mock__plot path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0)
            .from('.mock__progress i', { scaleX: 0, duration: 1.4, ease: 'power2.out' }, 0)
            .from('.mock__msg--q', { opacity: 0, y: 16, duration: 0.6, ease: 'power3.out' }, 0.6)
            .from('.mock__typing', { opacity: 0, duration: 0.3 }, 1.1)
            .to('.mock__typing', { opacity: 0, duration: 0.2 }, 2.2)
            .from('.mock__msg--a', { opacity: 0, y: 16, duration: 0.7, ease: 'power3.out' }, 2.2);
    }

    function initScrambleLabels() {
        $$('[data-scramble]').forEach(function (el) {
            var text = el.textContent;
            ScrollTrigger.create({
                trigger: el,
                start: 'top 92%',
                once: true,
                onEnter: function () { scramble(el, text); }
            });
        });
    }

    // Marquee drifts on its own and speeds up / reverses with scroll velocity.
    function initMarquee() {
        var track = $('#marquee');
        if (!track) return;
        var x = 0;
        var dir = 1;
        gsap.ticker.add(function (time, dt) {
            var v = lenis ? lenis.velocity : 0;
            if (v > 0.2) dir = 1;
            else if (v < -0.2) dir = -1;
            x -= dir * (0.025 + Math.min(Math.abs(v) * 0.01, 0.45)) * (dt / 16.67);
            if (x <= -50) x += 50;
            if (x > 0) x -= 50;
            track.style.transform = 'translate3d(' + x + '%,0,0)';
        });
    }

    function initCursor() {
        if (!finePointer) return;
        var cursor = $('.cursor');
        var dot = $('.cursor__dot');
        var ring = $('.cursor__ring');
        var label = $('.cursor__label');
        if (!cursor) return;
        root.classList.add('has-cursor');

        var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
        window.addEventListener('pointermove', function (e) {
            mx = e.clientX;
            my = e.clientY;
            cursor.classList.add('is-visible');
        }, { passive: true });
        document.addEventListener('mouseout', function (e) {
            if (!e.relatedTarget) cursor.classList.remove('is-visible');
        });

        gsap.ticker.add(function () {
            rx += (mx - rx) * 0.2;
            ry += (my - ry) * 0.2;
            dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0) translate(-50%,-50%)';
            ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';
        });

        function setState(t) {
            cursor.classList.remove('is-hover', 'is-label', 'is-hidden');
            if (!t) return;
            if (t.hasAttribute('data-cursor-hide')) {
                cursor.classList.add('is-hidden');
            } else if (t.getAttribute('data-cursor')) {
                label.textContent = t.getAttribute('data-cursor');
                cursor.classList.add('is-label');
            } else {
                cursor.classList.add('is-hover');
            }
        }
        document.addEventListener('mouseover', function (e) {
            setState(e.target.closest('[data-cursor], [data-cursor-hide], a, button, input, label'));
        });
        window.__cursorReset = function () { setState(null); };
    }

    function initMagnetic() {
        if (!finePointer) return;
        $$('[data-magnetic]').forEach(function (el) {
            var strength = el.classList.contains('cta-orb') ? 0.4 : 0.25;
            var xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
            var yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
            el.addEventListener('pointermove', function (e) {
                var r = el.getBoundingClientRect();
                xTo((e.clientX - (r.left + r.width / 2)) * strength);
                yTo((e.clientY - (r.top + r.height / 2)) * strength);
            });
            el.addEventListener('pointerleave', function () {
                xTo(0);
                yTo(0);
            });
        });
    }
})();
