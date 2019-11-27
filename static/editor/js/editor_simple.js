var testEditor;

$(function() {
    testEditor = editormd("editormd", {
        width   : "80%",
        height  : 800,
        syncScrolling : "single",
        path    : "editor/lib/",

        // theme        : (localStorage.theme) ? localStorage.theme : "dark",
        // previewTheme : (localStorage.previewTheme) ? localStorage.previewTheme : "dark",
        // editorTheme  : (localStorage.editorTheme) ? localStorage.editorTheme : "pastel-on-dark"
    });

});
