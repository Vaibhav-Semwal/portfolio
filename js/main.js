/* Boot order: render content first, then start the features that bind to the DOM. */
(() => {
  const content = window.CONTENT;
  if (!content) {
    console.error("content.js did not load: window.CONTENT is missing.");
    return;
  }

  App.render.all(content);

  App.loader.init();
  App.cursor.init();
  App.particles.init();
  App.navigation.init();
  App.reveal.init();
  App.carousel.init();
  App.interactions.init();
  App.orbit.init();
})();
