const mix = require('laravel-mix');

mix.js('resources/js/turbo.js', 'dist/js/turbo.js');
mix.minify('dist/js/turbo.js');
