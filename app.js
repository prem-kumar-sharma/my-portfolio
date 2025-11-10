/* Splash loader (keep or replace existing loader logic) */
window.addEventListener('load', function() {
    let percentage = 0;
    const loadingText = document.getElementById('loading-percentage');

    function updatePercentage() {
        loadingText.textContent = `${percentage}%`;
        percentage++;
        if (percentage <= 100) {
            setTimeout(updatePercentage, 12);
        } else {
            document.getElementById('splash-screen').style.display = 'none';
            document.getElementById('app').style.display = 'block';
        }
    }

    updatePercentage();
});
/* Lightweight dot/particle background (canvas) */
(function initDots() {
    const canvas = document.getElementById('dots-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const DPR = window.devicePixelRatio || 1;
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(DPR, DPR);

    const particles = [];
    const PARTICLE_COUNT = Math.max(30, Math.floor((width * height) / 80000)); // adaptive count
    const COLORS = ['rgba(100,255,218,0.95)', 'rgba(100,255,218,0.6)', 'rgba(100,255,218,0.35)'];

    function rand(min, max) { return Math.random() * (max - min) + min; }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: rand(0, width),
            y: rand(0, height),
            vx: rand(-0.3, 0.3),
            vy: rand(-0.3, 0.3),
            r: rand(1.4, 3.2),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            life: rand(60, 300)
        });
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        canvas.width = width * DPR;
        canvas.height = height * DPR;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    window.addEventListener('resize', resize);

    function draw() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;

            p.life--;
            if (p.life <= 0) {
                p.r = rand(1.4, 3.2);
                p.vx = rand(-0.3, 0.3);
                p.vy = rand(-0.3, 0.3);
                p.life = rand(60, 300);
            }

            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // subtle lines between nearby dots (very faint)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 90) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(100,255,218,' + (0.009 * (90 - d)).toFixed(3) + ')';
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    draw();
})();
new Vue({
    el: '#app',
    data: {
        services: [
          {
            title: 'Mentorship: Projects, Career & Portfolio',
            description: 'I help students and early professionals figure out the right path in tech from choosing good projects to building a solid portfolio and getting interview-ready. We’ll go through your goals, improve your LinkedIn and resume, and plan how you can reach the next level step by step. You can book a short call with me on Topmate to get started and I’ll share a clear 3-month roadmap for you.',
            link: 'https://topmate.io/prem_kumar_sharma',
            image: 'https://www.aihr.com/wp-content/uploads/mentorship-programs-cover.png'
          },
          {
            title: 'AI Product Development, MVP to Production',
            description: 'If you have an idea and want to turn it into a real AI product, I can help you build it end-to-end from concept and prototype to a working deployment. I’ve worked with RAG models, APIs, chatbots, and full AI systems for startups and projects. Just message me on LinkedIn, tell me a bit about what you’re building, and we can explore how to bring it to life.',
            link: 'https://www.linkedin.com/in/prem-kumar-sharma-a499b1201/',
            image: 'https://newvision-software.com/wp-content/uploads/2024/10/Building-the-winning-AI-products.png'
          },
          {
            title: 'Content & Social Media Development',
            description: 'I work with creators and founders to plan and grow their online presence. From short video scripts and thumbnail ideas to complete posting schedules, I help you stay consistent and build a personal brand that actually connects with people. If you want to discuss your content or get a few quick suggestions, just drop me a message on LinkedIn I reply to every genuine query.',
            link: 'https://www.linkedin.com/in/prem-kumar-sharma-a499b1201/',
            image: 'https://www.socialchamp.com/blog/wp-content/uploads/2024/03/Content-Blog-Banner_Q1-2024_1125x600_081_Social-Media-Growth.png'
          },
          {
            title: 'Cinematic AI Content Making: Full Production + BGM',
            description: 'I create fully automated, AI-generated cinematic videos from script writing and visuals to voice-over, background music, and editing. Everything is done end-to-end using AI tools, yet crafted carefully to look natural, emotional, and visually stunning. Whether you want short clips or full storytelling videos, I can help you bring your ideas to life. Just message me on LinkedIn, and we’ll plan something creative for your channel.',
            link: 'https://www.linkedin.com/in/prem-kumar-sharma-a499b1201/',
            image: 'https://smartclick.ai/wp-content/uploads/2020/08/shutterstock_1356497663-scaled.jpg'
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
                title: '3 Degrees in 5 Years & Ph.D Without GATE/NET | The Knowledge Exchange Ep. 1',
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
        projects: [
            {
                title: 'WonCourse - AI-Powered Learning Platform',
                link: 'https://github.com/prem-kumar-sharma/WonCourse-soft-engg-project-may-2024-se-may-27',
                description: 'Developed WonCourse, an AI-powered learning platform integrating GenAI technologies to enhance the learning experience. Implemented features like video lectures, coding assistance, and AI-powered chatbots for course queries. Used RAG (Retrieval-Augmented Generation) for contextual support.',
                image: 'https://nearlearn.com/public/images/ai-training-in-bangalore.jpeg'
            },
            {
                title: 'EduBridge: Design Thinking Project',
                link: 'https://github.com/prem-kumar-sharma/Edubridge',
                description: 'An LMS tailored for educational institutions, designed to simplify administrative tasks, enhance teacher-student communication, and optimize learning outcomes. Developed using the KDT-EAST framework, this project prioritizes user-centric design, scalability, and technological feasibility.',
                image: 'https://topsoftwarecompanies.co/front_assets/img/blog/IN_DEsignthinking_Design-Thinking-2.png'
            },
            {
                title: 'Food Recipe Rating Prediction',
                link: 'https://github.com/prem-kumar-sharma/Machine-Learning-Project-Predicting-Food-Ratings',
                description: 'Built predictive models to forecast food recipe ratings using logistic regression and random forest, achieving over 77% accuracy.',
                image: 'https://proveg.org/wp-content/uploads/2022/12/AdobeStock_493066768-scaled-1.jpeg'
            },
            {
                title: 'Food Log App',
                link: 'https://github.com/prem-kumar-sharma/food-log-app',
                description: 'Developed a responsive meal tracking app using Edamam API for nutritional data.',
                image: 'https://superiorfs.com.au/Documents/banner-blog-superior-current_trends-1-@2x.jpg'
            },
            {
                title: 'Library Management System',
                link: 'https://github.com/prem-kumar-sharma/Library-Management-System',
                description: 'Created a full-stack library management system with caching for efficient operations.',
                image: 'https://www.vervelogic.com/blog/wp-content/uploads/2019/08/LMS-01.png'
            },
            {
                title: 'Diabeteasy',
                link: 'https://github.com/prem-kumar-sharma/ML-Health-Project/tree/main/Diabeteasy',
                description: 'Developed an ML-based diabetes management tool with Google Maps integration for doctor suggestions.',
                image: 'https://sa1s3optim.patientpop.com/assets/images/provider/photos/2421932.jpg'
            },
            {
                title: 'IITM Resume Analyzer',
                link: 'https://github.com/prem-kumar-sharma/IITM-Resume-Feedbacks',
                description: 'Developed a resume analyzer tool for generating actionable feedback based on IITM BS Resume Guidelines, using OpenAI model.',
                image: 'https://squeezegrowth.com/wp-content/uploads/2022/01/Best-Resume-Scanning-Software-scaled.webp'
            },
            {
                title: 'Strategies-for-Professional-Growth Projects',
                link: 'https://github.com/prem-kumar-sharma/Strategies-for-Professional-Growth-Project',
                description: 'A research project that delves into the realities of entrepreneurship beyond the glamour, providing practical insights and strategies essential for startup success.',
                image: 'https://epaouydin3q.exactdn.com/wp-content/uploads/2024/02/Personalized-Career-Development.jpg?strip=all&lossy=1&ssl=1'
            },
            {
                title: 'Business Data Management(BDM) Capstone Projects',
                link: 'https://github.com/prem-kumar-sharma/BDM-Capstone-Projects',
                description: 'Conducted in-depth data analysis to support decision-making processes for business development.',
                image: 'https://www.blue-pencil.ca/wp-content/uploads/2020/04/laptops.png'
            }
        ],
        experiences: [
      {
        company: 'Indian Institute of Technology, Bombay',
        role: 'Research Associate',
        type: 'Full-time',
        date: 'July, 2025 – Present',
        location: 'Mumbai, India · on-site',
        skills: [
          'Signal Processing',
          'Data Science',
          'Machine Learning',
          'Artificial Intelligence (AI)',
          'Deep Learning',
          'Natural Language Processing (NLP)',
          'Large Language Models (LLM)',
          'Generative AI',
          'Computer Vision'
        ],
        description:
          'Working as an Associate Research Fellow under the Post-Baccalaureate/Pre-Doc Fellowship program at IIT Bombay, under the mentorship of Prof. Vikram M. Gadre. The project involves integrating advanced signal and image processing techniques including wavelets and time-frequency analysis with modern machine learning and deep learning frameworks.',
        gif: 'https://images.squarespace-cdn.com/content/v1/5bcfdf91e8ba4404c104e52e/1540936480836-3I7EOTSP4CDJT97QQLUL/electrocute.gif'
      },
      {
        company: 'Loqo AI',
        role: 'Generative AI Engineer',
        type: 'Full-time',
        date: 'Apr 2025 – Oct 2025 · 7 mos',
        location: 'New Delhi, Delhi, India · Remote',
        skills: [
          'Python (Programming Language)',
          'Data Science',
          'Machine Learning',
          'Artificial Intelligence (AI)',
          'Deep Learning',
          'Natural Language Processing (NLP)',
          'Large Language Models (LLM)',
          'Generative AI',
          'Computer Vision'
        ],
        description:
          'Built AI Agents for task automation, leveraging RAG models and multi-modal capabilities. Automated workflows using Selenium, AI-driven scripts, and optimized prompt engineering for image generation and text generation.',
        gif: 'https://cdn.dribbble.com/userupload/23731317/file/original-5eb2f9967073700b38a31280cc2c32e0.gif'
      },
          {
            company: 'Loqo AI',
            role: 'Generative AI Engineer Intern',
            type: 'Internship',
            date: 'Jul 2024 – Mar 2025 · 9 mos',
            location: '',
            skills: [
              'Artificial Intelligence (AI)',
              'Large Language Models (LLM)',
              'Generative AI',
              'Computer Vision',
              'Git',
              'Python (Programming Language)',
              'Docker',
                'Machine Learning',
                'Deep Learning',
                'Flask'
            ],
            description:
              'Developing a text‑to‑video generator app, integrating advanced AI models to generate high‑quality visual content…',
            gif: 'https://miro.medium.com/v2/resize:fit:1400/1*TlbU0F-waQf7_zOfhUNldQ.gif'
          },
          {
            company: '7 Miles Per Second',
            role: 'Software Developer Intern',
            type: 'Internship',
            date: 'Aug 2024 – Nov 2024 · 4 mos',
            location: 'Chennai, Tamil Nadu · Remote',
            skills: ['App Development', 'Team Collaboration', 'Leadership'],
            description:
              'Led app development projects from design to deployment, collaborating across teams. Enhanced technical and leadership skills through innovative projects.',
            gif: 'https://i.pinimg.com/originals/81/17/8b/81178b47a8598f0c81c4799f2cdd4057.gif'
          },
          {
            company: 'Medical Network Pvt. Ltd.',
            role: 'WebOps Intern',
            type: 'Internship',
            date: 'Jan 2024 – Jun 2024 · 6 mos',
            location: 'Patna, Bihar · On‑site',
            skills: ['Website Maintenance', 'Data Insights'],
            description:
              'Maintained website functionality and optimized digital infrastructure. Provided insights from lead, marketing, and inventory data.',
            gif: 'https://user-images.githubusercontent.com/74038190/212749447-bfb7e725-6987-49d9-ae85-2015e3e7cc41.gif'
          },
          {
            company: 'TechoTians',
            role: 'Web Developer Intern',
            type: 'Internship',
            date: 'Aug 2023 – Dec 2023 · 5 mos',
            location: 'Patna, Bihar · On‑site',
            skills: ['UI/UX', 'Performance Optimization'],
            description:
              'Developed websites focusing on user experience and performance. Analyzed trends to improve marketing strategies.',
            gif: 'https://user-images.githubusercontent.com/115187902/230603133-52eedb90-6313-41ef-86a6-122ec3848e19.gif'
          },
          {
            company: 'Learn Everything AI',
            role: 'WordPress Developer & Graphics Designer',
            type: 'Part‑time',
            date: 'Jan 2023 – Aug 2023 · 8 mos',
            location: 'India · Hybrid',
            skills: ['WordPress', 'Graphic Design'],
            description:
              'Designed WordPress websites to improve user experience and engagement.',
            gif: 'https://i.pinimg.com/originals/32/9b/63/329b63886c58f6f4915b8642f52ec8b3.gif'
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
                title: 'NPTEL Believers',
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
            ],
            educations: [
            {
              institution: 'Indian Institute of Technology, Madras',
              degree: 'BS in Data Science & Application',
              date: 'Jan 2021 – Apr 2025',
              location: 'Chennai, Tamil Nadu',
              details: 'Skills: Machine Learning · Data Structure & Algorithm · Vue.js · AI · Back‑End Web Development · Bash · Business Data Management · Business Analytics · Communication · Data Analysis · Data Presentation · Data Science · Deep Learning · DBMS · Data Visualization · Flask · Java · JavaScript · LLM',
              gif: 'https://classroomclipart.com/images/gallery/Animations/Graduation/animated-clipart-graduation-throwing-cap-in-air-04c.gif'
            },
            {
              institution: 'State Board of Technical Education (SBTE), Bihar',
              degree: 'Diploma in Civil Engineering, Govt. Polytechnic Patna 07',
              date: 'Oct 2020 – Oct 2023',
              details: 'Grade: 8.25 CGPA',
              gif: 'https://media.tenor.com/Ze8lxl-TgaEAAAAM/engineering.gif'
            },
            {
              institution: 'R.K.D. College',
              degree: 'Senior Secondary, PCM',
              date: 'Mar 2017 – Apr 2019',
              details: 'Grade: 84.6%',
              gif: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Exciting_-_Idil_Keysan_-_Wikimedia_Giphy_stickers_2019.gif/1200px-Exciting_-_Idil_Keysan_-_Wikimedia_Giphy_stickers_2019.gif'
            },
            {
              institution: 'Gyan Bharti Public School, Gaya',
              degree: 'Secondary School',
              date: 'Mar 2012 – Apr 2017',
              details: 'Grade: 9.6 CGPA',
              gif: 'https://media.tenor.com/2XYVf11lS-cAAAAM/school-work-angry.gif'
            }
          ]

    
},
methods: {
  getEmbedUrl(url) {
    // matches both "youtube.com/watch?v=" and "youtu.be/"
    const m = url.match(/(?:v=|\.be\/)([^&]+)/);
    return m
      ? `https://www.youtube.com/embed/${m[1]}`
      : url;
  }
    }


});