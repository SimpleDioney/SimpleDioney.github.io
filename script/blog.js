document.addEventListener("DOMContentLoaded", function() {
    const blogPosts = [
      {
        title: "Meu Primeiro Projeto em Python",
        date: "31 de Maio de 2024",
        summary: "Desenvolver meu primeiro projeto em Python foi uma experiência incrível. Neste post, compartilho minhas descobertas e aprendizados ao longo do desenvolvimento.",
        link: "primeiro_projeto.html"
      },
    ];
  
    const blogContainer = document.getElementById('blogPosts');
    if (!blogContainer) {
      console.error('Elemento blogPosts não encontrado');
      return;
    }
  
    blogPosts.forEach(post => {
      const postElement = document.createElement('a');
      postElement.href = post.link;
      postElement.classList.add('blog-post');
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p>Data: ${post.date}</p>
        <p>${post.summary}</p>
      `;
      blogContainer.appendChild(postElement);
    });
  
    console.log('Posts do blog carregados com sucesso');
  
    // Animações de mouse
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
  });
  