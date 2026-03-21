// Force horizontal toolbar layout on mobile
document.addEventListener('DOMContentLoaded', function() {
  function fixToolbar() {
    if (window.innerWidth <= 768) {
      const toolbar = document.querySelector('.left.sidebar .flex-component');
      if (toolbar) {
        toolbar.style.flexDirection = 'row';
        toolbar.style.gap = '0.5rem';
      }
    }
  }
  
  fixToolbar();
  window.addEventListener('resize', fixToolbar);
  document.addEventListener('nav', fixToolbar);
});
