function toggleMenu() {
    const nav = document.getElementById('nav');
    const menuIcon = document.querySelector('.menu-icon');
    nav.classList.toggle('active');
    menuIcon.classList.toggle('active');
}

function openModal(modalId) {
    document.body.style.overflow = 'hidden'; // Desativa o scrollbar do body
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.body.style.overflow = 'auto'; // Reativa o scrollbar do body
    document.getElementById(modalId).style.display = "none";
}

document.querySelectorAll('nav a, .projects .project, .blog-post').forEach(item => {
    item.addEventListener('mousemove', function(e) {
        for (let i = 0; i < 10; i++) {
            let particle = document.createElement('span');
            particle.classList.add('particle');
            let x = e.offsetX;
            let y = e.offsetY;
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--x', `${(Math.random() - 0.5) * 100}px`);
            particle.style.setProperty('--y', `${(Math.random() - 0.5) * 100}px`);
            item.appendChild(particle);
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    });
});

window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("topBtn").style.display = "block";
  } else {
    document.getElementById("topBtn").style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

const ctx = document.getElementById('skillsChart').getContext('2d');
const skillsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['HTML', 'CSS', 'JavaScript', 'Python'],
        datasets: [{
            label: 'Nível de Proficiência',
            data: [85, 85, 60, 90],
            backgroundColor: [
                'rgba(128, 0, 128, 0.6)',
                'rgba(75, 0, 130, 0.6)',
                'rgba(139, 0, 139, 0.6)',
                'rgba(255, 0, 255, 0.6)'
            ],
            borderColor: [
                'rgba(128, 0, 128, 1)',
                'rgba(75, 0, 130, 1)',
                'rgba(139, 0, 139, 1)',
                'rgba(255, 0, 255, 1)'
            ],
            borderWidth: 1,
            borderRadius: 5,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    color: '#e0e0e0',
                },
                grid: {
                    display: false,
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#e0e0e0',
                },
                grid: {
                    color: 'rgba(128, 0, 128, 0.1)',
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#e0e0e0',
                }
            },
            title: {
                display: true,
                text: 'Habilidades de Programação',
                color: '#e0e0e0',
                font: {
                    size: 18
                }
            }
        }
    }
});


document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const form = event.target;
    const formData = new FormData(form);
    const formMessage = document.getElementById('formMessage');

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            formMessage.textContent = "Mensagem enviada com sucesso!";
            formMessage.classList.add('success');
            formMessage.classList.remove('error');
            form.reset();
        } else {
            return response.json().then(data => {
                if (data.errors) {
                    formMessage.textContent = data.errors.map(error => error.message).join(", ");
                } else {
                    formMessage.textContent = "Ocorreu um erro ao enviar a mensagem.";
                }
                formMessage.classList.add('error');
                formMessage.classList.remove('success');
            });
        }
    }).catch(error => {
        formMessage.textContent = "Ocorreu um erro ao enviar a mensagem.";
        formMessage.classList.add('error');
        formMessage.classList.remove('success');
    });
});


fetch('https://api.github.com/users/SimpleDioney/repos')
  .then(response => response.json())
  .then(data => {
    // Ordena os repositórios pela data de atualização mais recente
    data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    
    const githubFeed = document.getElementById('github-feed');
    data.slice(0, 8).forEach(repo => {  // Ajuste para exibir mais repositórios
      const repoElement = document.createElement('a');
      repoElement.href = repo.html_url;
      repoElement.target = '_blank';
      repoElement.classList.add('github-repo');
      repoElement.innerHTML = `
        <div>
          <a>${repo.name}</a>
          <p>${repo.description ? repo.description : 'Sem descrição disponível.'}</p>
          <div class="repo-info">
            <span class="stars">⭐ ${repo.stargazers_count}</span>
            <span>Atualizado em: ${new Date(repo.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      `;
      githubFeed.appendChild(repoElement);
    });

    // Adiciona o efeito de partículas aos repositórios do GitHub
    document.querySelectorAll('.github-repo').forEach(item => {
      item.addEventListener('mousemove', function(e) {
        for (let i = 0; i < 10; i++) {
          let particle = document.createElement('span');
          particle.classList.add('particle');
          let x = e.offsetX;
          let y = e.offsetY;
          particle.style.left = x + 'px';
          particle.style.top = y + 'px';
          particle.style.setProperty('--x', `${(Math.random() - 0.5) * 100}px`);
          particle.style.setProperty('--y', `${(Math.random() - 0.5) * 100}px`);
          item.appendChild(particle);
          setTimeout(() => {
            particle.remove();
          }, 1000);
        }
      });
    });
  })
  .catch(error => console.error('Erro ao carregar repositórios do GitHub:', error));

function nextImage(carouselId) {
    const carousel = document.getElementById(carouselId);
    const images = carousel.querySelectorAll('img');
    let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add('active');
    updatePreviews(carouselId, currentIndex);
}

function prevImage(carouselId) {
    const carousel = document.getElementById(carouselId);
    const images = carousel.querySelectorAll('img');
    let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    images[currentIndex].classList.add('active');
    updatePreviews(carouselId, currentIndex);
}

function showImage(carouselId, index) {
    const carousel = document.getElementById(carouselId);
    const images = carousel.querySelectorAll('img');
    images.forEach(img => img.classList.remove('active'));
    images[index].classList.add('active');
    updatePreviews(carouselId, index);
}

function updatePreviews(carouselId, index) {
    const previewId = carouselId.replace('carousel', 'preview');
    const previews = document.getElementById(previewId).querySelectorAll('img');
    previews.forEach(preview => preview.classList.remove('active'));
    previews[index].classList.add('active');
}
