MathJax.Hub.Config({
    tex2jax: {inlineMath: [['$','$'], ['\\(', '\\)']],
    displayMath: [['$$','$$'], ["\\[","\\]"]],}
});
emojify.setConfig({
    img_dir: 'https://www.webfx.com/tools/emoji-cheat-sheet/graphics/emojis/',  // Directory for emoji images
});
marked.setOptions({
    langPrefix: "markdown",
    gfm: true,
    breaks: true
});