/* main.js - Interactive features for DevOps showcase */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Navigation Scroll Effect ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 2. Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // --- 3. Active Page Navigation Highlight ---
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  
  const navLinksList = document.querySelectorAll('.nav-links a');
  navLinksList.forEach(link => {
    const href = link.getAttribute('href');
    if (pageName === href || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --- 4. Interactive Terminal Pipeline Simulator (Home Page) ---
  const terminalLogs = document.getElementById('terminal-logs');
  if (terminalLogs) {
    const logs = [
      { text: "$ git checkout main", type: "cmd" },
      { text: "Switched to branch 'main'. Your branch is up to date.", type: "info" },
      { text: "$ mvn clean package", type: "cmd" },
      { text: "[INFO] Scanning for projects...", type: "info" },
      { text: "[INFO] Building RegisterNumber-DevOps-Project 1.0-SNAPSHOT", type: "info" },
      { text: "[INFO] Compiling 12 source files to target/classes...", type: "info" },
      { text: "[INFO] Running com.devops.AppTestSuite", type: "info" },
      { text: "Tests run: 24, Failures: 0, Errors: 0, Skipped: 0", type: "success" },
      { text: "[INFO] Packaging WAR artifact: target/RegisterNumber-DevOps-Project.war", type: "info" },
      { text: "[INFO] BUILD SUCCESS - Total time: 4.825s", type: "success" },
      { text: "$ docker build -t devops-app:latest .", type: "cmd" },
      { text: "Sending build context to Docker daemon  24.5MB", type: "info" },
      { text: "Step 1/5 : FROM tomcat:10-jdk17", type: "info" },
      { text: "Step 2/5 : COPY target/*.war /usr/local/tomcat/webapps/", type: "info" },
      { text: "Step 5/5 : EXPOSE 8080", type: "info" },
      { text: "Successfully built devops-app:latest", type: "success" },
      { text: "$ kubectl apply -f k8s/deployment.yaml", type: "cmd" },
      { text: "deployment.apps/devops-web-deployment configured", type: "success" },
      { text: "service/devops-web-service configured", type: "success" },
      { text: "$ curl -I http://devops-app.internal/health", type: "cmd" },
      { text: "HTTP/1.1 200 OK - App is fully healthy and active!", type: "success" }
    ];

    let logIndex = 0;

    function runPipeline() {
      if (logIndex < logs.length) {
        const log = logs[logIndex];
        const line = document.createElement('div');
        line.className = `terminal-line ${log.type}`;
        line.innerText = log.text;
        
        terminalLogs.appendChild(line);
        terminalLogs.scrollTop = terminalLogs.scrollHeight;
        
        logIndex++;
        // Command steps take a bit longer, outputs print faster
        const delay = log.type === 'cmd' ? 1200 : 400;
        setTimeout(runPipeline, delay);
      } else {
        // Reset after 5 seconds to simulate continuous delivery runs
        setTimeout(() => {
          terminalLogs.innerHTML = '<div class="terminal-line cmd">$ # Restarting Pipeline Simulator...</div>';
          logIndex = 0;
          runPipeline();
        }, 5000);
      }
    }

    // Start pipeline simulation
    setTimeout(runPipeline, 1000);
  }

  // --- 5. Accordion for Careers Page ---
  const jobHeaders = document.querySelectorAll('.job-header');
  jobHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close other open items
      document.querySelectorAll('.job-item').forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- 6. Gallery Filtering & Lightbox (Gallery Page) ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active class
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // Lightbox logic
  if (galleryItems.length > 0 && lightbox && lightboxImg && lightboxClose) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const captionText = item.querySelector('.gallery-overlay h3').innerText;
        
        lightboxImg.src = img.src;
        lightboxCaption.innerText = captionText;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scrolling
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // --- 7. Contact Form Handling ---
  const contactForm = document.getElementById('devops-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" style="width:18px;height:18px;stroke:currentColor;fill:none;display:inline-block;vertical-align:middle;margin-right:8px;" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke-width="4" style="opacity:0.25;"></circle>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style="opacity:0.75;"></path>
        </svg> Sending...
      `;
      
      // Simulate sending to server
      setTimeout(() => {
        submitBtn.innerHTML = '✔ Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        submitBtn.style.color = '#fff';
        submitBtn.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
        
        // Clear form
        contactForm.reset();
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.style.boxShadow = '';
        }, 4000);
      }, 2000);
    });
  }
});
