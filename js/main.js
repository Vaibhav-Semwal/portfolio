/* Boot order: render content first, then start the features that bind to the DOM. */
(() => {
  const content = window.CONTENT;
  if (!content) {
    console.error("content.js did not load: window.CONTENT is missing.");
    return;
  }

  App.render.all(content);

  App.loader.init();
  App.particles.init();
  App.navigation.init();
  App.rail.init();
  App.shootingStar.init();
  App.reveal.init();
  App.carousel.init();
  App.interactions.init();
  App.logoSecret.init();
  App.brand.init();
  App.orbit.init();
})();
